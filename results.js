var params = new URLSearchParams(window.location.search);


var zipCode = params.get("zip") //grab from url string
var stateCode = params.get("state") //grab from url string







//======================================================================
//covid stats API
//======================================================================

StatAPI = "e4d71997540c41028352933253eb7f8c";

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
    .then(function (data) {
        confirmedCases = data.stats.totalConfirmedCases;
        recoveredCases = data.stats.totalRecoveredCases;
        totalDeaths = data.stats.totalDeaths;
        MyNumberAsString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        $("#caseCount").text(confirmedCases);
        $("#recoveryCount").text(recoveredCases);
        $("#deathCount").text(totalDeaths);
        console.log(confirmedCases, totalDeaths, confirmedCases);


        alert("success");
        console.log("Success: ", data);
    })












//======================================================================
//google maps API
//======================================================================


var map;
var service;
var infowindow;
var currentLocation;
var geocoder = new google.maps.Geocoder();

var lat = '';
var lng = '';

var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var labelIndex = 0;

var placeIDArray = [];


console.log("Selected Zip: " + zipCode);

//Geocoder function
function getLatLngFromZip() {

    //Convert entered zipcode into a latitude and longitude
    geocoder.geocode({
        'address': zipCode
    }, function (results, status) {
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
        zoom: 11.2,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }
        ]
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
    // service.getDetails(request, callback);


    callback();
}

// Function for pulling Testing Center data
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        console.log("Testing center Results: ", results);
        //Loop that runs through our results 
        for (var i = 0; i < results.length; i++) {
            var location = results[i];

            placeIDArray.push(location.place_id);

        };
        currentLocation = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);
        getLocationDetails();



    };
};

function getLocationDetails() {

    placeIDArray.forEach(function (id) {
        console.log(id);
        var request = {
            placeId: id,
            fields: ['name', 'address_component', 'geometry.location', 'rating', 'formatted_phone_number', 'photos', 'url', 'opening_hours', 'website', 'reviews'],
        };

        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var label = labels[labelIndex++ % labels.length];
                console.log(place);
                createMarker(place.geometry.location, place, label);

                $("#location-data-display").append(`
                     <button class="accordion">
                        <h6 id="location-name">${place.name}</h6>
                        <p id="address">
                            ${place.address_components[0].long_name} 
                            ${place.address_components[1].short_name}, 
                            ${place.address_components[2].long_name}
                        </p>
                    
                    </button>
                    <div class="panel">
                    <i class="fas fa-phone-alt"></i><span id="phone-number><p id="phone-number">${place.formatted_phone_number}</p></span>
                    <i class="fas fa-map-marker-alt"></i><span class="full-address"<p id="full-address">${place.address_components[0].long_name} ${place.address_components[1].short_name}, ${place.address_components[2].long_name}, ${place.address_components[3].long_name}, ${place.address_components[4].long_name}</p></span>
                       
                    <a target="_blank" href="${place.url}">Get Directions</a> 
                        <hr>
                    
                    <i class="far fa-clock"></i><span id="time1"><p id="time1">${place.opening_hours.weekday_text[0]}</p></span>
                    <p id="time2">${place.opening_hours.weekday_text[1]}</p>
                        <p>${place.opening_hours.weekday_text[2]}</p>
                        <p>${place.opening_hours.weekday_text[3]}</p>
                        <p>${place.opening_hours.weekday_text[4]}</p>
                        <p>${place.opening_hours.weekday_text[5]}</p>
                        <p>${place.opening_hours.weekday_text[6]}</p>
                    
                    <hr>
                `);

                $(".accordion").on("click", function () {
                    /* Toggle between adding and removing the "active" class,
                    to highlight the button that controls the panel */
                    this.classList.toggle("active");
                    console.log("clicked");

                    /* Toggle between hiding and showing the active panel */
                    var panel = this.nextElementSibling;
                    if (panel.style.display === "block") {
                        panel.style.display = "none";
                    } else {
                        panel.style.display = "block";
                    }
                });
            };




        };
    });



};



function createMarker(position, location, ) {
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: position,
        map: map,
    });

    // var addressArray = location.formatted_address.split(",");

    var contentString = `
        <div id="content">
            <div id="siteNotice">
            </div>
            <h6 id="firstHeading" class="firstHeading"><strong>${location.name}</strong></h6>
            
            <hr>
            <div id="bodyContent">
                <p class="lead"> ${location.address_components[0].long_name} ${location.address_components[1].short_name}</p class="lead">
                <p class="lead"> ${location.address_components[2].long_name}, ${location.address_components[4].short_name}</p class="lead">
                <p class="lead"> ${location.address_components[6].long_name}</p class="lead">
            </div>
        </div>`



    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 500
    });

    marker.addListener("mouseover", () => {
        infowindow.open(map, marker);

    });

    marker.addListener('mouseout', () => {
        infowindow.close();
    });
    marker.addListener('click', () => {

    });


};

// ======================================================================
// News API
// ======================================================================

function getArticles(event) {
    var searchNewsCity = zipCode;
    console.log(zipCode);
    var assignedNewsArtCount = 5;
    var assignedNewsContent = "COVID";
    var assignedImage = "required";
    // event.preventDefault();
    console.log("searchNewsCity")
    // console.log(searchNewsCity);
    fetch("https://gnews.io/api/v3/search?q=" + assignedNewsContent + "&max=" + assignedNewsArtCount + "&image=" + assignedImage + "&token=60d360cd2110a8dc7e101ad4a7742e13")

        .then(function (response) {
            return response.json();

        })
        .then(function (data) {
            console.log(data);
            for (var i = 0; i < data.articles.length; i++) {
                var newsArticles = $("#newsArticles")
                // var grabNewsTitle = data.articles[i].title;
                // var grabNewsUrl = data.articles[i].url;
                // var newNewsDiv = $("<div>").appendTo(newsArticles);
                // $("<h3>").text(grabNewsTitle).appendTo(newNewsDiv);
                // $("<p>").text(grabNewsUrl).appendTo(newNewsDiv);
                newsArticles.append(

                    `<div class="grid-x grid-margin-x">
                        <div class="large-6 cell">
                            <p><img src="${data.articles[i].image}"
                                alt="article image info ${data.articles[i].source.name, data.articles[i].title }"></p>
                        </div>
                        <div class="large-6 cell">
                            <h5><a href="${data.articles[i].url}">${data.articles[i].title}</a></h5>
                            <p>
                                <span><i class="fi-web"> ${data.articles[i].source.name} </i></span>
                                <br>
                                <span><i class="fi-calendar"> ${data.articles[i].publishedAt} </i></span>

                            </p>
                            <p>${data.articles[i].description}</p>
                        </div>
                    </div>

                    <hr>`
                )

                console.log(data.articles[i]);

            }
            // 
        });
}



getLatLngFromZip();
// getArticles();