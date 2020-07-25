

var map;
var service;
var infowindow;
var currentLocation;
var geocoder = new google.maps.Geocoder();

var zipCode = "";
var lat = '';
var lng = '';
StatAPI = "e4d71997540c41028352933253eb7f8c";

$("#btn").on("click", function () {

    var stateCode = $("#stacked-state").val();

    //1. get the state code from our dropdown
    //================================
    //covid stats API
    //================================
    $.ajax({
        type: "GET",
        url: "https://api.smartable.ai/coronavirus/stats/US-" + stateCode,

        // Request headers
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Cache-Control", "no-cache");
            xhrObj.setRequestHeader("Subscription-Key", StatAPI);
        },
    })
        .done(function (data) {
            alert("success");
            console.log("success", data)
        })
        .fail(function () {
            alert("error");
        });

    //================================
    //google maps API
    //================================

    zipCode = $("#zip").val();

    window.location.replace("/results.html?zip=" + zipCode + "&state=" + stateCode);
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

});





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
};
function createMarker(position) {

    var marker = new google.maps.Marker({
        position: position,
        map: map
    });


};

