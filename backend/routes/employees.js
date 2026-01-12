import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(asyncHandler(getEmployees))
  .post(asyncHandler(createEmployee));

router.route('/:id')
  .get(asyncHandler(getEmployee))
  .put(asyncHandler(updateEmployee))
  .delete(asyncHandler(deleteEmployee));

export default router;
