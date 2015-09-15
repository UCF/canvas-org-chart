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
		self.renderLines();
		self.renderNodes();
		self.updateOutput();
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

		// collect node connections
		for (var i in self.nodes) {
			var start_node = self.nodes[i];
			end_node = false;
			for (var f in self.nodes) {
				if (self.nodes[f].parent !== "undefined" && self.nodes[f].parent == start_node.title) {
					connections.push({to: start_node, from: self.nodes[f]})
				}
			}
		}

		// based on node connections, create needed lines
		for (var i in connections) {
			self.lines = self.lines.concat(self.createWaypoints(connections[i].to, connections[i].from));
		}

		// render calculated lines
		for (var l in self.lines) {
			self.lines[l].render();
		}
	};

	self.updateOutput = function() {
		var svgOutput = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + $('#'+id).html() + '</svg>';
		$('#output').html( svgOutput );
		$('#preview svg').html( $('#'+id).html() );
		$('#data').val( JSON.stringify(data) );
	};

	self.createWaypoints = function(start_node, end_node) {

		var line_data = {};
		var lines = []
		line_data.waypoints = [];

		// create line down
		// line_data.waypoints.push({
		// 	from: {
		// 		x: start_node.coords.x,
		// 		y: start_node.coords.y + 0.75
		// 	},
		// 	to: {
		// 		x: start_node.coords.x,
		// 		y: end_node.coords.y + 0.75
		// 	}
		// });
		// lines.push(new ChartLine(self, line_data));

		// // create horizontal line
		// line_data.waypoints = [];
		// line_data.waypoints.push({
		// 	from: {
		// 		x: start_node.coords.x,
		// 		y: end_node.coords.y + 0.75
		// 	},
		// 	to: {
		// 		x: end_node.coords.x,
		// 		y: end_node.coords.y + 0.75
		// 	}
		// });
		// lines.push(new ChartLine(self, line_data));

		if (typeof end_node.stroke !== "undefined" &&
				typeof end_node.stroke.style !== "undefined") {
			line_data["style"] = end_node.stroke.style;
		}

		// If the line should be direct (diagonal), draw the single line
		if (typeof end_node.stroke !== "undefined" &&
				typeof end_node.stroke.direction !== "undefined" &&
				end_node.stroke.direction == "direct") {

			line_data.waypoints.push({
				from: {
					x: start_node.coords.x,
					y: start_node.coords.y + 0.75
				},
				to: {
					x: end_node.coords.x,
					y: end_node.coords.y
				}
			});
			lines.push(new ChartLine(self, line_data));

			return lines;
		}

		line_data.waypoints.push({
			from: {
				x: start_node.coords.x,
				y: start_node.coords.y + 0.75
			},
			to: {
				x: start_node.coords.x,
				y: end_node.coords.y - 0.75
			}
		});
		lines.push(new ChartLine(self, line_data));

		// create horizontal line
		line_data.waypoints = [];
		line_data.waypoints.push({
			from: {
				x: start_node.coords.x,
				y: end_node.coords.y - 0.75
			},
			to: {
				x: end_node.coords.x + 1,
				y: end_node.coords.y - 0.75
			}
		});
		lines.push(new ChartLine(self, line_data));

		line_data.waypoints = [];
		line_data.waypoints.push({
			from: {
				x: end_node.coords.x + 1,
				y: end_node.coords.y - 0.75
			},
			to: {
				x: end_node.coords.x + 1,
				y: end_node.coords.y
			}
		});
		lines.push(new ChartLine(self, line_data));

		return lines;
	};

	self.setConstants = function() {
		var set_width = self.container.offsetWidth,
			set_height = set_width / 4 * 3;

		self.container.style.height = set_height + 'px';

		self.gridUnit = {
			x: Math.floor(set_width / 15),
			y: Math.floor(set_height / 15)
		};
	}

	self.dragStartHandler = function(event) {
  	var target = event.target;
    self.dragging.x = event.x0; // + event.dx;
    self.dragging.y = event.y0; //+ event.dy;

    target.style.webkitTransform =
    target.style.transform =
        'translate(' + self.dragging.x + 'px, ' + self.dragging.y + 'px)';
	};

	self.dragMoveHandler = function(event) {
	  	var target = event.target;
	    self.dragging.x += event.dx;
	    self.dragging.y += event.dy;

	    target.style.webkitTransform =
	    target.style.transform =
	        'translate(' + self.dragging.x + 'px, ' + self.dragging.y + 'px)';

	    target.setAttribute('dragged-x', self.dragging.x);
	    target.setAttribute('dragged-y', self.dragging.y);

	  	var new_x = parseInt(target.getAttribute('dragged-x'))/self.gridUnit.x;
	  	var new_y = parseInt(target.getAttribute('dragged-y'))/self.gridUnit.y;

	    for (i in self.nodes) {
	    	if (self.nodes[i].title == target.getAttribute('data-title')) {
	    		self.nodes[i].coords.x = new_x;
	    		self.nodes[i].coords.y = new_y;
	    	}
	    }
			self.renderLines();
	};

	self.dragEndHandler = function (event) {
		var target = event.target;

		var new_x = parseInt(target.getAttribute('dragged-x'))/self.gridUnit.x;
		var new_y = parseInt(target.getAttribute('dragged-y'))/self.gridUnit.y;

		// we know where it's dropped based on the grid unit
	  for (i in self.nodes) {
	  	if (self.nodes[i].title == target.getAttribute('data-title')) {
	  		self.nodes[i].coords.x = new_x;
	  		self.nodes[i].coords.y = new_y;
	  	}
	  }
		self.renderLines();
		self.updateOutput();
	};

	self.init = function() {
		if (id === 'undefined') {
			throw "Parent element must be defined must be defined";
		}

		if (!(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0"))) {
			handleNoCanvas();
			return;
		}

		self.nodes = [];
		self.lines = [];
		self.container = document.getElementById(id);
		self.container.style.border = "#ccc 1px solid";
		self.setConstants();
		self.dragging = {};
		self.dragging.x = 0;
		self.dragging.y = 0;

		// Merge default options with options passed in.
		if (options !== 'undefined') {
			for (var key in options) {
				self[key] = options[key];
			}
		}

		// Setup interact draggable area.
		interact('.chart-node')
		  .draggable({
		    snap: {
		      /*targets: [
		        interact.createSnapGrid({
		        	x: self.gridUnit.x,
		        	y: self.gridUnit.y
		        })
		      ],*/
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
		  .on('dragstart', self.dragStartHandler)
		  .on('dragmove', self.dragMoveHandler)
		  .on('dragend', self.dragEndHandler);

		// Create array of nodes.
		if (data !== 'undefined') {
			for (var node in data.nodes) {
				self.nodes.push(new ChartNode(self, data.nodes[node]));
			}
		}

		self.render();

		return self;
	};

	return self.init();
}
