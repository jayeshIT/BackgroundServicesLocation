//------------------------------------------------------------------------------------------------------------------------------------------------------------------
var locationHandler = function(e) {
	if (e.success) {
		// do stuff
	} else if (e.error) {
		Ti.App.Properties.setString('PosType', 'gps');
	}

};
function getGeo() {
	Ti.API.info('====== Current Activuty in getGeo function:' + Titanium.Android.currentActivity);
	if (Titanium.Geolocation.locationServicesEnabled === false) {
		Ti.API.info('------- locationServicesEnabled : false--------');
		if (Titanium.Android.currentActivity != null) {
			alert('Please enable Location service from settings > Location.');
		} else {
			Ti.API.info('------- Please enable Location service from settings > Location.--------');
		}
	} else {

		if (Ti.App.Properties.getString('PosType') == 'gps') {

			Ti.API.info('------- PosType : PROVIDER_GPS--------');
			var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
				name : Ti.Geolocation.PROVIDER_GPS,
				minUpdateTime : 60, // time in seconds
				minUpdateDistance : 50 // distance in meters
			});

			var gpsRule = Ti.Geolocation.Android.createLocationRule({
				provider : Ti.Geolocation.PROVIDER_PROVIDER_GPS,
				accuracy : 100, // Updates should be accurate to 250m
				//maxAge : 1200000, // Updates should be no older than 20min
				//minAge : 600000 // But  no more frequent than once per 10min
				maxAge : 20000,
				minAge : 10000
			});
			Ti.App.Properties.setString('PosType', 'network');
		} else {

			Ti.API.info('------- PosType : PROVIDER_NETWORK--------');
			var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
				name : Ti.Geolocation.PROVIDER_NETWORK,
				minUpdateTime : 60, // time in seconds
				minUpdateDistance : 50 // distance in meters
			});

			var gpsRule = Ti.Geolocation.Android.createLocationRule({
				provider : Ti.Geolocation.PROVIDER_PROVIDER_NETWORK,
				accuracy : 100, // Updates should be accurate to 250m
				//maxAge : 1200000, // Updates should be no older than 20min
				//minAge : 600000 // But  no more frequent than once per 10min
				maxAge : 20000,
				minAge : 10000
			});
		}

		if (!Ti.Geolocation.Android.getManualMode) {
			Ti.Geolocation.Android.manualMode = true;
		}

		//remove previous rules;
		Ti.Geolocation.Android.removeLocationProvider(gpsProvider);
		Ti.Geolocation.Android.removeLocationRule(gpsRule);

		//add current rules;
		Ti.Geolocation.Android.addLocationProvider(gpsProvider);
		Ti.Geolocation.Android.addLocationRule(gpsRule);

		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (e.success) {
				// do stuff
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;

				if (Titanium.Network.online) {

					Ti.API.info('====== Current Activuty in online:' + Titanium.Android.currentActivity);
					Ti.API.info('-----------------------------------------' + longitude);
					Ti.API.info('-----------------------------------------' + latitude);

					// send This coordinatesd to server.......

				} else {
					Ti.API.info('====== Current Activuty in offline:' + Titanium.Android.currentActivity);
					if (Titanium.Android.currentActivity != null) {
						alert('Please turn on internet connection.');
					} else {
						Ti.API.info('======Please turn on internet connection======');
					}

				}

			} else if (e.error) {
				if (Titanium.Android.currentActivity != null) {
					alert('Error while taking location coordinates.');
				}
				if (Ti.App.Properties.getString('PosType') == 'network') {
					Ti.App.Properties.setString('PosType', 'gps');
				}
			}
		});

		// taking out the garbage
		if (!Titanium.Geolocation._hasLocationEvent) {
			Titanium.Geolocation._hasLocationEvent = true;
			Titanium.Geolocation.addEventListener('location', locationHandler);
		} else {
			Titanium.Geolocation.removeEventListener('location', locationHandler);
			Titanium.Geolocation._hasLocationEvent = false;
		}
	}
}

getGeo();
