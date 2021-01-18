import express from 'express';
import dbConfig from './config/db';
import middlewareConfig from './config/middleware';
import { What2WatchRoutes } from './modules';
import {IMDB_HEADERS, UTELLY_HEADERS} from './config/headerConstants'
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const FETCH_MOVIES_GENRE_URL = "https://imdb8.p.rapidapi.com/title/list-popular-genres";
const FETCH_MOVIE_DETAILS_URL = "https://imdb8.p.rapidapi.com/title/get-overview-details";
const FETCH_MOVIES_BY_GENRE_URL = "https://imdb8.p.rapidapi.com/title/get-popular-movies-by-genre";
const FETCH_MOVIES_BY_STREAMING_SERVICES = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup"
const FETCH_MOVIES_FROM_SEARCH = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup"


// Database
// dbConfig();

// Middleware
middlewareConfig(app);

// app.use('/api', [What2WatchRoutes]);
// Proxy endpoints
app.use('/fetchMovieGenres', createProxyMiddleware({
  target: FETCH_MOVIES_GENRE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/fetchMovieGenres`]: '',
  },
    headers: IMDB_HEADERS,
}));

app.use('/fetchMovieDetails', createProxyMiddleware({
  target: FETCH_MOVIE_DETAILS_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/fetchMovieDetails`]: '',
  },
    headers: IMDB_HEADERS,
}));

app.use('/fetchMoviesByGenre', createProxyMiddleware({
  target: FETCH_MOVIES_BY_GENRE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/fetchMoviesByGenre`]: '',
  },
    headers: IMDB_HEADERS,
}));

app.use('/fetchMovieStreamingServices', createProxyMiddleware({
  target: FETCH_MOVIES_BY_STREAMING_SERVICES,
  changeOrigin: true,
  pathRewrite: {
      [`^/fetchMovieStreamingServices`]: '',
  },
    headers: UTELLY_HEADERS,
}));

app.use('/fetchMovieFromSearch', createProxyMiddleware({
  target: FETCH_MOVIES_FROM_SEARCH,
  changeOrigin: true,
  pathRewrite: {
      [`^/fetchMovieFromSearch`]: '',
  },
    headers: UTELLY_HEADERS,
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  {
    console.log(`App listen to port: ${PORT}`);
  }
});
