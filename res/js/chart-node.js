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


		var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		group.setAttribute('y', top + 'px');
		group.setAttribute('x', left + 'px');


		var backgroundBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		backgroundBox.setAttribute("class", 'chartNode');
		backgroundBox.style.padding = self.padding + 'px';
		backgroundBox.style.width = self.dimensions.width * gux + 'px';
		backgroundBox.setAttribute('y', top + 'px');
		backgroundBox.setAttribute('x', left + 'px');
		backgroundBox.style.height = guy + 'px';
		group.appendChild(backgroundBox);

		if (self.image.src) {
			var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			var image_width = width - (self.padding * 2);
			image.setAttribute("width", image_width + '');
			image.setAttribute("height", image_width + '');
			// image.style.borderRadius = width - (self.padding * 2) / 2 + 'px';
			image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', self.image.src);
			image.setAttribute('y', top + 'px');
			image.setAttribute('x', left + 'px');
			group.appendChild(image);
		}

		// var title = document.createElement('h2');
		// title.innerText = self.title;
		// backgroundBox.appendChild(title);

		// var content = document.createElement('p');
		// content.innerText = self.content;
		// backgroundBox.appendChild(content);

		// if (self.href) {
		// 	var wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		// 	wrapper.setAttribute("xlink:href", self.href);
		// 	wrapper.appendChild(backgroundBox);
		// 	this.overlay.appendChild(wrapper);
		// } else {

		//}

		this.overlay.appendChild(group);
	};

	return self;

}
