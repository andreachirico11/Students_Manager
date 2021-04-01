import { Router } from 'express';
import { postUser } from './controllers/userController';
const router = Router();

router.post('/user/signup', postUser);

export { router };
