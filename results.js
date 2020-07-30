$(document).ready(function () {

    var params = new URLSearchParams(window.location.search);


    var zipCode = params.get("zip") //grab from url string
    var stateCode = params.get("state") //grab from url string

    $("#newSearchBtn").click(function (event) {
        event.preventDefault();
        zipCode = $("#resultsNewCity").val();
        console.log(zipCode);
        stateCode = $("#newStateList").val(); //Results page state select
        console.log(stateCode);
        runOurAPIs(zipCode, stateCode);
    })

    function runOurAPIs(zipCode, stateCode) {

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

        // Google mapsAPI global vars
        var map;
        var service;
        var currentLocation;
        var geocoder = new google.maps.Geocoder();

        var lat = '';
        var lng = '';

        var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var labelIndex = 0;

        var placeIDArray = [];


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
                    
                    return;
                }
            });
        }

        function initialize() {
            // Get current location from lat and long
            $("#location-data-display").empty();
            currentLocation = new google.maps.LatLng(lat, lng);
            console.log(currentLocation);
            // Display Map
            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 11.4,
                disableDefaultUI: true,
                // Map styling
                styles: [{
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#1d2c4d"
                        }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#8ec3b9"
                        }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#1a3646"
                        }]
                    },
                    {
                        "featureType": "administrative.country",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#4b6878"
                        }]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#64779e"
                        }]
                    },
                    {
                        "featureType": "administrative.province",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#4b6878"
                        }]
                    },
                    {
                        "featureType": "landscape.man_made",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#334e87"
                        }]
                    },
                    {
                        "featureType": "landscape.natural",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#023e58"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#283d6a"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#6f9ba5"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#1d2c4d"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#023e58"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#3C7680"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#304a7d"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#98a5be"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#1d2c4d"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#2c6675"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#255763"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#b0d5ce"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#023e58"
                        }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#98a5be"
                        }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#1d2c4d"
                        }]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#283d6a"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#3a4762"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#0e1626"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#4e6d70"
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
           
            callback();
        }

        // Function for pulling Testing Centers
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("Testing center Results: ", results);
                //Loop that runs through our results 
                for (var i = 0; i < results.length; i++) {
                    var location = results[i];
                    // Push results to array
                    placeIDArray.push(location.place_id);
                };
                // make our current location the first result
                currentLocation = results[0].geometry.location;
                // Set map center to first location
                map.setCenter(results[0].geometry.location);

                getLocationDetails();
            };
        };

        // Function for getting out data
        function getLocationDetails() {

            
            placeIDArray.forEach(function (id) {
                // for each place id we recive the following data
                var request = {
                    placeId: id,
                    fields: ['name', 'address_component', 'geometry.location', 'rating', 'formatted_phone_number', 'photos', 'url', 'opening_hours', 'website', 'reviews'],
                };
                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback);

                // This resturns our results
                function callback(place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        
                        console.log("location data: ", place);
                        // create our markers and display our location data
                        createMarker(place.geometry.location, place);
                        displayLocationData(place);
                    };
                };
            });
        };

        function displayLocationData(place) {
            // Append the location data to the display
            $("#location-data-display").append(`
        <button class="accordion">
            <h5 id="location-name">${place.name}</h5>
            <i class="fas fa-map-marker-alt"></i><span id="address"<p id="address">
                ${place.address_components[0].long_name} 
                ${place.address_components[1].short_name}, 
                ${place.address_components[2].long_name}
            </p></span>
        </button>
        <div class="panel">
        <i class="fas fa-phone-alt"></i><span id="phone-number><p id="phone-number">${place.formatted_phone_number}</p></span>
        <i class="fas fa-map-marker-alt"></i><span id="full-address><p id="full-address">
                ${place.address_components[0].long_name} 
                ${place.address_components[1].short_name}, 
                ${place.address_components[2].long_name}, 
                ${place.address_components[3].long_name}, 
                ${place.address_components[4].short_name}, 
                ${place.address_components[5].short_name}
            </p></span>
            <a id="directions" target="_blank" href="${place.url}">Get Directions</a>
            <hr>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[0]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[1]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[2]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[3]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[4]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[5]}</span></p>
                <p class="time"><i class="fas fa-clock"></i><span>${place.opening_hours.weekday_text[6]}</span></p>
            <hr>
        </div>
    `);
        };

        function createMarker(position, location, label) {
            // Marker parameters
            var marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: position,
                icon: {
                    url: "images/map-marker.png"
                },
                map: map
            });
            // Information to display when hovering over marker
            var contentString = `
        <div id="content">
        <div id="siteNotice">
        </div>
        <h6 id="firstHeading" class="firstHeading">${location.name}</h6>
        <hr>
        <div id="bodyContent">
        <p class="lead"> ${location.address_components[0].long_name} ${location.address_components[1].short_name}</h6>
        <p class="lead"> ${location.address_components[2].long_name}, ${location.address_components[4].short_name}</h6>
        <p class="lead"> ${location.address_components[6].long_name}</h6>
        </div>
        </div>`
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 500
            });

            // Have our markers display information when you hover over them
            marker.addListener("mouseover", () => {
                infowindow.open(map, marker);
            });
            marker.addListener('mouseout', () => {
                infowindow.close();
            });
            
        };
        //======================================================================
        //News API
        //======================================================================
        function getArticles(event) {
            var searchNewsCity = zipCode;
            console.log(zipCode);
            var assignedNewsArtCount = 5;
            var assignedNewsContent = "COVID";
            var assignedImage = "required";
            // event.preventDefault();
            console.log("searchNewsCity")
            // console.log(searchNewsCity);
            fetch("https://gnews.io/api/v3/search?q=" + assignedNewsContent + "&max=" + assignedNewsArtCount + "&image=" + assignedImage + "&token=e9869e383699068c951d662dbc54a452")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var newsArticles = $("#newsArticles")
                    newsArticles.empty();
                    for (var i = 0; i < data.articles.length; i++) {
                        // var grabNewsTitle = data.articles[i].title;
                        // var grabNewsUrl = data.articles[i].url;
                        // var newNewsDiv = $("<div>").appendTo(newsArticles);
                        // $("<h3>").text(grabNewsTitle).appendTo(newNewsDiv);
                        // $("<p>").text(grabNewsUrl).appendTo(newNewsDiv);
                        var dateArray = data.articles[i].publishedAt.split(" ");
                        var dateElement = dateArray[0].split("-");
                        var finalDate = dateElement[1] + "-" + dateElement[2] + "-" + dateElement[0];
                        newsArticles.append(
                            `<div class="grid-x grid-margin-x">
                        <div class="large-6 cell">
                            <p><img src="${data.articles[i].image}"
                                alt="article image info ${data.articles[i].source.name, data.articles[i].title }" height="370" width="600"></p>
                        </div>
                        <div class="large-6 cell">
                            <h5><a href="${data.articles[i].url}">${data.articles[i].title}</a></h5>
                            <p>
                                <span><i class="fi-web "> ${data.articles[i].source.name} </i></span>
                                <br>
                                <span><i class="fi-calendar "> ${finalDate} </i></span>
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
    };
    runOurAPIs(zipCode, stateCode);

    $(window).on("load", function () {
        $("#loader-wrapper").fadeOut("slow");
        $("body").removeClass("lock-screen");
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

    });
});