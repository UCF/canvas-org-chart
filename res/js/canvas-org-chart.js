function CanvasOrgChart(id, data, options) {

	var self = this;

	self.defaultOptions = function() {
		return {
			fixedWidth: 1200,
			fixedHeight: 800,
			nodeWidth: 3,
			nodeHeight: 2,
			lineWidth: 1,
			lineColor: '#000'
		};
	};

	self.handleNoCanvas = function() {
		// ToDo: Come up with error handling for if canvas is not supported.
		return {
			message: "SVG is not supported by this browser."
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

		var set_width = self.parent.offsetWidth,
			set_height = set_width / 4 * 3;

		self.svg.setAttribute('width', set_width);
		self.svg.setAttribute('height', set_height);

		self.gridUnit = {
			x: Math.floor(set_width / 15),
			y: Math.floor(set_height / 15)
		};
	};

	self.init = function() {
		if (id === 'undefined') {
			throw "Parent element must be defined must be defined";
		}

		if (!(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0"))) {
			handleNoCanvas();
			return;
		}

		self.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		self.svg.style.position = 'absolute';
		self.svg.style.left = '0';
		self.svg.style.top = '0';

		self.parent = document.getElementById(id);
		self.parent.style.position = 'relative';
		self.parent.appendChild(self.svg);

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

		self.setConstants();

		self.render();

		return self;
	};

	return self.init();
}
