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
	
	// Define draw points
	var top = this.coords.y * guy;
	var center = this.coords.x * gux;
	var left = center - width / 2;
	
	var topLeft = { x: left, y: top };
	var topRight = { x: left + width, y: top };
	var bottomRight = { x: left + width, y: top + height };
	var bottomLeft = { x: left, y: top + height };
	
	// if the border exists, draw it
	if (this.borderWidth > 0) {
		ctx.beginPath();
		ctx.moveTo(topLeft.x + this.borderRadius, topLeft.y);
		ctx.lineTo(topRight.x - this.borderRadius, topRight.y);
		ctx.quadraticCurveTo(topRight.x, topRight.y, topRight.x, topRight.y + this.borderRadius);
		ctx.lineTo(bottomRight.x, bottomRight.y - this.borderRadius);
		ctx.quadraticCurveTo(bottomRight.x, bottomRight.y, bottomRight.x - this.borderRadius, bottomRight.y);
		ctx.lineTo(bottomLeft.x + this.borderRadius, bottomLeft.y);
		ctx.quadraticCurveTo(bottomLeft.x, bottomLeft.y, bottomLeft.x, bottomLeft.y - this.borderRadius);
		ctx.lineTo(topLeft.x, topLeft.y + this.borderRadius);
		ctx.quadraticCurveTo(topLeft.x, topLeft.y, topLeft.x + this.borderRadius, topLeft.y);
		ctx.strokeColor = this.borderColor;
		ctx.closePath();
		ctx.stroke();
		// Save context before clip
		ctx.save();
		ctx.clip();
	}
	
	// Draw background box
	ctx.fillStyle = this.backgroundColor;
	ctx.fillRect(topLeft.x, topLeft.y, width, height);

	// Draw title
	ctx.font = this.titleFontSize + 'px ' + this.titleFontFamily;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = this.titleFontColor;
	ctx.fillText(this.title, center, top + this.padding);
	
	this.lastDrawTextBottom = top + this.padding + this.titleFontSize;
	
	// Draw content
	ctx.font = this.contentFontSize + 'px ' + this.contentFontFamily;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = this.contentFontColor;
	var splitContent = this.content.split('\n');
	for (var idx in splitContent) {
		if (idx === '0') {
			ctx.fillText(splitContent[idx], center, this.lastDrawTextBottom + 10);
			this.lastDrawTextBottom = this.lastDrawTextBottom + 10 + this.contentFontSize;
		} else {
			ctx.fillText(splitContent[idx], center, this.lastDrawTextBottom + 5);
			this.lastDrawTextBottom = this.lastDrawTextBottom + 5 + this.contentFontSize;
		}
	}
	ctx.restore();
};

ChartNode.prototype.update = function() {
	//console.log(this.title);
};
