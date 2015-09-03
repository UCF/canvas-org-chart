function ChartLine(chart, options) {
	this.chart = chart;
	if (options !== 'undefined') {
		for (var option in options) {
			this[option] = options[option];
		}
	}
	
	return this;
}

ChartLine.prototype.draw = function() {
	return;
};

ChartLine.prototype.update = function() {
	
};
