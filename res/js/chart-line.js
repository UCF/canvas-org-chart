function ChartLine(chart, options) {
	var self = this;

	self.chart = chart;
	if (options !== 'undefined') {
		for (var option in options) {
			self[option] = options[option];
		}
	}

	self.render = function() {
		//var ctx = self.chart.ctx;
		var gux = self.chart.gridUnit.x;
		var guy = self.chart.gridUnit.y;

		//ctx.save();
		//ctx.beginPath();

		//ctx.strokeStyle = self.chart.lineColor;

		var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			newLine.setAttribute('class', 'org-line');

		if (self.style === 'dotted') {
			//ctx.setLineDash([3, 9]);
			newLine.classList.add('dotted');
		}

		for (var idx in self.waypoints) {
			var waypoint = self.waypoints[idx];
			newLine.setAttribute('x1', waypoint.from.x * gux);
			newLine.setAttribute('y1', waypoint.from.y * guy);
			newLine.setAttribute('x2', waypoint.to.x * gux);
			newLine.setAttribute('y2', waypoint.to.y * guy);
			chart.container.appendChild(newLine);
		}

		//ctx.closePath();
		//ctx.restore();
	};

	return self;
}