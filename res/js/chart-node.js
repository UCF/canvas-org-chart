function ChartNode(chart, options) {
	var self = this;
	self.chart = chart;
	self.overlay = self.chart.overlay;
	if (options !== 'undefined') {
		for (var option in options) {
			self[option] = options[option];
		}
	}
	
	self.render = function() {
		// Define grid units
		var gux = self.chart.gridUnit.x,
			guy = self.chart.gridUnit.y;
		
		// Get width
		var width = self.dimensions.width * gux;
		
		// Define draw points
		var top = self.coords.y * guy,
			center = self.coords.x * gux,
			left = center - width / 2;
		
		var backgroundBox = document.createElement('div');
		backgroundBox.className = 'chartNode';
		backgroundBox.style.margin = '0 auto';
		backgroundBox.style.padding = self.padding + 'px';
		backgroundBox.style.width = self.dimensions.width * gux + 'px';
		backgroundBox.style.top = top + 'px';
		backgroundBox.style.left = left + 'px';
		backgroundBox.style.backgroundColor = self.backgroundColor;
		backgroundBox.style.border = '1px solid #acacac';
		backgroundBox.style.borderRadius = '5px';
		
		backgroundBox.onmouseenter = function() {
			backgroundBox.style.backgroundColor = self.hoverBackgroundColor;	
		};
		
		backgroundBox.onmouseleave = function() {
			backgroundBox.style.backgroundColor = self.backgroundColor;
		};
		
		if (self.image.src) {
			var image = document.createElement('img');
			image.style.width = width - (self.padding * 2) + 'px';
			image.style.height = image.style.width + 'px';
			image.style.borderRadius = width - (self.padding * 2) / 2 + 'px';
			image.src = self.image.src;
			backgroundBox.appendChild(image);
		}
		
		var title = document.createElement('h2');
		title.style.textAlign = 'center';
		title.style.fontSize = self.titleFontSize + 'px';
		title.style.fontFamily = self.titleFontFamily;
		title.style.color = self.titleFontColor;
		title.innerText = self.title;
		backgroundBox.appendChild(title);
		
		var content = document.createElement('p');
		content.style.textAlign = 'center';
		content.style.fontSize = self.contentFontSize + 'px';
		content.style.fontFamily = self.contentFontFamily;
		content.style.color = self.contentFontColor;
		content.innerText = self.content;
		backgroundBox.appendChild(content);
		
		if (self.href) {
			var wrapper = document.createElement('a');
			wrapper.href = self.href;
			wrapper.appendChild(backgroundBox);
			this.overlay.appendChild(wrapper);
		} else {
			this.overlay.appendChild(backgroundBox);	
		}
	};
	
	return self;

}
