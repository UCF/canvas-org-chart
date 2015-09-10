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
		group.setAttribute("class", 'chart-node');

		// create background box
		var backgroundBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		backgroundBox.setAttribute("class", 'content-box');
		// backgroundBox.setAttribute("rx", '5px');
		// backgroundBox.setAttribute("ry", '5px');
		backgroundBox.style.width = width + 'px';
		backgroundBox.style.height = 10 + 'px';
		group.appendChild(backgroundBox);

		// create circle to clip image
		var image_width = 65; //width - (self.padding * 2);
		var image_clip_path = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
		image_clip_path.setAttribute('id', 'circleClip');
		group.appendChild(image_clip_path);

		// clip image with circle
		var image_clip_circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		image_clip_circle.setAttribute('r', 30);
		image_clip_circle.setAttribute('cx', 17.5);
		image_clip_circle.setAttribute('cy', 17.5);
		image_clip_path.appendChild(image_clip_circle);

		// create image element
		var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
		if (self.image.src) {
			image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', self.image.src);
		}
		else {
			image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'res/img/person.png');

		}

		image.setAttribute("width", image_width);
		image.setAttribute("height", image_width);
		image.setAttribute('clip-path', 'url(#circleClip)');
		image.setAttribute('y', '-15px');
		image.setAttribute('x', '-15px');

		// change height of background box to include image
		// backgroundBox.style.height = guy + image_width + self.padding + 'px';
		group.appendChild(image);

		// create title text
		var title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		title.setAttribute("class", 'title');
		title.setAttribute('x', image_width + 'px');
		title.setAttribute('y', image_width/2 + 'px');
		title.innerHTML = self.title;
		group.appendChild(title);

		// add link if available
		if (self.href) {
		 	var wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'a');
			wrapper.setAttributeNS('http://www.w3.org/1999/xlink', 'href', self.href);
	  	wrapper.appendChild(group);
		 	this.svg.appendChild(wrapper);
		} else {
			this.svg.appendChild(group);
		}

		// create content text using paragraph tags and the foreignObject element
		// var content = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		// content.setAttribute('x', image_width + 'px');
		// content.setAttribute('y', image_width/2 + 10 + 'px');
		// content.setAttribute('width', width + 'px');
		// var content_text = document.createElement('p');
		// content_text.setAttribute("class", 'content');
		// content_text.style.width = width - image_width + 'px';
		// content_text.textContent = self.content;
		// content.appendChild(content_text);
		// group.appendChild(content);
		// content_height = content_text.getBoundingClientRect().height;
		// background_height = backgroundBox.getBoundingClientRect().height;
		// backgroundBox.style.height = guy * 1 + self.padding + content_height + 'px';


		// create content text using svg text elements
		var content = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		content.setAttribute("class", 'content');
		content.setAttribute('x', image_width + 'px');
		content.setAttribute('y', image_width/2 + 20 + 'px');
		content.innerHTML = self.content;
		group.appendChild(content);

		// create content text
		var lines = 1;
		var content_line = content;
		var content_text_width = content_line.getBoundingClientRect().width;

		// if the content text is too long, wrap the text
		if (content_text_width > 180) {
			var content_text_content = self.content;
			var content_text_array = self.content.split(" ");

			i = 0;
			content_line.innerHTML = "";

			while (i < content_text_array.length) {
				content_line.innerHTML += content_text_array[i] + " ";

				if (content_line.getBoundingClientRect().width >= 180 && typeof content_text_array[i+1] !== "undefined") {
					// create new line
					lines++;
					content_line = document.createElementNS('http://www.w3.org/2000/svg', 'text');
					content_line.setAttribute("class", 'content');
					content_line.setAttribute('x', image_width + 'px');
					content_line.setAttribute('y', image_width/2 + 20 * lines + 'px');
					content_line.innerHTML = "";
					group.appendChild(content_line);
				}

				i++;
			}
		}
		content_height = content.getBoundingClientRect().height * (lines-1);
		background_height = backgroundBox.getBoundingClientRect().height;

		backgroundBox.style.height = guy * 1.25 + self.padding + content_height + 'px';

	};

	return self;

}
