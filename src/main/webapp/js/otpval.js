let otpTime=60,timerInterval,isOtpVerified=!1;

function startOtpTimer(){const a=document.getElementById('otpTimer');if(!a)return;timerInterval=setInterval(()=>{let b=Math.floor(otpTime/60),c=otpTime%60;a.innerText=`${b.toString().padStart(2,'0')}:${c.toString().padStart(2,'0')}`;otpTime--;if(otpTime<0){clearInterval(timerInterval);a.innerText="OTP expired. Please resend.";a.style.color="#dc2626";a.style.fontWeight="bold";disableOtpInputs();if(!isOtpVerified){hideVerifyButton();showResendButton()}}},1000)}

function stopOtpTimer(){clearInterval(timerInterval)}

function disableOtpInputs(){document.querySelectorAll('.otp-input').forEach(a=>{a.disabled=!0})}

function makeOtpReadonly(){document.querySelectorAll('.otp-input').forEach(a=>{a.disabled=!0;a.style.backgroundColor="#e2e8f0";a.style.cursor="default";a.style.borderColor="#22c55e"})}

function enableOtpInputs(){document.querySelectorAll('.otp-input').forEach(a=>{a.disabled=!1;a.style.backgroundColor="#f8fafc";a.style.cursor="text";a.style.borderColor="#cbd5e1"})}

function hideVerifyButton(){const a=document.querySelector('.submit_button:not(#resendOtpBtn)');if(a)a.style.display='none'}

function showVerifyButton(){const a=document.querySelector('.submit_button:not(#resendOtpBtn)');if(a)a.style.display='block'}

function showResendButton(){if(document.getElementById('resendOtpBtn'))return;const a=document.createElement('button');a.id='resendOtpBtn';a.type='button';a.innerText="Resend OTP";a.className="submit_button";a.style.marginTop="10px";a.style.backgroundColor="#f97316";a.onmouseover=function(){this.style.backgroundColor="#ea580c"};a.onmouseout=function(){this.style.backgroundColor="#f97316"};a.onclick=b=>{b.preventDefault();resendOTP()};const c=document.getElementById('otpTimer');if(c&&c.parentNode)c.parentNode.insertBefore(a,c.nextSibling)}

function removeResendButton(){const a=document.getElementById('resendOtpBtn');if(a)a.remove()}

function resendOTP(){window.location.href='forgotpass.jsp'}

