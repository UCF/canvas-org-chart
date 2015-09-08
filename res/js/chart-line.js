function ChartLine(chart, options) {
	var self = this;
	
	self.chart = chart;
	if (options !== 'undefined') {
		for (var option in options) {
			self[option] = options[option];
		}
	}
	
	self.render = function() {
		var ctx = self.chart.ctx;
		var gux = self.chart.gridUnit.x;
		var guy = self.chart.gridUnit.y;
		
		ctx.save();
		ctx.beginPath();
		
		ctx.strokeStyle = self.chart.lineColor;
		
		if (self.style === 'dotted') {
			ctx.setLineDash([3, 9]);
		}
		
		for (var idx in self.waypoints) {
			var waypoint = self.waypoints[idx];
			ctx.moveTo(waypoint.from.x * gux, waypoint.from.y * guy);
			ctx.lineTo(waypoint.to.x * gux, waypoint.to.y * guy);
			ctx.stroke();
		}
		
		ctx.closePath();
		ctx.restore();
	};
	
	return self;
}