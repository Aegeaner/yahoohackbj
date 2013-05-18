function Oauth2() {
    jso_configure({
        "weibo": {
            client_id: "2855984353",
            redirect_uri: "http://127.0.0.1/geo/index.html",
            authorization: "https://api.weibo.com/oauth2/authorize"
        }
    });
    
    globals.accesstoken = jso_getToken("weibo");
    console.log(globals.accesstoken);
}

function getStatus() {
    if(!globals.accesstoken)
        Oauth2();
    
    YUI().use('node', 'jsonp', 'jsonp-url', function (Y) {
        var getStatusUrl = "https://api.weibo.com/2/place/nearby/users.json?source=" +
        encodeURIComponent(globals.appkey) + "&accesstoken=" + encodeURIComponent(globals.accesstoken) +
        "&lat=" + encodeURIComponent(globals.latitude) + "&long=" + encodeURIComponent(globals.longitude);
        console.log(getStatusUrl);
        
        var getPoiUrl = "https://api.weibo.com/2/place/nearby/pois.json?source=" +
        encodeURIComponent(globals.appkey) + "&accesstoken=" + encodeURIComponent(globals.accesstoken) +
        "&lat=" + encodeURIComponent(globals.latitude) + "&long=" + encodeURIComponent(globals.longitude);
        console.log(getPoiUrl);
        
        function handleStatusJSONP(response) {
            var result = '';
            var users = response.data.users;
            if (users != null) {
                for(var i=0; i<users.length; i++) {
                    var screen_name = users[i].screen_name;
                    var last_at = users[i].last_at;
                    var status = users[i].status.text;
                    var lat = null;
                    var lon = null;
                    //console.log(users[i]);
                    result += "<p><b>" + screen_name + "</b> 在<i>" + last_at + "</i> 说：" + status +"</p></hr>";
                }
            }
            if (result === '') {
                result = '没有搜索到该地区的微博';
            }
            document.getElementById('weibo').innerHTML = result;
        }
        
        function handlePoiJSONP(response) {
            var result = '';
            var pois = response.data.pois;
            //console.log(pois);
            for(var i=0; i<pois.length; i++) {
                var title = pois[i].title;
				var category_name = pois[i].category_name;
                var address = pois[i].address;
                var lat = pois[i].lat;
                var lon = pois[i].lon;
				labelMarker(category_name, title, address, lat, lon);
               // result += "<p><b>" + title + "</b> 在<i>(" + lat + ", " + lon + ")</i></p></hr>";
            }
            //document.getElementById('map').innerHTML = result;
        }
        
        Y.jsonp(getStatusUrl, handleStatusJSONP);
        Y.jsonp(getPoiUrl, handlePoiJSONP);
    });
}

function labelMarker(label, title, address, latitude, longitude){
    
    var marker = new MarkerWithLabel({
        position: new google.maps.LatLng(latitude, longitude),
        draggable: false,
        raiseOnDrag: true,
        map: globals.map,
        labelContent: label,//label的名字
        labelAnchor: new google.maps.Point(22,0),
        labelClass: "labels",
        labelStyle: {opacity:1.0},
        //icon:{}
    });
    var iw = new google.maps.InfoWindow({
        content: title + ": " + address //对话框中的内容
    });
    google.maps.event.addListener(marker,"click",function(e){iw.open(globals.map,this);});
}