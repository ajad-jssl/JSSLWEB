// ===== REAL API INTEGRATION =====
var allData = [];
var summaryByType = [];
var grandTotal = {};
var dCh = null, bCh = null;
var currentFilter = 'ALL';

// ===== TYPE MAPPING FOR UI =====
var typeMapping = {
  'ADVANCED': 'ADV',
  'DELIVERY_CHALLAN': 'DC',
  'STEEL': 'STEEL',
  'DEBIT_NOTE': 'DB',
  'CREDIT_INVOICE': 'CR',
  'CONSOLIDATED_INVOICE': 'CON',
  'OTHERS_INVOICE': 'OTH',
  'SCRAP_INVOICE': 'SCP'
};

var typeDisplayNames = {
  'ADVANCED': 'Advance',
  'DELIVERY_CHALLAN': 'Delivery Challan',
  'STEEL': 'Steel',
  'DEBIT_NOTE': 'Debit Note',
  'CREDIT_INVOICE': 'Credit Invoice',
  'CONSOLIDATED_INVOICE': 'Consolidated',
  'OTHERS_INVOICE': 'Others',
  'SCRAP_INVOICE': 'Scraps'
};

// ===== LOAD DATA FROM REAL APIs =====
function loadData() {
 /* var baseUrl = 'http://localhost:8004';*/
  
  Promise.all([
    fetch(baseUrl + '/api/invoices/summary/by-type', { 
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()),
    fetch(baseUrl + '/api/invoices/summary/grand-total', { 
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
  ])
  .then(function([byType, grand]) {
    summaryByType = byType || [];
    grandTotal = grand || {};
    initDashboard();
  })
  .catch(function(error) {
    console.error('Error loading data:', error);
    alert('Error loading dashboard data. Please check console.');
  });
}

function initDashboard() {
  /*if (!grandTotal || !grandTotal.totalCount) {
    console.warn('No data available');
    return;
  }*/

  var tot = grandTotal.totalCount || 0;
  var v = grandTotal.verifiedCount || 0;
  var c = grandTotal.cancelCount || 0;
  var n = tot - v - c;

  updateStatusBanners(tot, v, n, c);
  set('typeLabel', 'All Types');

  // Update module type counts
  set('mc-ALL', tot);
  
  // Map types from API response to UI
  summaryByType.forEach(function(item) {
    var type = item.invoiceType;
    var uiKey = typeMapping[type];
    if (uiKey) {
      set('mc-' + uiKey, item.totalCount);
    }
  });

  buildDonut(v, n, c, tot);
  buildBar();
}

function updateStatusBanners(tot, v, n, c) {
  var pV = tot ? Math.round(v/tot*100) : 0;
  var pN = tot ? Math.round(n/tot*100) : 0;
  var pC = tot ? Math.round(c/tot*100) : 0;

  // Update counts with animation
  count('stTotal', tot);
  count('stV', v);
  count('stN', n);
  count('stC', c);
  set('stVp', pV+'% of total');
  set('stNp', pN+'% of total');
  set('stCp', pC+'% of total');

  // Animate spark bars
  setTimeout(function() { 
    w('sp-v', pV); 
    w('sp-n', pN); 
    w('sp-c', pC); 
  }, 440);
}

function buildDonut(v, n, c, tot) {
  var ctx = document.getElementById('donutChart').getContext('2d');
  if (dCh) { dCh.destroy(); }
  
  // Get the amounts from the API data
  var verifiedAmount = 0, notVerifiedAmount = 0, cancelledAmount = 0, totalAmount = 0;
  
  if (currentFilter === 'ALL') {
    verifiedAmount = grandTotal.verifiedAmount || 0;
    cancelledAmount = grandTotal.cancelAmount || 0;
    totalAmount = grandTotal.totalAmount || 0;
    notVerifiedAmount = totalAmount - verifiedAmount - cancelledAmount;
  } else {
    var selectedData = summaryByType.find(function(item) {
      return item.invoiceType === currentFilter;
    });
    if (selectedData) {
      verifiedAmount = selectedData.verifiedAmount || 0;
      cancelledAmount = selectedData.cancelAmount || 0;
      totalAmount = selectedData.totalAmount || 0;
      notVerifiedAmount = totalAmount - verifiedAmount - cancelledAmount;
    }
  }
  
  // Plugin to draw total amount in center only
  var amountDisplayPlugin = {
    afterDraw: function(chart) {
      var width = chart.width;
      var height = chart.height;
      var ctx = chart.ctx;
      
      ctx.save();
      
      // Draw total amount in center
      var fontSize = (height / 120).toFixed(2);
      ctx.font = "bold " + fontSize*12 + "px 'Plus Jakarta Sans'";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "#1c2e1c";
      
      var centerX = width / 2;
      var centerY = height / 2;
      var lakhs = totalAmount / 100000;
      var text = '\u20B9' + lakhs.toFixed(2) + 'L';
      
      ctx.fillText(text, centerX, centerY);
      
      ctx.restore();
    }
  };
  
  dCh = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Verified','Not Verified','Cancelled'],
      datasets: [{ 
        data:[v,n,c], 
     backgroundColor: ['#81C784', '#FFB74D', '#E57373'],
        borderWidth:3, 
        borderColor:'#fff', 
        hoverOffset:8 
      }]
    },
    options: {
      cutoutPercentage: 70,
      legend: { display:false },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: { 
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleFontSize: 12,
        bodyFontSize: 13,
        bodyFontStyle: 'bold',
        displayColors: false,
        cornerRadius: 6,
        xPadding: 15,
        yPadding: 12,
        callbacks: { 
          title: function(t) {
            return t[0].label;
          },
          label: function(t,d) {
            var idx = t.index;
            var count = d.datasets[0].data[idx];
            var amounts = [verifiedAmount, notVerifiedAmount, cancelledAmount];
            var amount = amounts[idx];
            var pct = tot ? Math.round(count/tot*100) : 0;
            var lakhs = amount / 100000;
            return '\u20B9' + lakhs.toFixed(2) + 'L (' + pct + '%)';
          },
          afterLabel: function(t,d) {
            var idx = t.index;
            var counts = [v, n, c];
            var count = counts[idx];
            return count + ' invoice' + (count !== 1 ? 's' : '');
          }
        }
      }
    },
    plugins: [amountDisplayPlugin]
  });

  var cols=['#81C784', '#FFB74D', '#E57373'],
   
      lbls=['Verified','Not Verified','Cancelled'], 
      vals=[v,n,c],
      amts=[verifiedAmount, notVerifiedAmount, cancelledAmount];
  var leg = document.getElementById('donutLegend');
  leg.innerHTML = '';
  for (var i=0; i<lbls.length; i++) {
    var pct = tot ? Math.round(vals[i]/tot*100) : 0;
    var lakhs = amts[i] / 100000;
    var amtFormatted = '\u20B9' + lakhs.toFixed(2) + 'L';
    leg.innerHTML +=
      '<div class="dl-row">' +
        '<span class="dl-l"><span class="dl-dot" style="background:'+cols[i]+'"></span>'+lbls[i]+'</span>' +
        '<span class="dl-v" style="color:'+cols[i]+'">'+amtFormatted+'&nbsp;<small style="font-weight:400;color:#bbb;">('+pct+'%)</small></span>' +
      '</div>';
  }
}

