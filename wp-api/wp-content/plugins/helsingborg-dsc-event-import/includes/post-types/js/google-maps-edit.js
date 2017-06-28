jQuery(function($) {
    $("#updateGoogleMap").click(function(e){
        e.preventDefault();
        var searchQuery = $("#google_search_query").val();
        var formatedQuery = searchQuery.replace(" ", "+");
        $("#googleMapsPreRender").attr('src', 'https://www.google.com/maps/embed/v1/search?key=AIzaSyBPGb8bx7dKL2KMdLzarIwgUQvz_uy_4qU&q=' + formatedQuery);
    });
});