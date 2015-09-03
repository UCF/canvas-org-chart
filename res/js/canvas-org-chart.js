function CanvasOrgChart(id, json) {
	if (id === 'undefined') {
		throw "Parent element must be defined must be defined";
	}
	
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	this.parent = document.getElementById(id);
	this.parent.appendChild(this.canvas);
	
	this.nodes = [];
	this.lines = [];
	
	if (this.ctx === 'undefinied') {
		this.handleNoCanvas();
	}
	
	if (json !== 'undefinied') {
		// Load json data
	} else {
		// Load defaults
	}
	
	this.setConstants();
	
	return this;
}

CanvasOrgChart.prototype.handleNoCanvas = function() {
	// ToDo: Come up with error handling for if canvas is not supported.
	return {
		message: "Canvas is not supported by this browser."
	};
};

CanvasOrgChart.prototype.setConstants = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.parent.offsetHeight;
	this.gridUnit = {
		x: Math.floor(this.canvas.width / 15),
		y: Math.floor(this.canvas.height / 8)
	};
};
