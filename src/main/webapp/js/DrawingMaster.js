$(document).ready(function () {

    // Shift Count
    $.ajax({
        url: new URL("/api/shift/count", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },

        success: function (data) {
            $("#shiftcount").text(data);
        },
        error: function (err) {
            console.error("Shift Count Error", err);
        }
    });

    // Type Selection Count
    $.ajax({
        url: new URL("/api/type_selection/count", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },

        success: function (data) {
            $("#selectioncount").text(data);
        },
        error: function (err) {
            console.error("Type Selection Count Error", err);
        }
    });

    // Activity Category Count
    $.ajax({
        url: new URL("/api/activity_category/count", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },

        success: function (data) {
            $("#activitycount").text(data);
        },
        error: function (err) {
            console.error("Activity Count Error", err);
        }
    });

    // Modal Assign Count
    $.ajax({
        url: new URL("/api/modalassign/count", baseUrl).toString(),
        type: "GET",
        xhrFields: { withCredentials: true },

        success: function (data) {
            $("#modalassigncount").text(data);
        },
        error: function (err) {
            console.error("Modal Assign Count Error", err);
        }
    });

	
	// Reason Selection
	
	
	
	$.ajax({
	    url: new URL("/api/reason_selection/count", baseUrl).toString(),
	    type: "GET",
	    xhrFields: { withCredentials: true },

	    success: function (data) {
	        $("#reasoncount").text(data);
	    },
	    error: function (err) {
	        console.error("Reason Count Error", err);
	    }
	});
	
	// Stage Count

	$.ajax({
	    url: new URL("/api/drawing_stage/count", baseUrl).toString(),
	    type: "GET",
	    xhrFields: { withCredentials: true },

	    success: function (data) {
	        $("#stagecount").text(data);
	    },
	    error: function (err) {
	        console.error("Stage Count Error", err);
	    }
	});
	
	function loadTypeStageCount() {
		$.ajax({
			url: new URL("/api/selection_stage/getAll", baseUrl).toString(),
			type: "GET",
			xhrFields: { withCredentials: true },

			success: function (data) {
				// 204 No Content -> data is undefined
				let typeIds = {};
				$.each(data || [], function (i, r) { typeIds[r.typeId] = true; });
				$("#typeStageCount").text(Object.keys(typeIds).length);
			},
			error: function (err) {
				console.error("Type Selection Stage count error:", err);
				$("#typeStageCount").text("0");
			}
		});
	}

	loadTypeStageCount();
});
