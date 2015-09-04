function ChartNode(chart, options) {
	this.chart = chart;
	this.boundingBox = {};
	if (options !== 'undefined') {
		for (var option in options) {
			this[option] = options[option];
		}
	}
	
	return this;
}

ChartNode.prototype.draw = function() {
	var ctx = this.chart.ctx;
	var gux = this.chart.gridUnit.x;
	var guy = this.chart.gridUnit.y;
	// Get dimensions
	var width = this.dimensions.width * gux;
	
	// Define draw points
	var top = this.coords.y * guy;
	var center = this.coords.x * gux;
	var left = center - width / 2;
	
	var height = 0;
	
	// Set height variables up here so we know how tall
	// to make the background.
	var imgLeft = left + this.padding,
			imgTop = top + this.padding,
			imgWidth = width - (this.padding * 2),
			imgHeight = imgWidth,
			imgCenter = {
				x: imgLeft + imgWidth / 2,
				y: imgTop + imgHeight / 2	
			};
			
	if (this.image.src) {
		// We'll be using sqaure images for circles.
		height += imgHeight + 5;
	}
	
	// Draw prepare title
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
	
	height += titleArray.length * this.titleFontSize + (titleArray.length * 3) + 5;
	
	// Prepare content
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
	
	height += contentArray.length * this.contentFontSize + (titleArray.length * 5) + 5;
	height += this.padding * 2;
	
	this.boundingBox = {
		x: left,
		y: top,
		width: width,
		height: height	
	};
	
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
		ctx.restore();
	} else {
		// No border. Draw the rect normally. 
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(top, left, width, height);
	}
	
	ctx.restore();
	
	var lastDrawnElementBottom = top;
	
	// Draw Image
	if (this.image.src) {
		var img = new Image();
		
		// Set the img src
		img.src = this.image.src;
			
		if (this.image.style === 'circle') {
			ctx.save();
			ctx.beginPath();
			ctx.arc(imgCenter.x, imgCenter.y, imgHeight/2, 0, 2 * Math.PI, false);
								 
			ctx.strokeStyle = "#acacac";
			ctx.stroke();
			ctx.clip();
			ctx.drawImage(img, imgLeft, imgTop, imgWidth, imgHeight);
			ctx.restore();
		} else {
			ctx.drawImage(img, imgLeft, imgTop);
		}
		
		lastDrawnElementBottom = imgTop + imgHeight;
	}
	
	// Draw Title
	ctx.font = this.titleFontSize + 'px ' + this.titleFontFamily;
	for (var titlePart in titleArray) {
		if (titlePart === '0') {
			ctx.fillText(titleArray[titlePart], center, lastDrawnElementBottom + 5);
			lastDrawnElementBottom += this.padding + this.titleFontSize;
		} else {
			ctx.fillText(titleArray[titlePart], center, lastDrawnElementBottom + 3);
			lastDrawnElementBottom += this.titleFontSize + 3;
		}
	}
	
	// Draw Content
	ctx.font = this.contentFontSize + 'px ' + this.contentFontFamily;
	for (var contentPart in contentArray) {
		if (contentPart === '0') {
			ctx.fillText(contentArray[contentPart], center, lastDrawnElementBottom + 5);
			lastDrawnElementBottom += this.contentFontSize + 5;
		} else {
			ctx.fillText(contentArray[contentPart], center, lastDrawnElementBottom + 3);
			lastDrawnElementBottom += this.contentFontSize + 3;
		}
	}
};

ChartNode.prototype.update = function() {
	var mouse = this.chart.mouse;

	if (mouse.click) {
		console.log("Mouse was clicked!");
		this.chart.mouse.click = false;
	}
	
	if (this.intersects(mouse.x, mouse.y)) {
		console.log("House is hovering...");
	}
};

ChartNode.prototype.intersects = function(x, y) {
	var boundingBox = this.boundingBox;
	return (
		x >= boundingBox.x &&
		y >= boundingBox.y &&
		x <= boundingBox.x + boundingBox.width &&
		y <= boundingBox.y + boundingBox.height	
	);
};
