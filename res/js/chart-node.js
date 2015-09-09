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
		backgroundBox.style.padding = self.padding + 'px';
		backgroundBox.style.width = self.dimensions.width * gux + 'px';
		backgroundBox.style.top = top + 'px';
		backgroundBox.style.left = left + 'px';

		var image = document.createElement('img');
		if (self.image.src) {
			image.src = self.image.src;
		} else {
			image.src = 'res/img/person.png';
		}
		backgroundBox.appendChild(image);

		var title = document.createElement('h2');
		title.innerText = self.title;
		backgroundBox.appendChild(title);

		var content = document.createElement('p');
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
