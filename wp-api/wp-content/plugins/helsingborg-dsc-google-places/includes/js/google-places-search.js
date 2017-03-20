var initMap = function() {
    google.maps.event.addDomListener(window, 'load', function () {
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(55.919290, 12.667164),
            new google.maps.LatLng(56.184106, 13.049385)
        );
        
        var options = {
            bounds: defaultBounds,
            strictBounds: true
        };
        var input = document.getElementById('google-places-place');
        var places = new google.maps.places.Autocomplete(input, options);

        google.maps.event.addListener(places, 'place_changed', function () {
            var place = places.getPlace();
            document.getElementById("google-places-id").value = place.place_id;
        });
    });
}