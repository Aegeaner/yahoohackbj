function getPosition() {
    navigator.geolocation.getCurrentPosition(
    function onSuccess(position) {
        globals.latitude = position.coords.latitude;
        globals.longitude = position.coords.longitude;
        var timestamp = new Date(position.timestamp);
        console.log("latitude = " + globals.latitude);
        console.log("longitude = " + globals.longitude);
        //initializeMap();
        getStatus();
    },
    function onError(error) {
        var txt;
        switch(error.code) {
            case error.PERMISSION_DENIED:
            txt = 'Permission denied';
            break;
            case error.POSITION_UNAVAILABLE:
            txt = 'Position unavailable';
            break;
            case error.TIMEOUT:
            txt = 'Position lookup timed out';
            break;
            default:
            txt = 'Unknown position.'
        }
        console.log(txt);
    });
}

// $(document).ready(function() {
// 	getPosition();
// });