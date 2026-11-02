<%@ page import="java.io.File" %>
<%!
    // Returns the last-modified time of a file, used as its version
    private String ver(javax.servlet.ServletContext ctx, String path) {
        String real = ctx.getRealPath(path);
        if (real == null) return "1";
        File f = new File(real);
        return f.exists() ? String.valueOf(f.lastModified()) : "1";
    }
%>