import Employee from '../models/Employee.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getEmployees = async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  sendSuccess(res, {
    count: employees.length,
    data: employees
  });
};

export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return sendError(res, 'Employee not found', 404);
  }
  sendSuccess(res, { data: employee });
};

export const createEmployee = async (req, res) => {
  req.body.createdBy = req.user.id;
  const employee = await Employee.create(req.body);
  sendSuccess(res, { data: employee }, 201);
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!employee) {
    return sendError(res, 'Employee not found', 404);
  }

  sendSuccess(res, { data: employee });
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return sendError(res, 'Employee not found', 404);
  }

  sendSuccess(res, { message: 'Employee deleted successfully' });
};
