// Import NPM Packages
const express = require('express');
const fetch = require('node-fetch'); 
const cors = require('cors');
const app = express();
const port = 3000;

// API Key and Authorization Token
const apiKey = 'd4cdfd4f2ca2291fa8a1ef4764848535'; 
const bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGNkZmQ0ZjJjYTIyOTFmYThhMWVmNDc2NDg0ODUzNSIsInN1YiI6IjY2NjcwMzQzMTBlMmRjMDdhMjFjMjcwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HlZedFmTJc-1HahNEPpmX3_CTs1e75a9slG9mrWLMnY';

// Function to fetch similar movies from TMDb
const getSimilarMovies = async (movieId) => {
  try {
    // Endpoint
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`;
    // Options
    const options = { 
      method: 'GET', 
      headers: { 
        accept: 'application/json',
        Authorization: `Bearer ${bearerToken}` // Include bearer token
      } 
    };
    //Response
    const response = await fetch(url, options);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
};

// Enables CORS for all routes
app.use(cors());

app.get('/search', async (req, res) => {
  // Retrieve title query parameter from the request
  const movieTitle = req.query.title;

  // GIve 400 staus code, if no title is provided
  if (!movieTitle) {
    return res.status(400).json({ error: 'Movie title is required' });
  }

  try {
    // Search for the movie by title
    const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${bearerToken}` // Include bearer token
      }
    });
    // parses JSON Data given from fetch request
    const searchData = await searchResponse.json();
    // Extracts the ID from the search response
    const movieId = searchData.results[0]?.id;

    // If movie ID is not found, 404 error
    if (!movieId) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Fetch similar movies using getSimilarMovies()
    const similarMovies = await getSimilarMovies(movieId);

    // Get basic details for each similar movie
    const similarMovieDetails = await Promise.all(
      similarMovies.map(async (movie) => {
        // URL for specific movie
        const movieData = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${bearerToken}` // Include bearer token
          }
        }).then(response => response.json());
        // Maps the info (title, image, overview and rating)
        return {
          title: movieData.title,
          poster_path: movieData.poster_path,
          overview: movieData.overview,
          vote_average: movieData.vote_average
        };
      })
    );

    res.json(similarMovieDetails);
  } catch (error) {
    console.error('Error searching for movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
