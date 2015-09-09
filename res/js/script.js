var main = function ($) {
	var chart,
		chartData,
		options;
	$.when(
		$.getJSON('res/data/org-chart-data.json', function(data) {
			chartData = data;
		}),
		$.getJSON('res/data/org-chart-options.json', function(data) {
			options = data;
		})
	).then(function() {
		if (chartData && options) {
			chart = CanvasOrgChart('orgChart', chartData, options);
		}
	});
};

if (jQuery !== 'undefined') {
	$ = jQuery;
	main($);
} else {
	console.log('I need jQuery!');
}
