function ChartNode(chart, options) {
	this.chart = chart;
	if (options !== 'undefined') {
		for (var option in options) {
			this[option] = options[option];
		}
	}
	
	return this;
}

ChartNode.prototype.draw = function() {
	return;
};

ChartNode.prototype.update = function() {
	
};
