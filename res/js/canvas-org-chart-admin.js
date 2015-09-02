function CanvasOrgChartAdmin(canvas_id, json) {
	if (canvas_id === 'undefined') {
		throw "canvas_id must be defined";
	}
	
	this.canvas = document.getElementById(canvas_id);
	this.ctx = this.canvas.getContext('2d');
	if (this.ctx === 'undefinied') {
		this.handleNoCanvas();
	}
	
	if (json !== 'undefinied') {
		// Load json data
	} else {
		// Load defaults
	}
}

CanvasOrgChart.prototype.handleNoCanvas = function() {
	// ToDo: Come up with error handling for if canvas is not supported.
	return {
		message: "Canvas is not supported by this browser."
	}
}