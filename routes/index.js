import { Router } from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const routes = Router();

routes.get('/status', AppController.getStatus);
routes.get('/stats', AppController.getStats);
routes.post('/users', UsersController.postNew);
routes.get('/connect', AuthController.getConnect);
routes.get('/disconnect', AuthController.getDisconnect);
routes.get('/users/me', UsersController.getMe);
routes.post('/files', FilesController.postUpload);
routes.get('/files/:id', FilesController.getShow);
routes.get('/files', FilesController.getIndex);

export default routes;