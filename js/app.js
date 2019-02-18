// Global variables
var markers;
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function AppViewModel() {
    markers = [];
    this.searchOption = ko.observable("");

    // a function to initiate the google maps
    initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.7413549, lng: -73.9980244 },
            zoom: 13
        });

        largeInfowindow = new google.maps.InfoWindow();
        bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < myLocations.length; i++) {
            // Google Maps marker setup
            marker = new google.maps.Marker({
                map: map,
                position: myLocations[i].location,
                lat: myLocations[i].location.lat,
                lng: myLocations[i].location.lng,
                title: myLocations[i].title,
                id: i,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
            // Create onClick even to open an infoWindow whenever a marker is clicked
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
            bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);

        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        this.populateInfoWindow = function (marker, infowindow) {

            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                marker.setAnimation(google.maps.Animation.BOUNCE);
                cID = "CO3W5QFBLQSM3L5LJEQ2BP33EQ15STZ2BHDUQQKM1TWDG0UG";
                cSecrert = "ISIU44F3L4H52YFJJBXNBTHV1HW4MLKXMFYSHMVCR53F4REE";
                fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + cID + '&client_secret=' + cSecrert + '&v=20180323&limit=1&ll=' + marker.lat + ',' + marker.lng + '&query=' + marker.title)
                    .then(function (response) {
                        // Examine the text in the response
                        response.json().then(function (data) {
                            var fullLocation = data.response.headerFullLocation;
                            infowindow.setContent('<div>' + marker.title + '</div>' +
                                '<b>' + fullLocation + '</b>');
                        });
                    })
                    .catch(function (error) {
                        alert("Something goes wrong, please try again!!");
                        console.log(error);
                    });
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.setMarker = null;
                });
            }
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            }

        }

    };
    listClick = function () {
        for (var x = 0; x < markers.length; x++) {
            if (this.title === markers[x].title) {
                populateInfoWindow(markers[x], largeInfowindow);
            } else {

            }
        }

    }

    // This block appends our locations to a list using data-bind
    // It also serves to make the filter work
    myFilter = ko.computed(function () {
        var result = [];
        for (var i = 0; i < myLocations.length; i++) {
            var current = myLocations[i];
            if (current.title.toLowerCase().includes(this.searchOption()
                .toLowerCase())) {
                result.push(current);
            } else {
                continue;
            }
        }
        return result;
    }, this);

}

ko.applyBindings(new AppViewModel());