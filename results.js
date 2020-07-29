

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
    .done(function (data) {

        console.log("Covid dtata:", data)
    })
    .fail(function () {
        alert("error");
    });











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
        zoom: 11.2
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

        }
        currentLocation = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);
    }
};



function createMarker(position, location, label) {

    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: position,
        label: label,
        map: map
    });

    var addressArray = location.formatted_address.split(",");

    var contentString = `
        <div id="content">
            <div id="siteNotice">
            </div>
            <h5 id="firstHeading" class="firstHeading">${location.name}</h5>
            <hr>
            <div id="bodyContent">
                <h6> ${addressArray[0]}</h6>
                <h6> ${addressArray[1]}, ${addressArray[2]}</h6>
                <h6> ${addressArray[3]}</h6>
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

//======================================================================
//News API
//======================================================================

function getArticles(event) {
    var searchNewsCity = zipCode;
    var assignedNewsArtCount = 5;
    // event.preventDefault();
    console.log("searchNewsCity")
    console.log(searchNewsCity);
    fetch("https://gnews.io/api/v3/search?q=" + searchNewsCity + "&max=" + assignedNewsArtCount + "&token=635c45291e6cf17423f49b624dc5f757")

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
                            <p><img src="https://placehold.it/600x370&text=Look at me!" alt="image for article"
                                alt="article preview image"></p>
                        </div>
                        <div class="large-6 cell">
                            <h5><a href="${data.articles[i].url}">${data.articles[i].title}</a></h5>
                            <p>
                                <span><i class="fi-torso"> By Thadeus &nbsp;&nbsp;</i></span>
                                <span><i class="fi-calendar"> 11/23/16 &nbsp;&nbsp;</i></span>
                               
                            </p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae impedit beatae, ipsumdelectus aperiam nesciunt magni facilis ullam.</p>
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
getArticles();