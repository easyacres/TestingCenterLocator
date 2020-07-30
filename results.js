$(document).ready(function () {




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
            $("#caseCount").text(confirmedCases);
            $("#recoveryCount").text(recoveredCases);
            $("#deathCount").text(totalDeaths);
            console.log(confirmedCases, totalDeaths, confirmedCases);


            
            console.log("Success: ", data);
        })












    //======================================================================
    //google maps API
    //======================================================================


    var map;
    var service;
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
        
        // Display Map
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 11.4,
            disableDefaultUI: true,
            styles: [
                { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{ color: '#263c3f' }]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#6b9a76' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#38414e' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#212a37' }]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#9ca5b3' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{ color: '#e98d96' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#1f2835' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#f3d19c' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{ color: '#2f3948' }]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#17263c' }]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#515c6d' }]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#17263c' }]
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
            
            var request = {
                placeId: id,
                fields: ['name', 'address_component', 'geometry.location', 'rating', 'formatted_phone_number', 'photos', 'url', 'opening_hours', 'website', 'reviews'],
            };

            service = new google.maps.places.PlacesService(map);
            service.getDetails(request, callback);

            
            function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var label = labels[labelIndex++ % labels.length];
                    console.log("location data: ", place);
                    createMarker(place.geometry.location, place, label);

                    displayLocationData(label, place);


                };

            };

        });
    };

    function displayLocationData(label, place) {


        $("#location-data-display").append(`
            <button class="accordion">
                <h5>${label} )</h5>
                <h5 id="location-name">${place.name}</h5>
                <h6 id="address">
                    ${place.address_components[0].long_name} 
                    ${place.address_components[1].short_name}, 
                    ${place.address_components[2].long_name}
                </h6>
            </button>
            
            <div class="panel">
                <h6 id="phone-number">${place.formatted_phone_number}</h6>
                <h6 id="full-address">
                    ${place.address_components[0].long_name} 
                    ${place.address_components[1].short_name}, 
                    ${place.address_components[2].long_name}, 
                    ${place.address_components[3].long_name}, 
                    ${place.address_components[4].short_name}, 
                    ${place.address_components[5].short_name}
                </h6>
                
                <a target="_blank" href="${place.url}">Get Directions</a>
                <ul>
                    <li>${place.opening_hours.weekday_text[0]}</li>
                    <li>${place.opening_hours.weekday_text[1]}</li>
                    <li>${place.opening_hours.weekday_text[2]}</li>
                    <li>${place.opening_hours.weekday_text[3]}</li>
                    <li>${place.opening_hours.weekday_text[4]}</li>
                    <li>${place.opening_hours.weekday_text[5]}</li>
                    <li>${place.opening_hours.weekday_text[6]}</li>
                
                </ul>
                <h6 class="rating">Rating: ${place.rating}</h6>
                <hr>
            </div>
        `);

    };


    function createMarker(position, location, label) {

        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: position,
            label: label,
            map: map
        });

        // var addressArray = location.formatted_address.split(",");

        var contentString = `
    <div id="content">
    <div id="siteNotice">
    </div>
    <h5 id="firstHeading" class="firstHeading">${location.name}</h5>
    
            <hr>
            <div id="bodyContent">
            <h6> ${location.address_components[0].long_name} ${location.address_components[1].short_name}</h6>
            <h6> ${location.address_components[2].long_name}, ${location.address_components[4].short_name}</h6>
            <h6> ${location.address_components[6].long_name}</h6>
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
        console.log(zipCode);
        var assignedNewsArtCount = 5;
        var assignedNewsContent ="COVID" ;
        var assignedImage = "required";
        // event.preventDefault();
        console.log("searchNewsCity")
        // console.log(searchNewsCity);
        fetch("https://gnews.io/api/v3/search?q=" +  assignedNewsContent +  "&max=" + assignedNewsArtCount + "&image=" + assignedImage + "&token=60d360cd2110a8dc7e101ad4a7742e13")

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
                                    <span><i class="fi-torso">${data.articles[i].source.name}</i></span>
                                    <span><i class="fi-calendar"> ${data.articles[i].publishedAt}</i></span>

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
    getArticles();

    window.onload = function () {
        // ==================================================================
        $(".accordion").on("click", function () {

            this.classList.toggle("active");
            console.log("clicked");

            var panel = this.nextElementSibling;
            console.log("here", panel);
            if (panel.style.display === "block") {
                $(this).next().slideUp();
            } else {
                $(".panel").slideUp();

                $(this).next().slideDown();
            }
        });
        // ==================================================================
    }


});