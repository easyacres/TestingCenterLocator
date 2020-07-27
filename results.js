

var params = new URLSearchParams(window.location.search);


var zipCode = params.get("zip") //grab from url string
var stateCode = params.get("state") //grab from url string


var map;
var service;
var infowindow;
var currentLocation;
var geocoder = new google.maps.Geocoder();


var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var labelIndex = 0;

var lat = '';
var lng = '';
StatAPI = "e4d71997540c41028352933253eb7f8c";




//================================
//covid stats API
//================================
console.log("Selected state: " + stateCode);
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

        console.log("Covid dtata:", data)
    })
    .fail(function () {
        alert("error");
    });











//================================
//google maps API
//================================
console.log("Selected Zip: " + zipCode);

//Geocoder function
function getLatLngFromZip() {

    //Convert entered zipcode into a latitude and longitude
    geocoder.geocode({ 'address': zipCode }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            console.log("latitude: " + lat + " Longitude: " + lng);

            initialize();

        } else {

            alert("Geocode was not successful for the following reason: " + status);
            return;
        }
    });
}

function initialize() {
    // Get current location from lat and long
    currentLocation = new google.maps.LatLng(lat, lng);
    console.log(currentLocation);
    // Display Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 12
    });
    // Request paramenters
    var request = {
        location: currentLocation,
        openNow: true,
        radius: '800',
        query: 'COVID testing'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
    callback();
}

// Function for pulling Testing Center data
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        console.log("Testing center Results: ", results);
        //Loop that runs through our results
        for (var i = 0; i < results.length; i++) {
            var location = results[i];
            createMarker(location.geometry.location, location, labels[labelIndex++ % labels.length],);
            console.log("Testing center: " + location.name + " Address: " + location.formatted_address);
           
        }
        currentLocation = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);
    }
};
function createMarker(position, location, label) {

    

    var marker = new google.maps.Marker({
        position: position,
        label: label,
        map: map
    });


    var contentString = `
        <div id="content">
            <div id="siteNotice">
            </div>
            <h2 id="firstHeading" class="firstHeading">${location.name}</h2>
            <hr>
            <div id="bodyContent">
                <p>Adress: ${location.formatted_address}</p>
            </div>
        </div>`


      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 500
      });
      marker.addListener("mouseover", () => {
        infowindow.open(map, marker);
        console.log($(this));
      });
      marker.addListener('mouseout', () => {
        infowindow.close();
    });


};




getLatLngFromZip();