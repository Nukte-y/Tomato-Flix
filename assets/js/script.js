$("#search-btn").on("click", function (event) {
  event.preventDefault(); 
  $("#search-btn").empty();
  $("#film-Info").empty();
  var title = $(".form-control").val();

  fetch("https://www.omdbapi.com/?t=" + title + "&plot=full&apikey=trilogy")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      $("<img>").attr("src", data.Poster).appendTo("#film-Info").addClass("img col-md-3");
      console.log(data.Poster);
      var genre = data.Genre.split(",")[0].trim(); //split returns array
      // Call the function with the genre
      playSound(genre);
    });

    var apiURL = "https://gnews.io/api/v4/search?";
    var key = "&country=us&max=10&token=d06b56befd778f95afde57c26ebc9890";
    searchString = title +" movie";
    articleURL = apiURL + "q=" + searchString + key;
    fetch(articleURL)
      .then(function (response) {
      return response.json();
      }).then(function (data) {
        console.log(data);
      var article=$("<div>").text(data.articles[0].content);
      console.log(data.articles[0]);  
      $("#article-Display").prepend(article);
    })
  });
  function playSound(theme) {
    var movieSound = $("<audio>").appendTo("#search");
    movieSound.attr("src", `./assets/musics/${theme}.mp3`);
    movieSound.get(0).play();
    $("#pause-button").on("click", function() {
      movieSound.get(0).pause();
    });
  };
    


























  var Keys = require('./Keys.js'); //references the api keys in the gitignore
  function getReviews() {
    var movieName = document.getElementsByClassName('form-control')[0].value; //user input
    var url =  `https://metacriticapi.p.rapidapi.com/movies/${movieName}?reviews=true`;
    const options = {
      method: 'GET',
      headers: Keys
    };
    
    fetch(url, options)
      .then(response => response.json())
      .then(result => {
        var reviewsDiv = document.getElementById('reviews')
        reviewsDiv.innerHTML = '';
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  