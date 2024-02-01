$(".search-button").on("click",function (event) {
    event.preventDefault();   
    fetch("http://www.omdbapi.com/?t="+title+"&plot=full&apikey=trilogy")
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      $("<img>").attr("src",data.Poster).appendTo(".poster")
      console.log(data.Poster);
      var id=data.imdbID.substring(2);
      console.log(id);
    
      // var platformURL="https://api.watchmode.com/v1/title/"+id+"/sources/?apiKey=ATiwaZYVpcvFTUK1nxNre6rmmejFmiTkne7ugEro";
    
                    
    
      fetch(platformURL)
      .then(function(data) {
        console.log(data);})
    
    });
    
    
      })
    