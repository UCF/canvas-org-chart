function ChartNode(chart, options) {
	var self = this;
	self.chart = chart;
	self.svg = self.chart.svg;
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

		// Group node items together
		var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		group.setAttribute('transform', 'translate(' + left + ', ' + top +')');
		group.setAttribute("class", 'chartNode');

		// create background box
		var backgroundBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		backgroundBox.setAttribute("class", 'content-box');
		backgroundBox.style.padding = self.padding + 'px';
		backgroundBox.style.width = width + 'px';
		backgroundBox.style.height = guy *1.25 + 'px';
		group.appendChild(backgroundBox);

		// create title text
		var title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		title.setAttribute("class", 'title');
		title.setAttribute('y', 25 + 'px');
		title.innerHTML = self.title;
		group.appendChild(title);

		// create content text
		var content = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		content.setAttribute("class", 'content');
		content.setAttribute('y', 45 + 'px');
		content.innerHTML = self.content;
		group.appendChild(content);

		// if we have an image, need to add the image and resize the background box
		if (self.image.src) {

			// create circle to clip image
			var image_width = width - (self.padding * 2);
			var image_clip_path = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
			image_clip_path.setAttribute('id', 'circleClip');
			group.appendChild(image_clip_path);

			// clip image with circle
			var image_clip_circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			image_clip_circle.setAttribute('r', image_width/2);
			image_clip_circle.setAttribute('cx', image_width/2 + 5);
			image_clip_circle.setAttribute('cy', image_width/2 + 5);
			image_clip_path.appendChild(image_clip_circle);

			// create image element
			var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			image.setAttribute("width", image_width + '');
			image.setAttribute("height", image_width + '');
			image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', self.image.src);
			image.setAttribute('clip-path', 'url(#circleClip)');
			image.setAttribute('y', '5px');
			image.setAttribute('x', '5px');
			backgroundBox.style.height = guy + image_width + 15 + 'px';
			group.appendChild(image);

			// resize containers
			content.setAttribute('y', 45 + image_width + 'px');
			title.setAttribute('y', 25 + image_width + 'px');
		}

		// add the anchor wrapper if a url is specified

		// if (self.href) {
		// 	var wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		// 	wrapper.setAttribute("xlink:href", self.href);
		// 	wrapper.appendChild(backgroundBox);
		// 	this.overlay.appendChild(wrapper);
		// } else {

		//}

		this.svg.appendChild(group);
	};

	return self;

}
