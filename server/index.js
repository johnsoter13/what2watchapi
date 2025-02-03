import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'

import middlewareConfig from './config/middleware'
import {
  IMDB_HEADERS,
  STREAMING_AVAILABILITY_HEADERS,
  GOOGLE_AUTH_HEADERS,
} from './config/headerConstants'
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const server = createServer(app) // Create an HTTP server to use with WebSocket

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
const LOGIN_URL = 'https://oauth2.googleapis.com/tokeninfo'

// Database
// dbConfig();

// Middleware
middlewareConfig(app)

// app.use('/api', [What2WatchRoutes]);
// Proxy endpoints
app.use(
  '/login',
  createProxyMiddleware({
    target: LOGIN_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/login`]: '',
    },
    headers: GOOGLE_AUTH_HEADERS,
  })
)

app.use(
  '/fetchGenres',
  createProxyMiddleware({
    target: FETCH_GENRE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/fetchGenres`]: '',
    },
    headers: STREAMING_AVAILABILITY_HEADERS,
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
    headers: STREAMING_AVAILABILITY_HEADERS,
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
    headers: STREAMING_AVAILABILITY_HEADERS,
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
    headers: STREAMING_AVAILABILITY_HEADERS,
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

// Create a WebSocket server
const wss = new WebSocketServer({ server })

// A map to keep track of clients in each room
const rooms = {}

wss.on('connection', (ws) => {
  let currentRoomId = null

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message)
    const { type, roomId, movieId, userName, liked } = parsedMessage

    switch (type) {
      case 'join':
        currentRoomId = roomId
        if (!rooms[roomId]) {
          rooms[roomId] = new Set()
        }
        rooms[roomId].add(ws)
        ws.send(
          JSON.stringify({
            message: `${userName} Joined room ${roomId}`,
            roomSize: rooms[currentRoomId].size,
          })
        )
        break
      case 'message':
        if (currentRoomId && rooms[currentRoomId]) {
          rooms[currentRoomId].forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(
                JSON.stringify({
                  userName,
                  roomId: currentRoomId,
                  movieId,
                  roomSize: rooms[currentRoomId].size,
                  liked,
                })
              )
            }
          })
        }
        break
      case 'leave':
        rooms[roomId].delete(ws)
        if (rooms[roomId].size === 0) {
          delete rooms[currentRoomId]
        }
        currentRoomId = null
        ws.send(JSON.stringify({ message: `${userName} Left room ${roomId}` }))
        break
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }))
    }
  })

  ws.on('close', () => {
    if (currentRoomId && rooms[currentRoomId]) {
      rooms[currentRoomId].delete(ws)
      if (rooms[currentRoomId].size === 0) {
        delete rooms[currentRoomId]
      }
    }
  })
})

server.listen(PORT, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`App listening on port: ${PORT}`)
  }
})
