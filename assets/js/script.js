var title;
var movieDetailsContainer = $("<div>").addClass("col-md-3");
$(".tomato").on("click", function searchMovie(event) {
  event.preventDefault();
  $("#search-btn").empty(); //cleaning sections
  $("#film-Info").empty();
  $("#article-Display").empty();
  $("#pause-button, #history, #reviews, #new-articles").each(function () {
    $(this).removeClass("display-none");
  });
  title = $(".form-control").val();
  $(this).attr("src", "./assets/img/Squashed_Tomato.png"); //change tomato image when click

  // Hi Guys, I added a timeout to this so that the image changes back to the original tomato after 3 seconds
  var self = this;
  setTimeout(function () {
    $(self).attr("src", "./assets/img/Tomato_Squish_Time.png");
  }, 3000);
  // End of my function

  fetch("https://www.omdbapi.com/?t=" + title + "&plot=full&apikey=trilogy")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $("<img>")
        .attr("src", data.Poster)
        .appendTo("#film-Info")
        .addClass("img col-md-3");
      console.log(data.Poster);
      var genre = data.Genre.split(",")[0].trim(); //split returns array
      // Call the function with the genre
      playSound(genre);
      movieDetails(data);
    });
  return title;
});

function playSound(theme) {
  //plays music that matches the genre
  var movieSound = $("<audio>").appendTo("#search");
  movieSound.attr("src", `./assets/musics/${theme}.mp3`);
  movieSound.get(0).play();
  $("#pause-button").on("click", function () {
    soundControl(movieSound);
  });
}
function soundControl(movieSound){
  let soundImage=$("#pause-button").attr("src");
  if(soundImage==="./assets/img/sound_off.png"){
    $("#pause-button").attr("src","./assets/img/sound_on.png");
    movieSound.get(0).play();
  }
  else{
    movieSound.get(0).pause();
    $("#pause-button").attr("src","./assets/img/sound_off.png")
  }
}

$("#news-btn").on("click", displayArticle);

var apiURL = "https://gnews.io/api/v4/search?";
var key = "&country=us&max=10&token=d06b56befd778f95afde57c26ebc9890";
var searchString = title + " movie";
var articleURL = apiURL + "q=" + searchString + key;

function displayArticle(event) {
  //displays article titles
  event.preventDefault();
  $("#article-Display").empty();
  fetch(articleURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < 5; i++) {
        var articleUrl = data.articles[i].url;
        var articleTitle = $("<div>")
          .addClass("article")
          .append(
            $("<a>")
              .text(data.articles[i].title)
              .attr({ href: articleUrl, target: "_blank" })
          );
        $("#article-Display").append(articleTitle);
      }
    });
}
function movieDetails(data) {
  movieDetailsContainer.empty();

  let movieDetails = {
    Title: data.Title,
    Director: data.Director,
    Runtime: data.Runtime,
    Genre: data.Genre,
    Actors: data.Actors,
    Awards: data.Awards,
    Ratings:""
  };

  $("#content").children().eq(1).after(movieDetailsContainer);
  for (let key in movieDetails) {
    // $("<h3>").text(`${key}: ${movieDetails[key]}`).appendTo(movieDetailsContainer).addClass("?");
    var h3 = $("<h3>").appendTo(movieDetailsContainer);
    $("<span>").text(`${key}: `).addClass("key").appendTo(h3);
    $("<span>").text(movieDetails[key]).addClass("value").appendTo(h3);
  }
  ratings(data);
  
  function ratings(data) {
    let allRatingsDiv = $("<div>").appendTo(movieDetailsContainer).attr("id","detail_sub_ratings")
    var ratings=data.Ratings;
    
    ratings.forEach(rating => {
      let ratingEl= $("<div>").appendTo(allRatingsDiv).addClass("rating")
      
      for (let key in rating) {
        if(!isNaN(parseFloat(rating[key]))){
          $("<span>").text(`${rating[key]} `).appendTo(ratingEl).addClass("value")}
        else{
          $("<span>").text(`${rating[key]} `).appendTo(ratingEl).addClass("key")
          } 
        }
      }
    )
  }
}

var apikey = Keys.Key; // references the keys in the api keys in the keys.js file
var apiHost = Keys.Host;

function getReviews() {
  var movieName = document.getElementsByClassName("form-control")[0].value; //captures user input data

  // Get the existing movies from local storage
  var movies = JSON.parse(localStorage.getItem('movies')) || [];
  
  // Add the new movie to the beginning of the array
  movies.unshift(movieName);
  
  // If there are more than 5 movies, remove the last one
  if (movies.length > 5) {
    movies.pop();
  }
  
  // Store the updated movies array in local storage
  localStorage.setItem('movies', JSON.stringify(movies));
  var url = `https://movie-database-imdb.p.rapidapi.com/movie/?name=${movieName}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apikey,
      "X-RapidAPI-Host": apiHost,
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      var reviewSpace=result.review;
      var reviewsDiv = document.getElementById("reviews");
      reviewsDiv.innerHTML = "";

      if (reviewSpace) {
       
          var reviewerName = document.createElement("h3");
          reviewerName.textContent = reviewSpace.author;
          reviewsDiv.appendChild(reviewerName);

          var heading = document.createElement("h5");
          heading.textContent = reviewSpace.heading;
          reviewsDiv.appendChild(heading);

          var reviewBody = document.createElement("p");
          reviewBody.textContent = reviewSpace.reviewBody;
          reviewsDiv.appendChild(reviewBody);
       
      } else {
        reviewsDiv.textContent = "No reviews found.";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Add event listener to the search button
document.getElementById("search-btn").addEventListener("click", getReviews);

// Display the movie names from local storage when the page loads
window.onload = function() {
  var movies = JSON.parse(localStorage.getItem('movies')) || []; // get the movies from local storage
  var movieListDiv = document.getElementById("movie-list");
  movieListDiv.innerHTML = "";

  movies.forEach(function(movieName) {
    var movieNameDiv = document.createElement("div");
    movieNameDiv.textContent = movieName;
    movieListDiv.appendChild(movieNameDiv);

    // Add event listener to the movie name div
    movieNameDiv.addEventListener("click", function() {
      document.getElementsByClassName("form-control")[0].value = movieName; // set the input value to the clicked movie name
      getReviews(); // fetch the reviews for the clicked movie
    });
  });
};