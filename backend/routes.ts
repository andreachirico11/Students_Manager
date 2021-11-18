import { Router } from 'express';
import { deleteReceipt, postReceipt, putReceipt } from './controllers/receiptController';
import { getStats } from './controllers/statsController';
import {
  deleteStudent,
  getAllStudents,
  getStudent,
  postStudent,
  putStudent,
} from './controllers/studentController';
import { getUser, postUser } from './controllers/userController';
import { verifyToken } from './controllers/webTokenController';
const router = Router();

router.post('/user/signup', postUser);
router.post('/user/login', getUser);

router.put('/students/:id', verifyToken, putStudent);
router.delete('/students/:id', verifyToken, deleteStudent);
router.post('/students', verifyToken, postStudent);
router.get('/students/:id', verifyToken, getStudent);
router.get('/students', verifyToken, getAllStudents);

router.post('/receipts/:studentId', verifyToken, postReceipt);
router.put('/receipts/:receiptId', verifyToken, putReceipt);
router.delete('/receipts/:id', verifyToken, deleteReceipt);

router.get('/stats', verifyToken, getStats);

export { router };
