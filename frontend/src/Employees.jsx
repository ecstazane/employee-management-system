import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import './styles/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleRowClick = (employee, e) => {
    // Don't open modal if clicking on action buttons
    if (e.target.closest('.action-buttons')) {
      return;
    }
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Layout>
      <div className="employees-container">
        <div className="page-header">
          <h2>Employees</h2>
          <button
            className="btn-primary"
            onClick={() => navigate('/employees/add')}
          >
            + Add Employee
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {employees.length === 0 ? (
          <div className="empty-state">
            <h3>No employees found</h3>
            <p>Click "Add Employee" to create your first employee record</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr 
                    key={employee._id}
                    className="clickable-row"
                    onClick={(e) => handleRowClick(employee, e)}
                  >
                    <td>{`${employee.firstName} ${employee.lastName}`}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone || 'N/A'}</td>
                    <td>{employee.position}</td>
                    <td>{employee.department}</td>
                    <td>₱{employee.salary?.toLocaleString() || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/employees/edit/${employee._id}`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedEmployee && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Employee Details</h2>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">
                    {`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedEmployee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedEmployee.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Position:</span>
                  <span className="detail-value">{selectedEmployee.position}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedEmployee.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">
                    {selectedEmployee.salary 
                      ? `₱${selectedEmployee.salary.toLocaleString()}` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date of Joining:</span>
                  <span className="detail-value">
                    {formatDate(selectedEmployee.dateOfJoining)}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-primary"
                  onClick={() => {
                    closeModal();
                    navigate(`/employees/edit/${selectedEmployee._id}`);
                  }}
                >
                  Edit Employee
                </button>
                <button className="btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
