import express from 'express';
import dbConfig from './config/db';
import middlewareConfig from './config/middleware';
import { What2WatchRoutes } from './modules';

const app = express();

// Database
dbConfig();

// Middleware
middlewareConfig(app);

app.use('/api', [What2WatchRoutes]);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  {
    console.log(`App listen to port: ${PORT}`);
  }
});
