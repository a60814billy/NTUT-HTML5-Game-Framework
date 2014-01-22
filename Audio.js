var Framework = (function (Framework) {
	//Framework.Util.namespace("Framework.Audio");
	Framework.Audio = (function(){
		var $ = Framework,
			_audioClass = {},
			_audioInstanceObj = {},
			_mainPlaylist = {},
			_errorEvent = function() {};

		var setPlaylist = function(playlist) {
			_mainPlaylist = playlist;
		};

		var setErrorEvent = function(eventFunction) {
			_errorEvent = eventFunction;
		};

		var addSongs = function(playlist) {
			_mainPlaylist =  $.Util.overrideProperty(playlist, _mainPlaylist);
		};

		var removeSong = function(song) {
			_mainPlaylist[_mainPlaylist] = null;
			delete _mainPlaylist[_mainPlaylist];
		};

		//只接受String或Array
		var removeSongs = function(songs) {
			var i = 0, len = 0;
			if( $.Util.isString(songs)) {
				removeSong(songs);
			} else {
				for(i = 0, len = songs.length; i < len; i++) {
					removeSong(songs[i]);
				}
			}
		};

		var getAudioInstance = function(songName) {
			if(! $.Util.isUndefined(_audioInstanceObj[songName])) {
				_audioInstanceObj[songName].currentTime = 0;
				return _audioInstanceObj[songName];
			}

			var audioInstance = new Audio();
			//document.body.appendChild(audioInstance);
			//audioInstance.controls="controls";
			audioInstance.preload = 'auto';			
			_audioInstanceObj[songName] = audioInstance;
			return audioInstance;
		};

		var playMusic = function() {
			this.play();	
			this.removeEventListener('canplaythrough', playMusic, false);		
		};

		//must contain the name of a song
		var play = function(audioArgs) {
			var sourceTagStr = 'source',
				tempSource,
				audioSourceType = {
					mp3: 'audio/mpeg',
					ogg: 'audio/ogg',
				},
				tempName, 
				songName = audioArgs['name'], 
				song = _mainPlaylist[songName],
				oggSource= document.createElement(sourceTagStr),
            	mp3Source = document.createElement(sourceTagStr),
            	audio = {};

            if(Framework.Util.isUndefined(song)) {
            	throw ('the playlist is not set or do not contain the song: ' + songName);
            }

            audio = getAudioInstance(songName);
            
            audio.addEventListener('error', _errorEvent, false);
			for(tempName in audioArgs) {
				if (audioArgs.hasOwnProperty(tempName)) {
					audio[tempName] = audioArgs[tempName];
				}
			}
			
			for(tempName in song) {
				tempSource = document.createElement(sourceTagStr);
				tempSource.type = audioSourceType[tempName];
				tempSource.src= song[tempName];
				audio.appendChild(tempSource);
			}

			audio.play();
			//audio.addEventListener('canplaythrough', playMusic, false);
		};

		var pause = function(audioName) {
			var audio = _audioInstanceObj[audioName];
			audio.pause();
		};

		var pauseAll = function() {
			for(tempName in _audioInstanceObj) {
				pause(tempName);
			}
		};

		var resume = function(audioName) {
			var audio = _audioInstanceObj[audioName];
			if(audio.paused) {
				audio.play();
			}
		}

		var resumeAll = function() {
			for(tempName in _audioInstanceObj) {
				resume(tempName);
			}
		}

		//因為stop為native code, 故private命名部分改用stopMusic
		var stopMusic = function(audioName) {
			var audio = _audioInstanceObj[audioName];
			audio.pause();
			audio.currentTime = 0;
		};

		var stopAll = function() {
			for(tempName in _audioInstanceObj) {
				stopMusic(tempName);
			}
		};

		var setVolume = function(name, volumeValue) {
			var audio = _audioInstanceObj[name];
			audio.volume = volumeValue;
		};

		var manageMute = function(name, muted) {
			var audio = _audioInstanceObj[name];
			audio.muted = muted;
		};

		var openVolume = function(name) {
			manageMute(name, false);
		};

		var openVolumeAll = function() {
			for(tempName in _audioInstanceObj) {
				openVolume(tempName);
			}
		};

		var mute = function(name) {
			manageMute(name, true);
		};

		var muteAll = function() {
			for(tempName in _audioInstanceObj) {
				mute(tempName);
			}
		};

		/*var on = function(audioName, eventName, callback, useCapture) {
			var mainUseCapture = false, audio = _audioInstanceObj[audioName];
			
			if(!Framework.Util.isUndefined(useCapture)) {
				mainUseCapture = useCapture;
			}

			audio.addEventListener(eventName, callback, mainUseCapture);
		};

		var off = function(audioName, eventName, callback, useCapture) {
			var mainUseCapture = false, audio = _audioInstanceObj[audioName];
			
			if(!Framework.Util.isUndefined(useCapture)) {
				mainUseCapture = useCapture;
			}

			audio.removeEventListener(eventName, callback, mainUseCapture);
		};

		var allOn = function(eventName, callback, useCapture) {
			for(tempName in _audioInstanceObj) {
				on(tempName, eventName, callback, useCapture);
			}
		};

		var allOff = function(eventName, callback, useCapture) {
			for(tempName in _audioInstanceObj) {
				off(tempName, eventName, callback, useCapture);
			}
		};*/

		_audioClass = function(playlist) {
			if(!Framework.Util.isUndefined(playlist)) {
				setPlaylist(playlist);
			}
		};

		_audioClass.prototype = {
			play: play,
			stop: stopMusic,
			stopAll: stopAll,
			pause: pause,
			pauseAll: pauseAll,
			resume: resume,
			resumeAll: resumeAll,
			setVolume: setVolume,
			mute: mute,
			muteAll: muteAll,
			openVolume: openVolume,
			openVolumeAll: openVolumeAll,
			setErrorEvent: setErrorEvent,
			/*on: on,
			off: off,
			allOn: allOn,
			allOff: allOff,*/
		};

		return _audioClass;
	})();
	return Framework;
})(Framework || {});