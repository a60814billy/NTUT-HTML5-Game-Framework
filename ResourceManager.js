/** 
	* @constructor
	* @param {Game} game funny
*/
var Framework = (function (Framework) {
	//Framework.Util.namespace("Framework.ResourceManager");	
	Framework.ResourceManager = (function(){
		var _requestCount = 0,
			_responseCount = 0, 
			_timeountIDPrevious = 0,
			_timeountID = 0, 
			_intervalID = 0, 
			_responsedResource = {}, 
			_subjectFunction = function() {},
			ResourceManagerClass = function() {},
			ResourceManagerIntance = function() {};

		
		var getFinishedRequestPercent = function() {
			return _responseCount / _requestCount * 100;
		};

		var getRequestCount = function() {
			return _requestCount;
		};

		var getResponseCount = function() {
			return _responseCount;
		};

		var loadImage = function(requestOption) {

			var imageObj = new Image();
			imageObj.src = requestOption['url'];
			_requestCount++;
            if(_intervalID === null) {
                _intervalID = setInterval(detectAjax, 50);
                finishLoading();
            }
			imageObj.onload = function() {
		      _responseCount++;
		      _responsedResource[requestOption.id] = { url: requestOption.url, response: imageObj };
		    };
		};

		var minAjaxJSON = function(requestOption) {
			requestOption.systemSuccess = function(responseText, textStatus, xmlHttpRequest) { 
				var responseJSON = eval('(' + responseText.trim() + ')');	//因有可能是不合法的JSON, 故只能用eval了
				_responsedResource[requestOption.id] = { url: requestOption.url, response: responseJSON };	
				_responseCount++;		
			};

			minAjax(requestOption.type, requestOption);	
		};

		var minAjax = function(type, requestOption) {
			var userSettings = userSettings || {};
			userSettings.type = type || 'POST';

			if (!Framework.Util.isUndefined(requestOption.data)) {
				userSettings["data"] = requestOption.data;
			}

			if (!Framework.Util.isUndefined(requestOption.systemSuccess)) {
				userSettings["success"] = requestOption.systemSuccess;
			}	

			ajax(requestOption, userSettings);
		};

		var ajax = function(requestOption, userSettings) {
			_requestCount++;
			var defaultSettings = {
				type:'POST',
				cache:false,
				async:true,
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				error: function(xmlHttpRequest, textStatus){},
				//data: "user=admin%20admin&password=12345" //需要自行encode, 且只接受string格式
				statusCode: {
					/*404: function() {},
					500: function() {},*/	//這部分USER可以自行設定
				},
				success: function(data, textStatus, xmlHttpRequest) {},			
			};

			var userSettings = userSettings || defaultSettings;
			userSettings = Framework.Util.overrideProperty(defaultSettings, userSettings);
			

			//因IE9後才支援HTML5, 故不再做其他判斷
			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
				xhr.onload = (function() {
					if (xhr.readyState === 4) {
	    				if (xhr.status === 200) {
	    					_responsedResource[requestOption.id] = { url: requestOption.url, response: xhr.responseText }; 
							userSettings.success(xhr.responseText, xhr.statusText, xhr);
	    				} else {
	    					userSettings.error(xhr, xhr.statusText);
	    				}
	    			}
				});
			}
			
			if (!userSettings.cache && Framework.Util.isUndefined(userSettings.data) && userSettings.type === 'GET') {	
				requestOption.url = requestOption.url + '?' + Math.random();	
			} else if (!Framework.Util.isUndefined(userSettings.data) && userSettings.data.trim() !== '') {
				requestOption.url = requestOption.url + '?' + userSettings.data.trim();
			}
			
			xhr.open(userSettings.type, requestOption.url, userSettings.async);	
			xhr.overrideMimeType('text/plain; charset=x-user-defined'); 
			
			if (userSettings.type === 'GET')	{
				xhr.send();
			} else {			
				xhr.setRequestHeader('Content-Type', userSettings.contentType);	
				xhr.send(userSettings.data);
			}		
		};


		var getResource = function(id) {
			if(Framework.Util.isUndefined(_responsedResource[id])) {
				throw ('"' + id + '" is undefined Resource.');
			}		
			return _responsedResource[id].response;
		};

		var destroyResource = function(id) {
			_responsedResource[id].response = null;
			_responsedResource[id].url = null;
            _responsedResource[id] = null;
			delete _responsedResource[id];
		};

		var setSubjectFunction = function(subjectFunction) {
			_subjectFunction = subjectFunction;
		};

		var detectAjax = function() {
			//Constuctor即開始偵測	
			//要有(_requestCount == 0)是為了避免一開始就去執行gameController.start
			ajaxProcessing = (_requestCount !== _responseCount) || (_requestCount === 0);		
		};

		var stopDetectingAjax = function() {
			clearInterval(_intervalID);
			_intervalID = null;
		};

		var finishLoading = function() {
			//由game來控制遊戲開始的時機, 需要是在發出所有request後, 再call這個funciton
			detectAjax();
			if(!ajaxProcessing) {
				stopDetectingAjax();
				_subjectFunction();
			} else {
				_timeountIDPrevious = _timeountID;
				_timeountID = setTimeout(function() {  
					finishLoading();
					clearTimeout(_timeountIDPrevious);
				}, 500);
			}
		};
		
		ResourceManagerClass = function(subjectFunction) {
			_requestCount = 0;
			_responseCount = 0;
			_responsedResource = {};

			if(!Framework.Util.isUndefined(subjectFunction)) {
				_subjectFunction = subjectFunction;
			}

			//_intervalID = setInterval(detectAjax, 50);
			finishLoading();
		};

		//Public
		/** request anything */
		ResourceManagerClass.prototype = {
			/** Load image */
			loadImage: loadImage,
			/** Load JSON by AJAX */
			loadJSON: minAjaxJSON,
			/** Delete Resource */
			destroyResource: destroyResource,
			/** Get Resource */
			getResource: getResource,	
			setSubjectFunction: setSubjectFunction,	
			getFinishedRequestPercent: getFinishedRequestPercent,
			getRequestCount: getRequestCount,
			getResponseCount: getResponseCount,
		};

		ResourceManagerIntance = new ResourceManagerClass();
		return ResourceManagerIntance;	
	})();
	return Framework;
})(Framework || {});