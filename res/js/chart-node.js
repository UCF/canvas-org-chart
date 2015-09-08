function ChartNode(chart, options) {
	var self = this;
	self.chart = chart;
	self.boundingBox = {};
	if (options !== 'undefined') {
		for (var option in options) {
			self[option] = options[option];
		}
	}
	
	self.currentBackgroundColor = self.backgroundColor;
	self.currentForegroundColor = self.foregroundColor;
	
	// Private helper functions
	
	// Splits text to fit within given width
	// Parameters:
	// text: The text to be split and measured
	// width: The width the text must fit within
	// padding: The left/right padding
	// ctx: The current canvas context
	// Returns string array
	var transformTextToWidth = function(text, width, padding, ctx) {
		var tArray = [],
			tSplit = text.split(' '),
			currentTString = '';
			
		for (var t in tSplit) {
			if (tArray.length > 0) {
				currentTString = tArray[tArray.length - 1];
				if (ctx.measureText(tSplit[t]).width + ctx.measureText(currentTString).width + (padding * 2) < width) {
					tArray[tArray.length - 1] = currentTString + ' ' + tSplit[t];
				} else {
					tArray.push(tSplit[t]);
				}
			} else {
				tArray.push(tSplit[t]);
			}
		}
		
		return tArray;
	};
	
	var intersects = function(x, y) {
		var boundingBox = self.boundingBox;
		
		return (
			x >= boundingBox.x &&
			y >= boundingBox.y &&
			x <= boundingBox.x + boundingBox.width &&
			y <= boundingBox.y + boundingBox.height	
		);
	};
	
	// Public draw function
	self.draw = function() {
		// Get context and save it
		var ctx = self.chart.ctx;
		ctx.save();
		
		// Define grid units
		var gux = self.chart.gridUnit.x,
			guy = self.chart.gridUnit.y;
		
		// Get width
		var width = self.dimensions.width * gux;
		
		// Define draw points
		var top = self.coords.y * guy,
			center = self.coords.x * gux,
			left = center - width / 2;
		
		// Define height, to be set later
		var height = 0;
		
		var imgLeft = left + self.padding,
			imgTop = top + self.padding,
			imgWidth = width - (self.padding * 2),
			imgHeight = imgWidth,
			imgCenter = {
				x: imgLeft + imgWidth / 2,
				y: imgTop + imgHeight / 2
			};
			
		if (self.image.src) {
			height += imgHeight + 5;
		}
		
		// Prepare title (calculate height)
		ctx.font = self.titleFontSize + 'px ' + self.titleFontFamily;
		
		var titleArray = transformTextToWidth(self.title, width, self.padding, ctx);
		
		height += titleArray.length * self.titleFontSize + (titleArray.length * 3) + 5;
		
		// Prepare content (calculate height)
		ctx.font = self.contentFontSize + 'px ' + self.contentFontFamily;
		
		var contentArray = transformTextToWidth(self.content, width, self.padding, ctx);
		
		height += contentArray.length * self.contentFontSize + (contentArray.length * 5) + 5;
		height += self.padding * 2;
		
		self.boundingBox = {
			x: left,
			y: top,
			width: width,
			height: height	
		};
		
		var topLeft = { x: left, y: top };
		var topRight = { x: left + width, y: top };
		var bottomRight = { x: left + width, y: top + height };
		var bottomLeft = { x: left, y: top + height };
		
		// Draw border
		if (self.borderWidth > 0) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(topLeft.x + self.borderRadius, topLeft.y);
			ctx.lineTo(topRight.x - self.borderRadius, topRight.y);
			ctx.quadraticCurveTo(topRight.x, topRight.y, topRight.x, topRight.y + self.borderRadius);
			ctx.lineTo(bottomRight.x, bottomRight.y - self.borderRadius);
			ctx.quadraticCurveTo(bottomRight.x, bottomRight.y, bottomRight.x - self.borderRadius, bottomRight.y);
			ctx.lineTo(bottomLeft.x + self.borderRadius, bottomLeft.y);
			ctx.quadraticCurveTo(bottomLeft.x, bottomLeft.y, bottomLeft.x, bottomLeft.y - self.borderRadius);
			ctx.lineTo(topLeft.x, topLeft.y + self.borderRadius);
			ctx.quadraticCurveTo(topLeft.x, topLeft.y, topLeft.x + self.borderRadius, topLeft.y);
			ctx.strokeColor = self.borderColor;
			ctx.closePath();
			ctx.stroke();
			ctx.clip();
			ctx.fillStyle = self.currentBackgroundColor;
			ctx.fillRect(left, top, width, height);
			ctx.restore();
		} else {
			// No border. Draw the rect normally. 
			ctx.fillStyle = self.backgroundColor;
			ctx.fillRect(top, left, width, height);
		}
		
		var lastDrawnElementBottom = top;
		
		if (self.image.src) {
			var img = new Image();
			
			// Set the image src
			img.src = self.image.src;
			
			if (self.image.style === 'circle') {
				ctx.save();
				ctx.beginPath();
				ctx.arc(imgCenter.x, imgCenter.y, imgHeight/2, 0, 2 * Math.PI, false);
				
				ctx.strokeStyle = '#acacac';
				ctx.stroke();
				ctx.clip();
				ctx.drawImage(img, imgLeft, imgTop, imgWidth, imgHeight);
				ctx.restore();
			} else {
				ctx.drawImage(img, imgLeft, imgTop, imgWidth, imgHeight);
			}
			
			lastDrawnElementBottom = imgTop + imgHeight;
		}
		
		// Draw Title
		ctx.font = self.titleFontSize + 'px ' + self.titleFontFamily;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = self.titleFontColor;
		
		for (var t in titleArray) {
			if (t === '0') {
				ctx.fillText(titleArray[t], center, lastDrawnElementBottom + 5);
				lastDrawnElementBottom += self.padding + self.titleFontSize;
			} else {
				ctx.fillText(titleArray[t], center, lastDrawnElementBottom + 3);
				lastDrawnElementBottom += self.titleFontSize + 3;
			}
		}
		
		// Draw Content
		ctx.font = self.contentFontSize + 'px ' + self.contentFontFamily;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = self.contentFontColor;
		
		for (var c in contentArray) {
			if (c === '0') {
				ctx.fillText(contentArray[c], center, lastDrawnElementBottom + 5);
				lastDrawnElementBottom += self.contentFontSize + 5;
			} else {
				ctx.fillText(contentArray[c], center, lastDrawnElementBottom + 3);
				lastDrawnElementBottom += self.contentFontSize + 3;
			}
		}
		
		ctx.restore();
	};
	
	// Public update function
	self.update = function() {
		
		var mouse = self.chart.mouse;
		
		if (intersects(mouse.x, mouse.y)) {
			if (mouse.click) {
				window.open(self.href);
			}
			self.currentBackgroundColor = self.hoverBackgroundColor;
			self.currentForegroundColor = self.hoverForegroundColor;
		} else {
			self.currentBackgroundColor = self.backgroundColor;
			self.currentForegroundColor = self.foregroundColor;
		}
	};
	
	return self;

}