/* BAR – all 8 types, 8 colours, responsive=true, with amount labels inside bars */
function buildBar() {
  var lm = {
    'ADVANCED': 'Advance',
    'DELIVERY_CHALLAN': 'Challan',
    'STEEL': 'Steel',
    'DEBIT_NOTE': 'Debit',
    'CREDIT_INVOICE': 'Credit',
    'CONSOLIDATED_INVOICE': 'Consolidated',
    'OTHERS_INVOICE': 'Others',
    'SCRAP_INVOICE': 'Scraps'
  };
  
  var colMap = {
    'ADVANCED': '#748FFC',              // softer blue
    'DELIVERY_CHALLAN': '#9775FA',      // soft purple
    'STEEL': '#FFB74D',                 // light orange
    'DEBIT_NOTE': '#81C784',            // soft green
    'CREDIT_INVOICE': '#F06292',        // soft pink/red
    'CONSOLIDATED_INVOICE': '#4DD0AE',  // light teal
    'OTHERS_INVOICE': '#FFCC80',        // pale orange
    'SCRAP_INVOICE': '#ADB5BD'          // soft grey
  };

  var labs=[], cnts=[], cols=[], amounts=[];
  
  summaryByType.forEach(function(item) {
    var type = item.invoiceType;
    labs.push(lm[type] || type);
    cnts.push(item.totalCount);
    cols.push(colMap[type] || '#888');
    amounts.push(item.totalAmount || 0);
  });

  var ctx = document.getElementById('barChart').getContext('2d');
  if (bCh) { bCh.destroy(); }
  
  // Plugin to draw amount labels inside bars with auto-fitting font size
  var amountLabelsPlugin = {
    afterDatasetsDraw: function(chart) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function(dataset, i) {
        var meta = chart.getDatasetMeta(i);
        meta.data.forEach(function(bar, index) {
          var amount = amounts[index];
          if (amount === 0) return; // Skip if no amount
          
          var lakhs = amount / 100000;
          var text = lakhs.toFixed(2) + 'L';
          
          // Get bar dimensions
          var x = bar._model.x;
          var y = bar._model.y;
          var width = bar._model.width;
          var chartAreaBottom = chart.chart.chartArea.bottom;
          var height = chartAreaBottom - y;
          
          // Auto-fit font size based on bar height
          // Min 9px, Max 14px, scales with bar height
          var fontSize = Math.max(9, Math.min(14, height / 4));
          
          ctx.save();
          ctx.font = "bold " + fontSize + "px 'Plus Jakarta Sans'";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#fff";
          
          // Add subtle shadow for readability
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          
          // Draw text inside bar (vertically centered)
          ctx.fillText(text, x, y + height / 2);
          
          ctx.restore();
        });
      });
    }
  };
  
  bCh = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labs,
      datasets: [{
        label: 'Invoices',
        data: cnts,
        backgroundColor: cols,
        borderSkipped: false,
        minBarLength: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{
          gridLines: { display: false },
          ticks: { fontSize: 10, fontFamily: 'Plus Jakarta Sans' }
        }],
        yAxes: [{
          gridLines: { color: '#f0f0f0' },
          ticks: { 
            min: 0, 
            stepSize: 1, 
            fontSize: 10, 
            fontFamily: 'Plus Jakarta Sans',
            beginAtZero: true
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(t, d) { 
            var invoiceCount = t.yLabel;
            var amount = amounts[t.index];
            var lakhs = amount / 100000;
            var amountStr = lakhs.toFixed(2) + 'L';
            return amountStr + ' (' + invoiceCount + ' invoice' + (invoiceCount !== 1 ? 's' : '') + ')';
          }
        }
      }
    },
    plugins: [amountLabelsPlugin]
  });
}

