var getEventsJson = function() {
  fetch('https://api.helsingborg.se/event/json/wp/v2/event/')  
    .then(  
      function(response) {  
        if (response.status !== 200) {  
          console.log('Looks like there was a problem. Status Code: ' +  
            response.status);  
          return;  
        }
        response.json().then(function(data) { 
          return data;  
        });  
      }  
    )  
    .catch(function(err) {  
      console.log('Fetch Error :-S', err);  
  });
}

