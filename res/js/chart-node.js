function ChartNode(chart, options) {
	this.chart = chart;
	if (options !== 'undefined') {
		for (var option in options) {
			this[option] = options[option];
		}
	}
	
	return this;
}

ChartNode.prototype.draw = function(chart) {
	var ctx = chart.ctx;
	var gux = chart.gridUnit.x;
	var guy = chart.gridUnit.y;
	// Get dimensions
	var width = this.dimensions.width * gux;
	var height = this.dimensions.height * guy;
	var top = this.coords.y * guy;
	var center = this.coords.x * gux;
	var left = center - width / 2
	
	console.log(width + ' ' + height + ' ' + top + ' ' + center + ' ' + left);
	
	// if the border exists, draw it
	if (this.borderWidth > 0) {
		ctx.beginPath();
		ctx.strokeColor = "#fff";
		ctx.moveTo(left + this.borderRadius, top);
		ctx.lineTo(left + width - this.borderRadius, top);
		ctx.quadraticCurveTo(left + width, top, left + width, top + this.borderRadius);
		ctx.stroke();
	}
};

ChartNode.prototype.update = function() {
	
};
