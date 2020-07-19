



var map;
var service;
var infowindow;
var currentLocation;
var geocoder = new google.maps.Geocoder();

var zipCode = "";
var lat = '';
var lng = '';






function initialize() {
    var CurrentLocation = new google.maps.LatLng(lat, lng);

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 12
    });

    var request = {
        location: CurrentLocation,
        openNow: true,
        radius: '700',
        query: 'COVID testing'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i].geometry.location);
            console.log(results[i]);
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

    
}



$("#btn").on("click", function () {

    zipCode = $(".inputField").val();
    geocoder.geocode({ 'address': zipCode }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
    } 
});

    initialize();
    callback();

});
