var title;
var movieDetailsContainer = $("<div>").addClass("col-md-4");
$("#pause-button").on("click", function (event) {
  soundControl(movieSound);
});
$(".tomato").on("click", function searchMovie(event) {
  event.preventDefault();
  $("#search-btn").empty(); //cleaning sections
  $("#film-Info").empty();
  $("#article-Display").empty();
  $("#pause-button,#hist, #rev, #history, #reviews, #new-articles").each(
    function () {
      $(this).removeClass("display-none");
    }
  );
  title = $(".form-control").val();
  $("#pause-button").attr("src", "./assets/img/sound_on.png");
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
        .addClass("img");
      console.log(data.Poster);
      var genre = data.Genre.split(",")[0].trim(); //split returns array
      // Call the function with the genre
      playSound(genre);
      movieDetails(data);
    });
  return title;
});
var movieSound;
function playSound(theme) {
  //plays music that matches the genre
  var currentSound = $("#movie-sound");
  if (currentSound.length === 0) {
    movieSound = $("<audio>").appendTo("#search").attr("id", "movie-sound");
  } else {
    movieSound = currentSound;
  }
  movieSound.attr("src", `./assets/musics/${theme}.mp3`);
  movieSound.get(0).play();
}
function soundControl(movieSound) {
  let soundImage = $("#pause-button").attr("src");
  if (soundImage === "./assets/img/sound_off.png") {
    $("#pause-button").attr("src", "./assets/img/sound_on.png");
    movieSound.get(0).play();
  } else {
    movieSound.get(0).pause();
    $("#pause-button").attr("src", "./assets/img/sound_off.png");
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
    Ratings: "",
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
    let allRatingsDiv = $("<div>")
      .appendTo(movieDetailsContainer)
      .attr("id", "detail_sub_ratings");
    var ratings = data.Ratings;

    ratings.forEach((rating) => {
      let ratingEl = $("<div>").appendTo(allRatingsDiv).addClass("rating");

      for (let key in rating) {
        if (!isNaN(parseFloat(rating[key]))) {
          $("<span>")
            .text(`${rating[key]} `)
            .appendTo(ratingEl)
            .addClass("value ratingValue");
        } else {
          $("<span>")
            .text(`${rating[key]} `)
            .appendTo(ratingEl)
            .addClass("key ratingKey");
        }
      }
    });
  }
}

var apikey = Keys.Key; // references the keys in the api keys in the keys.js file
var apiHost = Keys.Host;

function getReviews() {
  var movieName = document.getElementsByClassName("form-control")[0].value; //captures user input data
  console.log(movieName);

  // // Get the existing movies from local storage
  var movies = JSON.parse(localStorage.getItem("movies")) || [];
  console.log(movies);
  // // Add the new movie to the beginning of the array
  movies.unshift(movieName);

  // // If there are more than 5 movies, remove the last one
  if (movies.length > 5) {
    movies.pop();
  }

  // Store the updated movies array in local storage
  localStorage.setItem("movies", JSON.stringify(movies));

  // Update the movie list in the HTML
  var movieListDiv = document.getElementById("history");
  movieListDiv.innerHTML = "";

  movies.forEach(function (movieName) {
    var movieNameDiv = document.createElement("button");
    movieNameDiv.textContent = movieName;
    movieListDiv.appendChild(movieNameDiv);

    // Add event listener to the movie name div
    movieNameDiv.addEventListener("click", function () {
      document.getElementsByClassName("form-control")[0].value = movieName; // set the input value to the clicked movie name

      // Fetch movie details
      fetch(
        "https://www.omdbapi.com/?t=" + movieName + "&plot=full&apikey=trilogy"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          $("#film-Info").empty(); //clean sections
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
      getReviews(); // fetch the reviews for the clicked movie
    });
  });

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
      var reviewSpace = result.review;
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

// // Get the root element
// const root = document.documentElement;

// // Get the toggle button
// const toggle = document.getElementById("toggle"); // Get the user's preference from localStorage
// const darkMode = localStorage.getItem("dark-mode"); // Check if the user has already chosen a theme
// if (darkMode) {
//   // If yes, apply it to the root element
//   root.classList.add("dark-theme");
// } // Add an event listener to the toggle button
// toggle.addEventListener("click", () => {
//   // Toggle the dark-theme class on the root element
//   root.classList.toggle("dark-theme"); // Store or remove the user's preference in localStorage
//   if (root.classList.contains("dark-theme")) {
//     localStorage.setItem("dark-mode", true);
//   } else {
//     localStorage.removeItem("dark-mode");
//   }
// });