/* MODULE CLICK - FILTER BY TYPE */
function goType(tp, el) {
  var all = document.querySelectorAll('.mod');
  for (var i=0; i<all.length; i++) { all[i].classList.remove('active'); }
  el.classList.add('active');
  
  currentFilter = tp;
  
  // Filter and display data for selected type
  if (tp === 'ALL') {
    // Show grand total data
    var tot = grandTotal.totalCount || 0;
    var v = grandTotal.verifiedCount || 0;
    var c = grandTotal.cancelCount || 0;
    var n = tot - v - c;
    updateStatusBanners(tot, v, n, c);
    buildDonut(v, n, c, tot);
    set('typeLabel', 'All Types');
  } else {
    // Find the selected type data
    var selectedData = summaryByType.find(function(item) {
      return item.invoiceType === tp;
    });
    
    if (selectedData) {
      var tot = selectedData.totalCount || 0;
      var v = selectedData.verifiedCount || 0;
      var c = selectedData.cancelCount || 0;
      var n = tot - v - c;
      updateStatusBanners(tot, v, n, c);
      buildDonut(v, n, c, tot);
      set('typeLabel', typeDisplayNames[tp] || tp);
    }
  }
  
  // Bar chart always shows all types - NO CHANGE
}

/* HELPERS */
function set(id,val)  { 
  var e=document.getElementById(id); 
  if(e) e.textContent=val; 
}

function w(id,pct)    { 
  var e=document.getElementById(id); 
  if(e) e.style.width=pct+'%'; 
}

function count(id, target) {
  var el=document.getElementById(id); 
  if(!el) return;
  var cur=0, step=Math.ceil(target/25)||1;
  var t=setInterval(function(){
    cur=Math.min(cur+step,target);
    el.textContent=cur;
    if(cur>=target) clearInterval(t);
  }, 35);
}

