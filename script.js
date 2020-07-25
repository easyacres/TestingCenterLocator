

var map;
var service;
var infowindow;
var currentLocation;
var geocoder = new google.maps.Geocoder();

var zipCode = "";
var lat = '';
var lng = '';


$('#zip').keypress(function(event){

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        
        event.preventDefault();
        zipCode = $("input").val();
        storeCityorZip();
        window.location.href = "user.html"

    };
});


function storeCityorZip() {
    localStorage.setItem("savedZip", zipCode);
};


function retrieveStoredZip() {
    
    var storedZip = localStorage.getItem("savedZip");

    if (storedZip != null) {
        zipCode = storedZip;
    };
};


console.log(window.location.href);
function runAPI () {

    if (window.location.href.includes("user.html")) {
        retrieveStoredZip();
        console.log("hit enter");
        
        console.log(zipCode);
    
        geocoder.geocode({ 'address': zipCode }, function (results, status) {
    
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
    
                console.log("latitude: " + lat + " Longitude: " + lng);
    
                
                google.maps.event.addDomListener(window, "load", initialize);
    
                
                localStorage.clear();
            } else {
    
                alert("Geocode was not successful for the following reason: " + status);
                return;
          }
        });  
    }
};



function initialize() {
    currentLocation = new google.maps.LatLng(lat, lng);
    console.log(currentLocation);

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 12
    });

    var request = {
        location: currentLocation,
        openNow: true,
        radius: '700',
        query: 'COVID testing'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
    callback();
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i].geometry.location);
            console.log("Testing center: " + results[i].name + " Address: " + results[i].formatted_address);

        }
        currentLocation = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);
    }
}
function createMarker(position) {

    var marker = new google.maps.Marker({
        position: position,
        map: map
    });


};
runAPI ();
