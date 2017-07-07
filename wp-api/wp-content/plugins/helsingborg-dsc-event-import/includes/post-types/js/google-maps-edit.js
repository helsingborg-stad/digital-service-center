jQuery(function($) {
    $("#updateGoogleMap").click(function(e){
        e.preventDefault();
        var searchQuery = $("#google_search_query").val();
        var formatedQuery = searchQuery.replace(" ", "+");
        var langEn = '&language=en'
        var isEn = $("#googleMapsPreRender").attr('src').indexOf(langEn) !== -1;
        if(isEn) {
            $("#googleMapsPreRender").attr('src', 'https://www.google.com/maps/embed/v1/search?key=AIzaSyBPGb8bx7dKL2KMdLzarIwgUQvz_uy_4qU&q=' + formatedQuery + langEn);
        } else {
            $("#googleMapsPreRender").attr('src', 'https://www.google.com/maps/embed/v1/search?key=AIzaSyBPGb8bx7dKL2KMdLzarIwgUQvz_uy_4qU&q=' + formatedQuery);
        }       
    });
});