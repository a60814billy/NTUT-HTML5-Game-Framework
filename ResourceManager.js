var framework = framework || {};

framework.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
	parent = framework,
	i;
	// strip redundant leading global
	if (parts[0] === "framework") {
		parts = parts.slice(1);
	}
	for (i = 0; i < parts.length; i += 1) {
		// create a property if it doesn't exist
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

framework.namespace("framework.ResourceManager");

framework.ResourceManager = (function(){
	/** @module Framework/ResourceManager */
	//Private
	var ResourceManager, responsedResource = {}, requestCount = 0, responseCount = 0, mainGame = {}, ajaxProcessing = true, intervalID = 0, timeountID = 0;

	var jsonProperty = {id: 'id', compositeGraph: 'compositeGraph', inGraphPositionX: 'inGraphPositionX', inGraphPositionY: 'inGraphPositionY', width: 'width', height: 'height'};

	var encode64 = function(inputStr){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var outputStr="";var i=0;while(i<inputStr.length){var byte1=inputStr.charCodeAt(i++)&255;var byte2=inputStr.charCodeAt(i++)&255;var byte3=inputStr.charCodeAt(i++)&255;var enc1=byte1>>2;var enc2=(byte1&3)<<4|byte2>>4;var enc3,enc4;if(isNaN(byte2))enc3=enc4=64;else{enc3=(byte2&15)<<2|byte3>>6;if(isNaN(byte3))enc4=64;else enc4=byte3&63}outputStr+=b64.charAt(enc1)+b64.charAt(enc2)+b64.charAt(enc3)+b64.charAt(enc4)}return outputStr};

	var setProperty = function(userProperty) {
		setSettingsInfo(jsonProperty, userProperty);		
	}; 

	var getId = function(json) {
		return getProperty(json, jsonProperty.id);
	};

	var getCompositeGraph = function(json) {		
		return getProperty(json, jsonProperty.compositeGraph);		
	};

	var getInGraphPositionX = function(json) {		
		return getProperty(json, jsonProperty.inGraphPositionX);		
	};

	var getInGraphPositionY = function(json) {		
		return getProperty(json, jsonProperty.inGraphPositionY);		
	};

	var getWidth = function(json) {		
		return getProperty(json, jsonProperty.width);		
	};

	var getHeight = function(json) {		
		return getProperty(json, jsonProperty.height);		
	};

	var getProperty = function(json, propertyName) {		
		if (json.hasOwnProperty(jsonProperty[propertyName])) {
			return json[jsonProperty[propertyName]];
		}
			
		if (!isUndefined(json[0])) {
			return getProperty(json[0]);
		}
			
		for (var key in json) { 
			if (!userSettings.hasOwnProperty(key)) {
				userSettings[key] = defaultSettings[key];
			}
		}
	};

	var setSettingsInfo = function(defaultSettings, userSettings) {
		for (var key in defaultSettings) { 
			if (isUndefined(userSettings[key])){
				userSettings[key] = defaultSettings[key];
			}				
		}
	};

	var isUndefined = function(obj) {
		return (typeof obj === 'undefined');		
	};

	var ajaxGetJSON = function(requestTarget, data, success) {
		minAjaxJSON('GET', requestTarget);
	};

	var ajaxPostJSON = function(requestTarget) {
		minAjaxJSON('POST', requestTarget);		
	};

	var minAjaxJSON = function(type, requestTarget) {
		requestTarget.systemSuccess = function(responseText, textStatus, xmlHttpRequest) { 
			var responseJSON = eval('(' + responseText.trim() + ')');	//因有可能是不合法的JSON, 故只能用eval了
			responsedResource[requestTarget.id] = { url: requestTarget.url, response: responseJSON };
			if (!isUndefined(requestTarget.success)) {
				requestTarget.success(responseJSON);
			}
		};

		minAjax(type, requestTarget);	
	};

	var ajaxGet = function(requestTarget) {		
		minAjax('GET', requestTarget);			
	};

	var ajaxPost = function(requestTarget) {		
		minAjax('POST', requestTarget);		
	};

	var ajaxGetImg = function(requestTarget) {		
		minAjaxImg('GET', requestTarget);			
	};

	var ajaxPostImg = function(requestTarget) {		
		minAjaxImg('POST', requestTarget);		
	};

	var minAjaxImg = function(type, requestTarget) {
		var id = requestTarget.id;
		requestTarget.systemSuccess = function(responseText, textStatus, xmlHttpRequest) { 
			var encodedResponseText = encode64(responseText);			
			responsedResource[id] = { url: requestTarget.url, response: encodedResponseText };
			if (!isUndefined(requestTarget.success)) {
				requestTarget.success.apply(this, encodedResponseText);
			}
		};

		minAjax(type, requestTarget);
	};

	var minAjax = function(type, requestTarget) {
		var userSettings = userSettings || {};
		userSettings.type = type || 'POST';

		if (!isUndefined(requestTarget.data)) {
			userSettings["data"] = requestTarget.data;
		}

		if (!isUndefined(requestTarget.systemSuccess)) {
			userSettings["success"] = requestTarget.systemSuccess;
		}	

		ajax(requestTarget, userSettings);
	};

	var ajax = function(requestTarget, userSettings) {
		requestCount += 1;

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
		setSettingsInfo(defaultSettings, userSettings);


		//因IE9後才支援HTML5, 故不再做其他判斷
		if (window.XMLHttpRequest) {
			httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = (function() {				
				if (httpRequest.readyState === 4) {
					if (httpRequest.status === 200) {
						responseCount += 1; 
						//需要放在success前面, 因為這樣才可以被後面的蓋掉
						responsedResource[requestTarget.id] = { url: requestTarget.url, response: httpRequest.responseText }; 
						userSettings.success.apply(this, [httpRequest.responseText, httpRequest.statusText, httpRequest]);							
											
					} /*else {
					responseCount += 1; 
					if (isUndefined(userSettings.statusCode[httpRequest.status])) {
						userSettings.error(httpRequest, httpRequest.statusText);
					} else {
						userSettings.statusCode[httpRequest.status]();	
					}
				}*/
				}
			});		
		};	
		
		if (!userSettings.cache && isUndefined(userSettings.data) && userSettings.type === 'GET') {	
			requestTarget.url = requestTarget.url + '?' + Math.random();	
		} else if (!isUndefined(userSettings.data) && userSettings.data.trim() !== '') {
			requestTarget.url = requestTarget.url + '?' + userSettings.data.trim();
		}
		
		httpRequest.open(userSettings.type, requestTarget.url, userSettings.async);	
		httpRequest.overrideMimeType('text/plain; charset=x-user-defined'); 
		
		if (userSettings.type === 'GET')	{
			httpRequest.send();
		} else {
			
			httpRequest.setRequestHeader('Content-Type', userSettings.contentType);	
			httpRequest.send(userSettings.data);
		}		
	};

	var setSettingsInfo = function(defaultSettings, userSettings) {
		for (var key in defaultSettings) { 
			if (isUndefined(userSettings[key]))
				userSettings[key] = defaultSettings[key];
		}		
	};

	var getResource = function(id) {
		return responsedResource[id].response;
	};

	var destroyResource = function(id) {
		responsedResource[id].response = null;
		responsedResource[id].url = null;
		delete responsedResource[id];
	};

	var setGame = function(game) {
		mainGame = game;
	};

	var detectAjax = function() {
		//Constuctor即開始偵測		
		ajaxProcessing = (requestCount != responseCount);
	};

	var stopDetectingAjax = function() {
		clearInterval(intervalID);
	};

	var gameStart = function() {
		//由game來控制遊戲開始的時機, 需要是在發出所有request後, 再call這個funciton
		if(!ajaxProcessing) {
			stopDetectingAjax();
			mainGame.start();
		} else {
			timeountID = setTimeout(function() {  
				gameStart();
				clearTimeout(timeountID);
			}, 500);
		}
	};

	//Constuctor
	/** 
	 * @constructor
	 * @param {Game} game funny
	 */
	ResourceManager = function(game) {
		requestCount = 0;
		responseCount = 0;

		if(!isUndefined(game)) {
			mainGame = game;
		}

		intervalID = setInterval(detectAjax, 50);
	};

	//Public
	/** request anything */
	ResourceManager.prototype = {
		/** request anything */
		ajax: ajax,
		/** request anything by GET */
		get: ajaxGet,
		/** request anything by POST */
		post: ajaxPost,
		ajaxImg: minAjaxImg,
		ajaxGetImg: ajaxGetImg,
		ajaxPostImg: ajaxPostImg,
		ajaxJSON: ajaxGetJSON,
		getResource: getResource,
		setGame: setGame,
		/** Game Contorller */
		gameStart: gameStart,
		/** Responsed Resource for Debug */
		responsedResource: responsedResource,	/* for Debug */
	};

	return ResourceManager;	
})();