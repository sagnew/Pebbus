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

var getNearbyStops = function(response){
	var stops = [];
	for(var k in response) {
		if(response.hasOwnProperty(k)){
			stops.push(k);
		}
	}
	Pebble.showSimpleNotificationOnPebble("Nearby stops", stops.join(' '));
}

var displayBusInfo = function(){
	executeGetRequest('http://runextbus.herokuapp.com/nearby/40.5040/-74.44905', getNearbyStops);
}

Pebble.addEventListener("ready",
    function(e) {
	    displayBusInfo();
    }
);