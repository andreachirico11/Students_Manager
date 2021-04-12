import { Router } from 'express';
import { deleteReceipt, postReceipt, putReceipt } from './controllers/receiptController';
import {
  deleteStudent,
  getAllStudents,
  getStudent,
  postStudent,
  putStudent,
} from './controllers/studentController';
import { getUser, postUser } from './controllers/userController';
const router = Router();

router.post('/user/signup', postUser);
router.post('/user/login', getUser);
router.put('/students/:id', putStudent);
router.delete('/students/:id', deleteStudent);
router.post('/students', postStudent);
router.get('/students/:id', getStudent);
router.get('/students', getAllStudents);

router.post('/receipts/:studentId', postReceipt);
router.put('/receipts/:receiptId', putReceipt);
router.delete('/receipts/:id', deleteReceipt);

export { router };
