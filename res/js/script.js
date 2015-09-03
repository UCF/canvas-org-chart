var main = function($) {
	$.when(
		$.getJSON('res/data/org-chart-data.json', function(data) {
			chartData = data;	
		}),
		$.getJSON('res/data/org-chart-options.json', function(data) {
			options = data;
		})
	).then(function() {
		if (chartData && options) {
			var chart = new CanvasOrgChart('chart', chartData, options);
		}
	});
};

if (jQuery !== 'undefined') {
	$ = jQuery;
	main($);
} else {
	console.log('I need jQuery!');
}