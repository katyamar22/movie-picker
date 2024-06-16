// DOM
const searchButton = document.getElementById('search-button');
const movieSearchInput = document.getElementById('movie-search');
const movieResultsContainer = document.getElementById('movie-results');


searchButton.addEventListener('click', async () => {
  const movieTitle = movieSearchInput.value;

  // If no movie is entered 
  if (movieTitle.trim() === '') {
    alert('Please enter a movie title.');
    return;
  }

  try {
    // Call the API
    const response = await fetch(`http://localhost:3000/search?title=${movieTitle}`);
    const similarMovies = await response.json();

    // Fetches similiar movie data
    displayMovieResults(similarMovies);

    // In case data cant be fetched
  } catch (error) {
    console.error('Error fetching movie data:', error);
    alert('An error occurred. Please try again later.');
  }
});

// Show movies on website
function displayMovieResults(movies) {
  movieResultsContainer.innerHTML = ''; // Clear previous results

  // Make movie card div
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    // Add movie image
    const posterImg = document.createElement('img');
    posterImg.classList.add('movie-poster');
    posterImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    posterImg.alt = movie.title;

    // Add movie detatils
    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    // Add movie title
    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = movie.title;


    // Add movie oviewview
    const movieOverview = document.createElement('p');
    movieOverview.classList.add('movie-overview');
    movieOverview.textContent = movie.overview;

    // Add movie rating
    const movieRating = document.createElement('p');
    movieRating.textContent = `Rating: ${movie.vote_average}/10`;


    // Append elements 
    movieCard.appendChild(posterImg);
    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(movieOverview);
    movieDetails.appendChild(movieRating);
    movieCard.appendChild(movieDetails);

    movieResultsContainer.appendChild(movieCard);
  });
}