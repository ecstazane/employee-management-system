import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/EmployeeForm.css';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    dateOfJoining: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      const employee = response.data.data;
      
      // Format date for input field
      const formattedDate = employee.dateOfJoining 
        ? new Date(employee.dateOfJoining).toISOString().split('T')[0]
        : '';

      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        department: employee.department,
        salary: employee.salary || '',
        dateOfJoining: formattedDate
      });
    } catch (error) {
      setError('Failed to fetch employee details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Validate first name and last name
    if (formData.firstName.trim().length === 0) {
      setError('First name is required');
      return false;
    }
    if (formData.firstName.length > 50) {
      setError('First name must be less than 50 characters');
      return false;
    }

    if (formData.lastName.trim().length === 0) {
      setError('Last name is required');
      return false;
    }
    if (formData.lastName.length > 50) {
      setError('Last name must be less than 50 characters');
      return false;
    }

    // Validate email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address');
      return false;
    }

    // Validate phone if provided
    if (formData.phone && formData.phone.length > 20) {
      setError('Phone number is too long');
      return false;
    }

    // Validate position
    if (formData.position.trim().length === 0) {
      setError('Position is required');
      return false;
    }
    if (formData.position.length > 100) {
      setError('Position must be less than 100 characters');
      return false;
    }

    // Validate department
    if (formData.department.trim().length === 0) {
      setError('Department is required');
      return false;
    }
    if (formData.department.length > 100) {
      setError('Department must be less than 100 characters');
      return false;
    }

    // Validate salary
    if (formData.salary) {
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary < 0) {
        setError('Salary must be a valid positive number');
        return false;
      }
      if (salary > 10000000) {
        setError('Salary cannot exceed $10,000,000');
        return false;
      }
    }

    // Validate date of joining
    if (formData.dateOfJoining) {
      const joiningDate = new Date(formData.dateOfJoining);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (joiningDate > today) {
        setError('Date of joining cannot be in the future');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await axios.put(`/api/employees/${id}`, formData);
      } else {
        await axios.post('/api/employees', formData);
      }
      navigate('/employees');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save employee');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Enter position"
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Enter department"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                max="10000000"
                step="0.01"
                placeholder="Enter salary (max: $10,000,000)"
              />
            </div>

            <div className="form-group">
              <label>Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
