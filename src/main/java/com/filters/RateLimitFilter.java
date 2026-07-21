package com.filters;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitFilter implements Filter {

	private final ConcurrentHashMap<String, Bucket> ipBuckets = new ConcurrentHashMap<>();

	// ✅ Only these pages will be rate limited
	private static final Set<String> RATE_LIMITED_PAGES = new HashSet<>(
			Arrays.asList("/newlogin", "/forgotpass", "/otpval", "/reset", "/Home", "/"));

	private Bucket createNewBucket() {
		// 5 requests per minute per IP for these sensitive pages
		return Bucket.builder().addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)))).build();
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest httpReq = (HttpServletRequest) request;
		HttpServletResponse httpRes = (HttpServletResponse) response;

		// ✅ Skip internal forwards from URL rewriter
		if (httpReq.getDispatcherType() == javax.servlet.DispatcherType.FORWARD) {
			chain.doFilter(request, response);
			return;
		}

		String uri = httpReq.getRequestURI();

		// ✅ Remove context path if present — get clean path
		String contextPath = httpReq.getContextPath(); // e.g. "" or "/myapp"
		String path = uri.substring(contextPath.length());

		// ✅ Only apply rate limit to specific pages
		if (!RATE_LIMITED_PAGES.contains(path)) {
			// Not a rate-limited page — let it pass freely
			chain.doFilter(request, response);
			return;
		}

		// ✅ Normalize IPv6 localhost → IPv4
		String clientIp = normalizeIp(getClientIp(httpReq));

		// ✅ Key = IP + page — separate bucket per page per IP
		String bucketKey = clientIp + "|" + path;

		Bucket bucket = ipBuckets.computeIfAbsent(bucketKey, k -> createNewBucket());
		long remaining = bucket.getAvailableTokens();

//        System.out.println("[RateLimit] URI=" + path +
//                           " | IP=" + clientIp +
//                           " | Tokens remaining=" + remaining);

		if (bucket.tryConsume(1)) {
			chain.doFilter(request, response);
		} else {
//            System.out.println("[RateLimit] BLOCKED: " + clientIp + " | " + path);
			httpRes.setStatus(429);
			httpRes.setHeader("Retry-After", "60");
			httpRes.setContentType("text/html;charset=UTF-8");
			httpRes.getWriter().write("<!DOCTYPE html>" + "<html>" + "<head>" + "  <title>Error</title>"
					+ "  <meta name='viewport' content='width=device-width, initial-scale=1'>" + "  <style>"
					+ "    body {" + "      margin:0;" + "      font-family: 'Segoe UI', Arial, sans-serif;"
					+ "     background: radial-gradient(circle,rgba(255, 255, 255, 1) 0%, rgba(199, 223, 242, 1) 50%);"
					+ "      height:100vh;" + "      display:flex;" + "      justify-content:center;"
					+ "      align-items:center;" + "      color:#333;" + "    }" + "    .container {"
					+ "      background:#fff;" + "      padding:40px;" + "      border-radius:12px;"
					+ "      text-align:center;" + "      box-shadow:0 10px 30px rgba(0,0,0,0.2);"
					+ "      max-width:400px;" + "      width:90%;" + "    }" + "    .code {" + "      font-size:80px;"
					+ "      font-weight:bold;" + "      color:#764ba2;" + "      margin-bottom:10px;" + "    }"
					+ "    .title {" + "      font-size:22px;" + "      margin-bottom:10px;" + "    }"
					+ "    .message {" + "      font-size:14px;" + "      color:#666;" + "      margin-bottom:20px;"
					+ "    }" + "    .btn {" + "      display:inline-block;" + "      padding:10px 20px;"
					+ "      background:#667eea;" + "      color:#fff;" + "      text-decoration:none;"
					+ "      border-radius:6px;" + "      transition:0.3s;" + "    }" + "    .btn:hover {"
					+ "      background:#5a67d8;" + "    }" + "  </style>" + "</head>" + "<body>"
					+ "  <div class='container'>" + "    <div class='code'>429</div>"
					+ "    <div class='title'>Something went wrong. Please try again after some time.</div>"
					+ "    <div class='message'></div>"

					+ "  </div>" + "</body>" + "</html>");
		}
	}

	private String normalizeIp(String ip) {
		if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
			return "127.0.0.1";
		}
		return ip;
	}

	private String getClientIp(HttpServletRequest request) {
		String xForwardedFor = request.getHeader("X-Forwarded-For");
		if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
			return xForwardedFor.split(",")[0].trim();
		}
		return request.getRemoteAddr();
	}

	@Override
	public void destroy() {
		ipBuckets.clear();
	}
}