function r(p){
let h=window.location.pathname;

if(![p.qs_submodule,p.invoice_module,p.scrap_submodule,p.reports_submodule,p.masters_submodule].includes(1)){
u(p);
window.location="Landingpage.jsp";
return;
}

(p.qs_submodule===0&&h.includes("QApackage.jsp"))||
(p.invoice_module===0&&h.includes("invoicesidemenu.jsp"))||
(p.scrap_submodule===0&&h.includes("Scrap.jsp"))||
(p.reports_submodule===0&&h.includes("Reports.jsp"))||
(p.masters_submodule===0&&h.includes("newmaster.jsp"))
?window.location="no-access.html":0;
}

function u(p){
p.invoice_module===0&&$("#invoice-module").hide();
p.qs_submodule===0&&$("#qs-package").hide();
p.scrap_submodule===0&&$("#scrap-module").hide();
p.reports_submodule===0&&$("#reports-module").hide();
p.masters_submodule===0&&$("#masters-module").hide();
}

$(document).ready(function(){
let p=JSON.parse(sessionStorage.getItem("userPermissions"));
p&&(u(p),r(p));
});