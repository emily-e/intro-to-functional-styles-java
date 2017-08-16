/***************************************************************************
   Copyright 2016 Emily Estes

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
***************************************************************************/
var slideshow = function() {
'use strict';

	var getProgressives = function($page) {
		var keys = [];
		var data = {};
		var revealUs = $page.querySelectorAll("[data-reveal]") || [];
		Array.prototype.forEach.call(revealUs, function (element) {
			var index = element.getAttribute('data-reveal');
			if(!(index in data)) {
				data[index] = { key: index, elements: [], hide: [] };
				keys.push(index);
			}
			data[index].elements.push(element);
		});
		var hideUs = $page.querySelectorAll("[data-hide]") || [];
		Array.prototype.forEach.call(hideUs, function (element) {
			console.log('hide');
			var index = element.getAttribute('data-hide');
			console.log(index);
			data[index].hide.push(element);
		});
		var ret = [];
		keys = keys.sort();
		for(var k in keys) {
			ret.push(data[keys[k]]);
		}
		return ret;
	};

	var hideProgressives = function (progressives) {
		progressives.slice().reverse().forEach(function (group) {
			hideNodes(group.elements);
			showNodes(group.hide);
		});
	};

	var showAllProgressives = function (progressives) {
		progressives.forEach(function (group) {
			showNodes(group.elements);
			hideNodes(group.hide);
		});
	};

	var displayNodes = function(nodes, displayVal) {
		Array.prototype.forEach.call(nodes, function(element, index) {
			element.style.display = displayVal;
		});
	}
	var hideNodes = function(nodes) {
		return displayNodes(nodes, 'none');
	}
	var showNodes = function(nodes) {
		return displayNodes(nodes, '');
	}

	var $divs = document.querySelectorAll('body > div');
	var $notes = document.querySelectorAll('.speaker-notes');
	hideNodes($divs);
	hideNodes($notes);

	var $currentPage = $divs.item(0);
	var currentPageProgressives = getProgressives($currentPage);
	var currentPageIndex = 0;
	hideProgressives(currentPageProgressives);
	$currentPage.style.display = '';

	var slideMode = true;


	var nextSlide = function () {
		if (currentPageIndex < currentPageProgressives.length) {
			var group = currentPageProgressives[currentPageIndex];
			showNodes(group.elements);
			hideNodes(group.hide);
			currentPageIndex++;
		} else if ($currentPage.nextElementSibling) {
			$currentPage.style.display = 'none';
			$currentPage = $currentPage.nextElementSibling;
			$currentPage.style.display = '';
			currentPageProgressives = getProgressives($currentPage);
			currentPageIndex = 0;
			hideProgressives(currentPageProgressives);
		}
	};

	var prevSlide = function () {
		if (currentPageIndex > 0) {
			currentPageIndex--;
			var group = currentPageProgressives[currentPageIndex];
			hideNodes(group.elements);
			showNodes(group.hide);
		} else if ($currentPage.previousElementSibling) {
			$currentPage.style.display = 'none';
			$currentPage = $currentPage.previousElementSibling;
			$currentPage.style.display = '';
			currentPageProgressives = getProgressives($currentPage);
			currentPageIndex = 0;
			hideProgressives(currentPageProgressives);
		}
	}

	var x = 0;
	var y = 0;
	var dx = 0;
	var dy = 0;
	var started = false;
	var touchStart = function(evt) {
		started = true;
		x = evt.touches[0].clientX;
		y = evt.touches[0].clientY;
	};

	var touchMove = function(evt) {
		if(!started) { return; }
		var nx = evt.touches[0].clientX;
		var ny  = evt.touches[0].clientY;
		dx = x - nx;
		dy = y - ny;
	};

	var touchEnd = function(evt) {
		started = false;
		if (Math.abs(dx) > (1.8 * Math.abs(dy))) {
			if(dx > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
	}

	document.addEventListener('touchstart', touchStart, false);        
	document.addEventListener('touchmove', touchMove, false);
	document.addEventListener('touchend', touchEnd, false);

	document.querySelector('body').addEventListener('keydown', function (evt) {
		if(evt.keyCode == 27) {
			if(slideMode) {
				slideMode = false;
				showNodes($divs);
				showNodes($notes);
				showAllProgressives(currentPageProgressives);
			} else {
				slideMode = true;
				hideNodes($divs);
				hideNodes($notes);
				$currentPage = $divs.item(0);
				$currentPage.style.display = '';
				currentPageProgressives = getProgressives($currentPage);
				currentPageIndex = 0;
				hideProgressives(currentPageProgressives);
			}
		} else if(slideMode && (evt.keyCode == 37)) {
			// left
			prevSlide();
		} else if(slideMode && (evt.keyCode == 39)) {
			// right
			nextSlide();
		}
	});
};