/* INACTIVITY LOGOUT */
var _it;
function _ri(){
  clearTimeout(_it);
  _it=setTimeout(function(){
    logoutUser(new Event('logout'));
  }, 900000);
}

document.onmousemove=_ri;
document.onkeydown=_ri;
document.onclick=_ri;
document.onscroll=_ri;
_ri();


function populateContractDropdown() {
    return $.ajax({
        url: new URL("/api/drawingentry/contractlist", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true }
    }).then(response => {
        $(".contractSelect").each(function() {
            const dropdown = $(this);
            dropdown.empty().append('<option value="">Select Contract</option>');
            $("<option>", {
                value: "ALL",
                text: "All"
            }).appendTo(dropdown)
            
            if (response?.Data?.length) {
                response.Data.forEach(contract => {
                    $("<option>", {
                        value: contract.contract_id,
                        text: contract.jobCode
                    }).appendTo(dropdown);
                });
            }
        });
    });
}
// Load data on page ready
$(document).ready(function(){ 
  loadData(); 
  populateContractDropdown();
  $('.regionFilter').on('change', function () {

      // Uncheck all except the clicked one
      $('.regionFilter').not(this).prop('checked', false);

      // If user unchecks everything → default to ALL
      if (!$('.regionFilter:checked').length) {
        $('.regionFilter[value="ALL"]').prop('checked', true);
      }
	  $('.contractSelect').val('');

      // Get selected value
      var selectedFactory = $('.regionFilter:checked').val();

      console.log("Selected Factory:", selectedFactory);

      // Call new function (NOT loadData)
      onFactoryChange(selectedFactory);

    });
	
	
	
	$('.contractSelect').on('change', function () {

	      // Uncheck all except the clicked one
	     


	      // Get selected value
	      var selectContract = $('.contractSelect').val();

	      console.log("Selected Contract:", selectContract);

	      // Call new function (NOT loadData)
	      onContractChange(selectContract);

	    });
  
});


function onContractChange(selectContract){
	var selectedFactory = $('.regionFilter:checked').val();
	let factory = null;
	if(selectContract === "ALL" || selectContract === ''){
		 
		 onFactoryChange(selectedFactory);
		 return;
	}
	
	
	if(selectedFactory === "ALL"){
		factory=''; 
	}
	else{
		factory = selectedFactory;
	}
	
/*	var baseUrl = 'http://localhost:8004';*/
		  
		  Promise.all([
		    fetch(baseUrl + `/api/invoices/summary/invoice-types?factoryId=${factory}&contractId=${selectContract}`, { 
		      method: 'GET',
		      credentials: 'include',
		      headers: { 'Content-Type': 'application/json' }
		    }).then(r => r.json()),
		    fetch(baseUrl + `/api/invoices/summary/Contracts?factoryId=${factory}&contractId=${selectContract}`, { 
		      method: 'GET',
		      credentials: 'include',
		      headers: { 'Content-Type': 'application/json' }
		    }).then(r => r.json())
		  ])
		  .then(function([byType, grand]) {
		    summaryByType = byType || [];
		    grandTotal = grand || {};
		    initDashboard();
		  })
		  .catch(function(error) {
		    console.error('Error loading data:', error);
		    alert('Error loading dashboard data. Please check console.');
		  });
	
	
}


function onFactoryChange(factoryId) {
	if(factoryId === "ALL"){
		
		loadData();
		return;
	}
	
/*	var baseUrl = 'http://localhost:8004';*/
	  
	  Promise.all([
	    fetch(baseUrl + `/api/invoices/summary/by-type/factory?factory_id=${factoryId}`, { 
	      method: 'GET',
	      credentials: 'include',
	      headers: { 'Content-Type': 'application/json' }
	    }).then(r => r.json()),
	    fetch(baseUrl + `/api/invoices/summary/grand-total/factory?factory_id=${factoryId}`, { 
	      method: 'GET',
	      credentials: 'include',
	      headers: { 'Content-Type': 'application/json' }
	    }).then(r => r.json())
	  ])
	  .then(function([byType, grand]) {
	    summaryByType = byType || [];
	    grandTotal = grand || {};
	    initDashboard();
	  })
	  .catch(function(error) {
	    console.error('Error loading data:', error);
	    alert('Error loading dashboard data. Please check console.');
	  });
  
}