import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Register from './Register';
import Employees from './Employees';
import EmployeeForm from './EmployeeForm';
import NotFound from './NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/employees" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
            <Route path="/employees/add" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
            <Route path="/employees/edit/:id" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
