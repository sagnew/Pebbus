var getNearbyStops = function(){
	var req = new XMLHttpRequest();
  	req.open('GET', 'http://runextbus.herokuapp.com/nearby/40.5040/-74.44905', true);
	req.onload = function(e) {
		if (req.readyState == 4 && req.status == 200) {
			if(req.status == 200) {
				var response = JSON.parse(req.responseText);
				var stops = [];
				for(var k in response) {
					 if(response.hasOwnProperty(k)){
						  stops.push(k);
					 }
				}
				Pebble.showSimpleNotificationOnPebble("Nearby stops", stops.join(' '));
			} else { console.log("Error"); }
		}
	}
	req.send(null);
}

Pebble.addEventListener("ready",
    function(e) {
	    getNearbyStops();
    }
);