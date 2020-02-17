import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveriesFromDeliveryManController from './app/controllers/DeliveriesFromDeliveryManController';

import authMiddleware from './app/middlewares/authMiddleware';
import checkAdminMiddleware from './app/middlewares/checkAdminMiddleware';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get(
  '/deliveryman/:id/deliveries',
  DeliveriesFromDeliveryManController.store
);

routes.use(checkAdminMiddleware);

routes.post('/deliverymans', DeliveryManController.store);
routes.put('/deliverymans/:id', DeliveryManController.update);
routes.get('/deliverymans', DeliveryManController.index);
routes.get('/deliverymans/:id', DeliveryManController.show);
routes.delete('/deliverymans/:id', DeliveryManController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.delete('/deliveries/:id', DeliveryController.delete);

export default routes;
