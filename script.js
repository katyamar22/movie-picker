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

    displayMovieResults(similarMovies);

  } catch (error) {
    console.error('Error fetching movie data:', error);
    alert('An error occurred. Please try again later.');
  }
});

function displayMovieResults(movies) {
  movieResultsContainer.innerHTML = ''; // Clear previous results

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const posterImg = document.createElement('img');
    posterImg.classList.add('movie-poster');
    posterImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    posterImg.alt = movie.title;

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie-title');
    movieTitle.textContent = movie.title;

    const movieOverview = document.createElement('p');
    movieOverview.classList.add('movie-overview');
    movieOverview.textContent = movie.overview;

    const movieRating = document.createElement('p');
    movieRating.textContent = `Rating: ${movie.vote_average}/10`;

    movieCard.appendChild(posterImg);
    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(movieOverview);
    movieDetails.appendChild(movieRating);
    movieCard.appendChild(movieDetails);

    movieResultsContainer.appendChild(movieCard);
  });
}