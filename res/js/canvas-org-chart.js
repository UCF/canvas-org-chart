function CanvasOrgChart(id, data, options) {
	if (id === 'undefined') {
		throw "Parent element must be defined must be defined";
	}
	
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	this.parent = document.getElementById(id);
	this.parent.appendChild(this.canvas);
	
	this.options = this.defaultOptions();
	
	// Merge default options with options passed in.
	if (options !== 'undefined') {
		for (var key in options) {
			this[key] = options[key];
		}
	}
	
	this.nodes = [];
	this.lines = [];
	this.isPlaying = true;
	
	if (this.ctx === 'undefinied') {
		this.handleNoCanvas();
	}
	
	if (data !== 'undefinied') {
		for (var node in data.nodes) {
			this.nodes.push(new ChartNode(this.chart, data.nodes[node]));
		}
		 
		for (var line in data.lines) {
			this.lines.push(new ChartLine(this.chart, data.lines[line]));
		}
	} else {
		// do something else...
	}
	
	this.setConstants();
	
	var self = this;
	
	setInterval(function() { self.play(); }, 1000 / 24);
	
	console.log(this);
	
	return this;
}

// Public function for getting 
CanvasOrgChart.prototype.defaultOptions = function() {
	return {
		backgroundColor: (255, 255, 255),
		fixedWidth: 1200,
		fixedHeight: 800,
		nodeTitleFontFamily: "Arial",
		nodeTitleFontSize: 24,
		nodeTitleFontColor: (255, 255, 255),
		nodeContentFontFamily: "Arial",
		nodeContentFontSize: 18,
		nodeContentFontColor: (255, 255, 255),
		nodeBackgrounColor: (30, 30, 30),
		nodeWidth: 3,
		nodeHeight: 2,
		nodeBorderWidth: 1,
		nodeBorderColor: (50, 50, 50, 1),
		nodeBorderRadius: 3,
		lineWidth: 1,
		lineColor: (0, 0, 0, 1)
	};
};

CanvasOrgChart.prototype.handleNoCanvas = function() {
	// ToDo: Come up with error handling for if canvas is not supported.
	return {
		message: "Canvas is not supported by this browser."
	};
};

CanvasOrgChart.prototype.play = function() {
	if (this.isPlaying) {
		
		this.ctx.fillStyle = (0,0,0);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		for (var n in this.nodes) {
			var node = this.nodes[n];
			node.update();
			node.draw();
		}
		
		for (var l in this.lines) {
			var line = this.lines[l];
			line.update();
			line.draw();
		}	
	}
};

CanvasOrgChart.prototype.setConstants = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.canvas.width / 4 * 3;
	this.gridUnit = {
		x: Math.floor(this.canvas.width / 15),
		y: Math.floor(this.canvas.height / 8)
	};
};
