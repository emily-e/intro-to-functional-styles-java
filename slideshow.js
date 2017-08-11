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
		$page.find("[data-reveal]").each(function () {
			var index = $(this).attr('data-reveal');
			if(!(index in data)) {
				data[index] = { key: index, elements: [], hide: [] };
				keys.push(index);
			}
			data[index].elements.push($(this));
		});
		$page.find("[data-hide]").each(function () {
			console.log('hide');
			var index = $(this).attr('data-hide');
			console.log(index);
			data[index].hide.push($(this));
		});
		var ret = [];
		keys = keys.sort();
		for(var k in keys) {
			ret.push(data[keys[k]]);
		}
		return ret;
	};

	var hideProgressives = function (progressives) {
		var k = progressives.length - 1;
		while(k >= 0) {
			var group = progressives[k];
			for(var el in group.elements) {
				group.elements[el].hide();
			}
			for(var el in group.hide) {
				group.hide[el].show();
			}
			k--;
		}
	};

	var showAllProgressives = function (progressives) {
		for(var k in progressives) {
			var group = progressives[k];
			for(var el in group.elements) {
				group.elements[el].show();
			}
			for(var el in group.hide) {
				group.hide[el].hide();
			}
		}
	};

	var $divs = $('body > div');
	var $notes = $('.speaker-notes');
	$divs.hide();
	$notes.hide();

	var $currentPage = $divs.first();
	var currentPageProgressives = getProgressives($currentPage);
	var currentPageIndex = 0;
	hideProgressives(currentPageProgressives);
	$currentPage.show();

	var slideMode = true;


	var nextSlide = function () {
		if (currentPageIndex < currentPageProgressives.length) {
			var group = currentPageProgressives[currentPageIndex];
			for(var el in group.elements) {
				group.elements[el].show();
			}
			for(var el in group.hide) {
				group.hide[el].hide();
			}
			currentPageIndex++;
		} else if ($currentPage.next().length > 0) {
			$currentPage.hide();
			$currentPage = $currentPage.next();
			$currentPage.show();
			currentPageProgressives = getProgressives($currentPage);
			currentPageIndex = 0;
			hideProgressives(currentPageProgressives);
		}
	};

	var prevSlide = function () {
		if (currentPageIndex > 0) {
			currentPageIndex--;
			var group = currentPageProgressives[currentPageIndex];
			for(var el in group.elements) {
				group.elements[el].hide();
			}
			for(var el in group.hide) {
				group.hide[el].show();
			}
		} else if ($currentPage.prev().length > 0) {
			$currentPage.hide();
			$currentPage = $currentPage.prev();
			$currentPage.show();
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

	$('body').keydown(function (evt) {
		if(evt.keyCode == 27) {
			if(slideMode) {
				slideMode = false;
				$divs.show();
				$notes.show();
				showAllProgressives(currentPageProgressives);
			} else {
				slideMode = true;
				$divs.hide();
				$notes.hide();
				$currentPage = $divs.first();
				$currentPage.show();
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
