import express from 'express'
import middlewareConfig from './config/middleware'
import { IMDB_HEADERS, STREAMING_AVAILABILITY } from './config/headerConstants'
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const FETCH_GENRE_URL = 'https://streaming-availability.p.rapidapi.com/genres'
const FETCH_MOVIES_BY_GENRE_URL =
  'https://streaming-availability.p.rapidapi.com/shows/search/filters'
const FETCH_DETAILS_URL = 'https://imdb236.p.rapidapi.com/imdb'
const FETCH_MEDIA_FROM_SEARCH =
  'https://streaming-availability.p.rapidapi.com/shows/search/title'
const FETCH_MEDIA_FROM_MOVIE_ID =
  'https://streaming-availability.p.rapidapi.com/shows'
const FETCH_MOST_POPULAR =
  'https://imdb236.p.rapidapi.com/imdb/most-popular-movies'

// Database
// dbConfig();

// Middleware
middlewareConfig(app)

// app.use('/api', [What2WatchRoutes]);
// Proxy endpoints
app.use(
  '/fetchGenres',
  createProxyMiddleware({
    target: FETCH_GENRE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchGenres`]: '',
    },
    headers: STREAMING_AVAILABILITY,
  })
)

app.use(
  '/fetchMoviesByGenre',
  createProxyMiddleware({
    target: FETCH_MOVIES_BY_GENRE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchMoviesByGenre`]: '',
    },
    headers: STREAMING_AVAILABILITY,
  })
)

app.use(
  '/fetchDetails',
  createProxyMiddleware({
    target: FETCH_DETAILS_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchDetails`]: '',
    },
    headers: IMDB_HEADERS,
  })
)

app.use(
  '/fetchMediaFromMovieId',
  createProxyMiddleware({
    target: FETCH_MEDIA_FROM_MOVIE_ID,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchMediaFromMovieId`]: '',
    },
    headers: STREAMING_AVAILABILITY,
  })
)

app.use(
  '/fetchMediaFromSearch',
  createProxyMiddleware({
    target: FETCH_MEDIA_FROM_SEARCH,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchMediaFromSearch`]: '',
    },
    headers: STREAMING_AVAILABILITY,
  })
)

app.use(
  '/fetchMostPopular',
  createProxyMiddleware({
    target: FETCH_MOST_POPULAR,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchMostPopular`]: '',
    },
    headers: IMDB_HEADERS,
  })
)

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
  if (err) {
    console.error(err)
  }
  {
    console.log(`App listen to port: ${PORT}`)
  }
})