$(document).ready(function(){
disableBackButton();startOtpTimer();$('.otp-input').attr('autocomplete','off');
const O=document.querySelectorAll('.otp-input');
O.forEach((a,i)=>{a.addEventListener('input',e=>{e.target.value=e.target.value.replace(/[^0-9]/g,'');if(a.value.length===1&&i<O.length-1)O[i+1].focus()});a.addEventListener('keydown',e=>{if(e.key==='Backspace'&&a.value===''&&i>0)O[i-1].focus()})});

window.openModalEdit=function(){
const o=Array.from(document.querySelectorAll('.otp-input')).map(i=>i.value).join('');
$('#otpError').text("");$('#productCodeErrorcreditss1').text("");$('#productCodeErrorcreditss3').text("");
let e=!1;
if(!o||o.length!==6){$('#otpError').text("Please enter all 6 digits of OTP");e=!0;return}
if($('#passwordFields').is(':visible')){
const np=document.getElementById("new_password"),cp=document.getElementById("confirm_password"),ne=document.getElementById("productCodeErrorcreditss1"),ce=document.getElementById("productCodeErrorcreditss3");
ne.innerText="";ce.innerText="";
const n=np.value.trim(),c=cp.value.trim();
if(!n){ne.innerText="New password is required";e=!0}else{
const r=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,w=["12345678","password","123456789","qwerty","abc123","123abc"];
if(w.includes(n.toLowerCase())){ne.innerText="Password is too weak. Please choose a stronger password.";e=!0}
else if(!r.test(n)){ne.innerText="Password must be at least 8 characters and include a letter, number, and special character.";e=!0}}
if(!c){ce.innerText="Please confirm password";e=!0}
if(n&&c&&n!==c){ce.innerText="Passwords do not match";e=!0}
if(!e)$('#exampleModalCenterupdate').modal('show')
}else{verifyOTPWithBackend(o)}
};

function verifyOTPWithBackend(o){
showLoadingState(!0,"Verifying OTP...");
$.ajax({url:baseUrl+'/jssl/user/verifyotp',type:'POST',dataType:'json',data:$.param({otp:o}),
success:function(d){
showLoadingState(!1);
if(d.status==="yes"){
isOtpVerified=!0;$('#otpError').text("");stopOtpTimer();
const t=document.getElementById('otpTimer');
t.innerText="OTP Verified";t.style.color="#22c55e";t.style.fontWeight="bold";
makeOtpReadonly();removeResendButton();showSuccessPopupsss("OTP Verified Successfully!");
setTimeout(()=>{
$('#passwordFields').slideDown(300);
document.querySelector('.submit_button').textContent="Submit";
document.querySelector('.submit_button').style.display='block';
document.querySelector('.submit_button').onclick=function(){openModalEdit()};
$('#new_password').focus()
},1500)
}else{isOtpVerified=!1;$('#otpError').text(d.message||"OTP verification failed");showErrorModal(d.message||"OTP verification failed")}
},
error:function(x){
showLoadingState(!1);isOtpVerified=!1;
let m='Error verifying OTP. Please try again.';
if(x.responseJSON&&x.responseJSON.message)m=x.responseJSON.message;
$('#otpError').text(m);showErrorModal(m)
}
})}

window.editevent=function(){
if(!isOtpVerified){showErrorModal("Please verify OTP first");return}
const o=Array.from(document.querySelectorAll('.otp-input')).map(i=>i.value).join(''),n=$('#new_password').val().trim(),c=$('#confirm_password').val().trim();
showLoadingState(!0,"Processing...");
$.ajax({url:baseUrl+'/jssl/user/otpvalidation',type:'POST',dataType:'json',data:$.param({otp:o,newPassword:n,confirmPassword:c}),
success:function(d){
showLoadingState(!1);$('#exampleModalCenterupdate').modal('hide');
const m=d.message||d.Message||'',s=m.toLowerCase();
if(s.includes("successfully")&&s.includes("password")){showSuccessPopup("Password Reset Successfully!")}
else if(d.status==="yes"){showSuccessPopup("Password Reset Successfully!")}
else{showErrorModal(m||'Failed to reset password');if(s.includes("password"))resetForm()}
},
error:function(x){
showLoadingState(!1);$('#exampleModalCenterupdate').modal('hide');
let m='An error occurred. Please try again.';
if(x.responseJSON&&x.responseJSON.message)m=x.responseJSON.message;
showErrorModal(m)
}
})};

function showLoadingState(l,t="Processing..."){
const b=document.querySelector('.submit_button:not(#resendOtpBtn)');if(!b)return;
if(l){b.disabled=!0;b.innerHTML='<i class="fas fa-spinner fa-spin"></i> '+t;b.style.opacity="0.6"}
else{b.disabled=!1;b.style.opacity="1"}}

function resetForm(){
isOtpVerified=!1;enableOtpInputs();
document.querySelectorAll('.otp-input').forEach(a=>{a.value=''});
$('#passwordFields').slideUp(300);
document.querySelector('.submit_button').textContent="Verify OTP";
document.querySelector('.submit_button').onclick=openModalEdit;
document.querySelector('.submit_button').style.display='block';
otpTime=10;clearInterval(timerInterval);
const t=document.getElementById('otpTimer');
t.style.color="inherit";t.style.fontWeight="normal";
removeResendButton();startOtpTimer()}

function showSuccessPopup(m){
$('<div class="popup"><i class="fas fa-check-circle"></i> '+m+'</div>').appendTo('body').hide().fadeIn(400).delay(2000).fadeOut(400,function(){$(this).remove();window.location='newlogin.jsp'})}

function showSuccessPopupsss(m){
$('<div class="popup"><i class="fas fa-check-circle"></i> '+m+'</div>').appendTo('body').hide().fadeIn(400).delay(2000).fadeOut(400,function(){})}

function showErrorModal(m){
$('#errorMessageup').html('<i class="fas fa-exclamation-circle"></i> '+m);$('#exampleModalCenterDupUP').modal('show')}
});

function disableBackButton(){
window.history.pushState(null,null,window.location.href);
window.onpopstate=function(){window.history.pushState(null,null,window.location.href)}}

let inactivityTimer;
function resetInactivityTimer(){clearTimeout(inactivityTimer);inactivityTimer=setTimeout(()=>{logoutUser()},900000)}
window.addEventListener('mousemove',resetInactivityTimer);
window.addEventListener('keydown',resetInactivityTimer);
window.addEventListener('click',resetInactivityTimer);
window.addEventListener('scroll',resetInactivityTimer);

window.logoutUser=function(){
const u=sessionStorage.getItem('user_id');
if(!u){window.location='newlogin.jsp';return}
if(typeof baseUrl==='undefined'||!baseUrl){console.error("baseUrl is not defined.");return}
const url=baseUrl.endsWith('/')?baseUrl+'jssl/user/userlogout':baseUrl+'/jssl/user/userlogout';
$.ajax({url:url,type:'POST',data:$.param({user_id:u}),contentType:'application/x-www-form-urlencoded',dataType:'json',cache:!1,
success:function(d){if(d.status==="yes"||(d.message&&d.message.includes("Success"))){sessionStorage.clear();localStorage.removeItem("selectedFactoryId");window.location="newlogin.jsp"}},
error:function(){window.location="newlogin.jsp"}})};

function toggleNewPassword(){
const i=document.getElementById("new_password"),c=document.getElementById("eyeIconNew");
if(i.type==="password"){i.type="text";c.classList.replace("fa-eye","fa-eye-slash")}else{i.type="password";c.classList.replace("fa-eye-slash","fa-eye")}}

function toggleConfirmPassword(){
const i=document.getElementById("confirm_password"),c=document.getElementById("eyeIconConfirm");
if(i.type==="password"){i.type="text";c.classList.replace("fa-eye","fa-eye-slash")}else{i.type="password";c.classList.replace("fa-eye-slash","fa-eye")}}