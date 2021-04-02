import { Router } from 'express';
import { getAllStudents, getStudent, postStudent } from './controllers/studentController';
import { getUser, postUser } from './controllers/userController';
const router = Router();

router.post('/user/signup', postUser);
router.post('/user/login', getUser);
router.post('/students', postStudent);
router.get('/students/:id', getStudent);
router.get('/students', getAllStudents);

export { router };
