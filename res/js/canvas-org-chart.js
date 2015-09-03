function CanvasOrgChart(id, json, options) {
	if (id === 'undefined') {
		throw "Parent element must be defined must be defined";
	}
	
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	this.parent = document.getElementById(id);
	this.parent.appendChild(this.canvas);
	
	this.nodes = [];
	this.lines = [];
	this.isPlaying = true;
	
	if (this.ctx === 'undefinied') {
		this.handleNoCanvas();
	}
	
	if (json !== 'undefinied') {
		// Load data
	} else {
		// Load defaults
	}
	
	this.setConstants();
	
	var self = this;
	
	setInterval(function() { self.play(); }, 1000 / 24);
	
	return this;
}

CanvasOrgChart.prototype.play = function() {
	if (this.isPlaying) {
		this.ctx.fillStyle = (0,0,0);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		for (var node in this.nodes) {
			node.update();
			node.draw();
		}
		
		for (var line in this.lines) {
			line.update();
			line.draw();
		}	
	}
};

CanvasOrgChart.prototype.handleNoCanvas = function() {
	// ToDo: Come up with error handling for if canvas is not supported.
	return {
		message: "Canvas is not supported by this browser."
	};
};

CanvasOrgChart.prototype.setConstants = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.canvas.width / 4 * 3;
	this.gridUnit = {
		x: Math.floor(this.canvas.width / 15),
		y: Math.floor(this.canvas.height / 8)
	};
};
