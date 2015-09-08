function CanvasOrgChart(id, data, options) {
	
	var self = this;
	
	self.defaultOptions = function() {
		return {
			backgroundColor: '#fff',
			fixedWidth: 1200,
			fixedHeight: 800,
			nodeTitleFontFamily: "Arial",
			nodeTitleFontSize: 24,
			nodeTitleFontColor: '#000',
			nodeContentFontFamily: "Arial",
			nodeContentFontSize: 18,
			nodeContentFontColor: '#000',
			nodeBackgrounColor: '#efefef',
			nodeWidth: 3,
			nodeHeight: 2,
			nodeBorderWidth: 1,
			nodeBorderColor: '#acacac',
			nodeBorderRadius: 3,
			lineWidth: 1,
			lineColor: '#000'
		};
	};
	
	self.handleNoCanvas = function() {
		// ToDo: Come up with error handling for if canvas is not supported.
		return {
			message: "Canvas is not supported by this browser."
		};
	};
	
	self.render = function() {
		for (var n in self.nodes) {
			self.nodes[n].render();
		}
		
		for (var l in self.lines) {
			self.lines[l].render();
		}
	};
	
	self.setConstants = function() {
		self.canvas.width = self.parent.offsetWidth;
		self.canvas.height = self.canvas.width / 4 * 3;
		var canvasRect = self.canvas.getBoundingClientRect();
		self.overlay.style.top = canvasRect.top + 'px';
		self.overlay.style.left = canvasRect.left + 'px';
		self.overlay.style.width = canvasRect.width + 'px';
		self.overlay.style.height = canvasRect.height + 'px';
		self.rect = self.canvas.getBoundingClientRect();
		self.gridUnit = {
			x: Math.floor(self.canvas.width / 15),
			y: Math.floor(self.canvas.height / 15)
		};
	};
	
	self.__init__ = function() {
		if (id === 'undefined') {
			throw "Parent element must be defined must be defined";
		}
		
		self.canvas = document.createElement('canvas');
		self.ctx = self.canvas.getContext('2d');
		
		self.overlay = document.createElement('div');
		self.overlay.style.position = 'absolute';
		
		self.parent = document.getElementById(id);
		self.parent.appendChild(self.canvas);
		self.parent.appendChild(self.overlay);
		
		self.options = self.defaultOptions();
		
		// Merge default options with options passed in.
		if (options !== 'undefined') {
			for (var key in options) {
				self[key] = options[key];
			}
		}
		
		self.nodes = [];
		self.lines = [];
		
		if (data !== 'undefinied') {
			for (var node in data.nodes) {
				self.nodes.push(new ChartNode(self, data.nodes[node]));
			}
			
			for (var line in data.lines) {
				self.lines.push(new ChartLine(self, data.lines[line]));
			}
		} else {
			// do something else...
		}
		
		if (self.ctx === 'undefinied') {
			self.handleNoCanvas();
		}
		
		self.setConstants();
		
		self.render();
		
		return self;
	};
	
	return self.__init__();
}
