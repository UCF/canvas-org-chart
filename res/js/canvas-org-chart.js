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
		self.renderNodes();
		self.renderLines();
	};

	self.renderNodes = function() {
		for (var n in self.nodes) {
			self.nodes[n].render();
		}
	};

	self.renderLines = function() {

		var connections = []
		var line_data = {};

		$('.org-line').remove();
		self.lines = [];

		for (var i in self.nodes) {
			start_node = self.nodes[i];
			end_node = false;
			for (var f in self.nodes) {
				if (self.nodes[f].parent !== "undefined" && self.nodes[f].parent == start_node.title) {
					connections.push({to: start_node, from: self.nodes[f]})
				}
			}
		}

		console.log(connections);

		for (var i in connections) {

			start_node = connections[i].to;
			end_node = connections[i].from;

			line_data = {};
			line_data.waypoints = [];

			// create line down
			line_data.waypoints.push({
				from: {
					x: start_node.coords.x,
					y: start_node.coords.y + 0.75
				},
				to: {
					x: start_node.coords.x,
					y: end_node.coords.y + 0.75
				}
			});
			self.lines.push(new ChartLine(self, line_data));

			// create horizontal line
			line_data.waypoints = [];
			line_data.waypoints.push({
				from: {
					x: start_node.coords.x,
					y: end_node.coords.y + 0.75
				},
				to: {
					x: end_node.coords.x,
					y: end_node.coords.y + 0.75
				}
			});

			self.lines.push(new ChartLine(self, line_data));

		}

		console.log(self.lines);

		for (var l in self.lines) {
			self.lines[l].render();
		}
	};

	self.setConstants = function() {

		//var set_width = self.parent.offsetWidth,
		var set_width = self.container.offsetWidth,
			set_height = set_width / 4 * 3;

		self.container.style.height = set_height + 'px';

		// self.svg.setAttribute('width', set_width);
		// self.svg.setAttribute('height', set_height);

		self.gridUnit = {
			x: Math.floor(set_width / 15),
			y: Math.floor(set_height / 15)
		};
	}

	self.init = function() {
		if (id === 'undefined') {
			throw "Parent element must be defined must be defined";
		}

		if (!(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0"))) {
			handleNoCanvas();
			return;
		}

		self.container = document.getElementById(id),
		    x = 0, y = 0;
		self.container.style.background = "#ccc";


		self.setConstants();

		interact('.chart-node')
		  .draggable({
		    snap: {
		      targets: [
		        interact.createSnapGrid({
		        	x: self.gridUnit.x,
		        	y: self.gridUnit.y
		        })
		      ],
		      range: Infinity,
		      relativePoints: [ { x: 0, y: 0 } ]
		    },
		    inertia: false,
		    restrict: {
		      restriction: "parent",
		      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
		      endOnly: true
		    }
		  })
		  .on('dragstart', function (event) {
		  	console.log(event);

		    x = event.x0; // + event.dx;
		    y = event.y0; //+ event.dy;

		    event.target.style.webkitTransform =
		    event.target.style.transform =
		        'translate(' + x + 'px, ' + y + 'px)';
		  }).on('dragmove', function (event) {
		    x += event.dx;
		    y += event.dy;

		    event.target.style.webkitTransform =
		    event.target.style.transform =
		        'translate(' + x + 'px, ' + y + 'px)';

		    event.target.setAttribute('dragged-x', x);
		    event.target.setAttribute('dragged-y', y);

		    for (i in self.nodes) {
		    	if (self.nodes[i].title == event.target.getAttribute('data-title')) {
		    		self.nodes[i].coords.x = event.target.getAttribute('dragged-x')/self.gridUnit.x;
		    		self.nodes[i].coords.y = event.target.getAttribute('dragged-y')/self.gridUnit.y;
		    	}
		    }
				self.renderLines();


		  }).on('dragend', function (event) {

		  	// we know where it's dropped based on the grid unit
		    console.log("x", parseInt(event.target.getAttribute('dragged-x'))/self.gridUnit.x);
		    console.log("y", parseInt(event.target.getAttribute('dragged-y'))/self.gridUnit.y);

		    for (i in self.nodes) {
		    	if (self.nodes[i].title == event.target.getAttribute('data-title')) {
		    		self.nodes[i].coords.x = event.target.getAttribute('dragged-x')/self.gridUnit.x;
		    		self.nodes[i].coords.y = event.target.getAttribute('dragged-y')/self.gridUnit.y;
		    	}
		    }
				self.renderLines();
		  });

		// Merge default options with options passed in.
		if (options !== 'undefined') {
			for (var key in options) {
				self[key] = options[key];
			}
		}

		self.nodes = [];
		self.lines = [];

		if (data !== 'undefined') {
			for (var node in data.nodes) {
				console.log(data.nodes[node]);
				self.nodes.push(new ChartNode(self, data.nodes[node]));
			}
		}

		self.render();

		return self;
	};

	return self.init();
}
