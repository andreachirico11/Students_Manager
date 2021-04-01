import { Router } from 'express';
import { getUser, postUser } from './controllers/userController';
const router = Router();

router.post('/user/signup', postUser);
router.post('/user/login', getUser);

export { router };
