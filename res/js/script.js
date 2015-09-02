var main = function() {
	
	var adjustWidth = function(canvas) {
		var container = document.getElementsByClassName('container')[0],
			screenWidth = container.offsetWidth;
		canvas.width = screenWidth;
		canvas.height = screenWidth / 16 * 9;
	};
	
	var canvas = document.getElementById('canvas');
	canvas.onload = function() {
		adjustWidth(canvas);	
	};
	window.onresize = function() {
		adjustWidth(canvas);	
	};
	adjustWidth(canvas);
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "#428bca";
	ctx.fillRect(0, 0, 1200, 800);
};

main();