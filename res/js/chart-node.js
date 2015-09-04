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
		ctx.save();
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
		ctx.clip();
		
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(left, top, width, height);
	} else {
		// No border. Draw the rect normally. 
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(top, left, width, height);
	}

	// Draw title
	ctx.font = this.titleFontSize + 'px ' + this.titleFontFamily;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = this.titleFontColor;
	
	// Transform string to fit within the bounding box
	var titleArray = [];
	var titleSplit = this.title.split(' ');
	var currentTitleString = '';
	for (var t in titleSplit) {
		if (titleArray.length > 0) {
			currentTitleString = titleArray[titleArray.length - 1];
			if (ctx.measureText(titleSplit[t]).width + ctx.measureText(currentTitleString).width + (this.padding * 2) < width) {
				titleArray[titleArray.length - 1] = currentTitleString + ' ' + titleSplit[t];
			} else {
				titleArray.push(titleSplit[t]);
			}
		} else {
			titleArray.push(titleSplit[t]);
		}
	}
	
	var lastDrawTextBottom = top;
	
	// Draw Title
	for (var titlePart in titleArray) {
		if (titlePart === '0') {
			ctx.fillText(titleArray[titlePart], center, top + this.padding);
			lastDrawTextBottom += this.padding + this.titleFontSize;
		} else {
			ctx.fillText(titleArray[titlePart], center, lastDrawTextBottom + 3);
			lastDrawTextBottom += this.titleFontSize + 3;
		}
	}
	
	// Draw content
	ctx.font = this.contentFontSize + 'px ' + this.contentFontFamily;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = this.contentFontColor;
	
	// Transform string to fit within the bounding box
	var contentArray = [];
	var contentSplit = this.content.split(' ');
	var currentContentString = '';
	for (var c in contentSplit) {
		if (contentArray.length > 0) {
			currentContentString = contentArray[contentArray.length - 1];
			if (ctx.measureText(contentSplit[c]).width + ctx.measureText(currentContentString).width + (this.padding * 2) < width) {
				contentArray[contentArray.length - 1] = currentContentString + ' ' + contentSplit[c];
			} else {
				contentArray.push(contentSplit[c]);
			}
		} else {
			contentArray.push(contentSplit[c]);
		}
	}
	
	for (var contentPart in contentArray) {
		if (contentPart === '0') {
			ctx.fillText(contentArray[contentPart], center, lastDrawTextBottom + 5);
			lastDrawTextBottom += this.contentFontSize + 5;
		} else {
			ctx.fillText(contentArray[contentPart], center, lastDrawTextBottom + 3);
			lastDrawTextBottom += this.contentFontSize + 3;
		}
	}
	
	ctx.restore();
};

ChartNode.prototype.update = function() {
	//console.log(this.title);
};

ChartNode.prototype.roundedRect = function(x, y, width, height, borderRadius, borderColor, backgroundColor, ctx) {
	
};
