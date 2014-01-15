/*Takes a url and a callback function, and executes the callback on the response returned by the request*/
var executeGetRequest = function(url, callback){
	var req = new XMLHttpRequest();
  	req.open('GET', url, true);
	req.onload = function(e) {
		if (req.readyState == 4 && req.status == 200) {
			if(req.status == 200) {
				var response = JSON.parse(req.responseText);
				callback(response);
			} else { console.log("Error"); }
		}
	}
	req.send(null);
}

var displayBusPredictions = function(stops, stopTags){
	var i, j;
	for(i=0; i<stopTags.length; i += 1){
		executeGetRequest('http://runextbus.herokuapp.com/stop/' + stopTags[i], function(response){
			predictions = [];
			for(j=0; j<response.length; j += 1){
				bus = response[j];
				predictions.push(bus.title + ' ' + bus.direction + ': ' + bus.predictions);
			}
			Pebble.showSimpleNotificationOnPebble(stops[i], predictions.join('\n'));
		});
	}
}

/*Gets the tags associated with each stop(by stop title) to make further api calls*/
var mapStopsToTags = function(stops){
	executeGetRequest('http://runextbus.herokuapp.com/config', function(response){
		stopTags = [];
		for(var i=0; i<stops.length; i += 1){
			stopTags[i] = response.stopsByTitle[stops[i]].tags[0];
		}
		displayBusPredictions(stops, stopTags);
	});
}

/*Creates an array containing the titles of nearby stops.
Called by displayBusInfo*/
var getNearbyStops = function(response){
	var stops = [];
	for(var k in response) {
		if(response.hasOwnProperty(k)){
			stops.push(k);
		}
	}
	mapStopsToTags(stops);
}

/*Initiates the entire chain of callbacks to display the bus info in one notification*/
var displayBusInfo = function(){
	executeGetRequest('http://runextbus.herokuapp.com/nearby/40.5040/-74.44905', getNearbyStops);
}

Pebble.addEventListener("ready",
    function(e) {
	    displayBusInfo();
    }
);