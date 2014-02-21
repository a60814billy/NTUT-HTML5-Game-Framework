(function(window){	
	var define ={}, mainPath = 'game_sample_files/';
	Object.defineProperties(define, {
		'mainPath': {
			value: mainPath,
			writable: false
		},
		'jsPath': {
			value: mainPath + 'js/',
			writable: false
		},
		'musicPath': {
			value: mainPath + 'music/',
			writable: false
		},
		'imagePath': {
			value: mainPath + 'image/',
			writable: false
		}

	});

	window.define = define;
})(window)