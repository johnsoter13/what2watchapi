import express from 'express'
import middlewareConfig from './config/middleware'
import { IMDB_HEADERS, UTELLY_HEADERS } from './config/headerConstants'
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const FETCH_GENRE_URL = 'https://imdb236.p.rapidapi.com/imdb/genres'
const FETCH_DETAILS_URL = 'https://imdb236.p.rapidapi.com/imdb'
const FETCH_BY_STREAMING_SERVICES =
  'https://utelly-tv-shows-and-availability-v1.p.rapidapi.com/idlookup'
const FETCH_MEDIA_FROM_SEARCH =
  'https://utelly-tv-shows-and-availability-v1.p.rapidapi.com/lookup'
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
    headers: IMDB_HEADERS,
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

// app.use(
//   '/fetcByGenre',
//   createProxyMiddleware({
//     target: FETCH_BY_GENRE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^/fetcByGenre`]: '',
//     },
//     headers: IMDB_HEADERS,
//   })
// )

app.use(
  '/fetchStreamingServices',
  createProxyMiddleware({
    target: FETCH_BY_STREAMING_SERVICES,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchStreamingServices`]: '',
    },
    headers: UTELLY_HEADERS,
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
    headers: UTELLY_HEADERS,
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
