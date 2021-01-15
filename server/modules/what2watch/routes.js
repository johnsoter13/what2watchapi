import { Router } from 'express';
import * as What2WatchController from './controller';

const routes = new Router();

routes.post('/meetups', What2WatchController.createWhat2Watch);
routes.get('/meetups', What2WatchController.getAllWhat2Watches);

export default routes;
