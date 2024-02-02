var title;
var movieDetailsContainer=$("<div>").addClass("col-md-2");
$(".tomato").on("click", function searchMovie(event) {
  event.preventDefault(); 
  $("#search-btn").empty();       //cleaning sections
  $("#film-Info").empty();
  $("#article-Display").empty();
  title = $(".form-control").val();
  $(this).attr("src","./assets/img/Squashed_Tomato.png")  //change tomato image when click
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
      movieDetails(data);
    });
  return title;
});

function playSound(theme) {               //plays music that matches the genre
  var movieSound = $("<audio>").appendTo("#search");
  movieSound.attr("src", `./assets/musics/${theme}.mp3`);
  movieSound.get(0).play();
  $("#pause-button").on("click", function() {
    movieSound.get(0).pause();
  });
};
  
$("#news-btn").on("click",displayArticle)

var apiURL = "https://gnews.io/api/v4/search?";
var key = "&country=us&max=10&token=d06b56befd778f95afde57c26ebc9890";
searchString = title +" movie";
articleURL = apiURL + "q=" + searchString + key;

function displayArticle(event){       //displays article titles
  event.preventDefault();
  $("#article-Display").empty();
  fetch(articleURL)
    .then(function (response) {
    return response.json();
    }).then(function (data) {
      for(var i=0;i<5;i++){
        var articleUrl=data.articles[i].url;
        var articleTitle=$("<div>").addClass('article').append($("<a>").text(data.articles[i].title).attr({"href":articleUrl,"target":"_blank"})); 
        $("#article-Display").append(articleTitle);
      }
    }
)};
function movieDetails(data) {
  movieDetailsContainer.empty();
  let movieDetails={Title: data.Title, Director: data.Director, Runtime: data.Runtime, Genre: data.Genre, imdbRating: data.imdbRating};
  $("#content").children().eq(1).after(movieDetailsContainer); 
    for(let key in movieDetails) {
      // $("<h3>").text(`${key}: ${movieDetails[key]}`).appendTo(movieDetailsContainer).addClass("?");
      var h3 = $("<h3>").appendTo(movieDetailsContainer);
      $("<span>").text(`${key}: `).addClass("key").appendTo(h3);
      $("<span>").text(movieDetails[key]).addClass("value").appendTo(h3);
    }  
  } 



















































































  var apikey=Keys.Key;// references the keys in the api keys in the keys.js file
  var apiHost=Keys.Host;
  
  function getReviews() {
    var movieName = document.getElementsByClassName('form-control')[0].value; //captures user input data
    var url =  `https://metacriticapi.p.rapidapi.com/movies/${movieName}?reviews=true`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apikey,
        'X-RapidAPI-Host': apiHost
      }
    };
    
    fetch(url, options)
    .then(response => response.json())
    .then(result => {
      var reviewsDiv = document.getElementById('reviews')
      reviewsDiv.innerHTML = '';

      if (result.recentReviews) {
        result.recentReviews.forEach(review => {
          var reviewerName = document.createElement('h3');
          reviewerName.textContent = review.name;
          reviewsDiv.appendChild(reviewerName);

          var reviewBody = document.createElement('p');
          reviewBody.textContent = review.body;
          reviewsDiv.appendChild(reviewBody);
        });
      } else {
        reviewsDiv.textContent = "No reviews found.";
      }
  })
  .catch(error => {
    console.error(error);
  });
}

// Add event listener to the search button
document.getElementById('search-btn').addEventListener('click', getReviews);

