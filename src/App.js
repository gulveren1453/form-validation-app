import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isValidDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    // Trim'lenmiş değerleri kontrol et
    const trimmed = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      dateOfBirth: formData.dateOfBirth.trim(),
    };

    // FirstName 
    if (!trimmed.firstName) newErrors.firstName = 'First name is required';

    // LastName 
    if (!trimmed.lastName) newErrors.lastName = 'Last name is required';
    
    // Email
    if (!trimmed.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmed.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password
    if (!trimmed.password) {
      newErrors.password = 'Password is required';
    } else if (trimmed.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(trimmed.password)) {
      newErrors.password = 'Password must contain at least one letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    // Confirm Password
    if (!trimmed.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (trimmed.password !== trimmed.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }    
    
    // Date Of Birth
    if (!trimmed.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!dateRegex.test(trimmed.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date format must be dd/mm/yyyy';
    } else {
      const [day, month, year] = trimmed.dateOfBirth.split('/').map(Number);

      if (month < 1 || month > 12) {
        newErrors.dateOfBirth = 'Month must be between 1 and 12';
      } else if (day < 1 || day > 31) {
        newErrors.dateOfBirth = 'Day must be between 1 and 31';
      } else if (month === 2 && day > 29) {
        newErrors.dateOfBirth = 'February cannot have more than 29 days';
      } else if (!isValidDate(trimmed.dateOfBirth)) {
        newErrors.dateOfBirth = 'Invalid date';
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="app">
      <h1>Create New Account</h1>
      {isSubmitted ? (
        <div className="success-message">
          <h2>Account created successfully!</h2>
          <p>Welcome, {formData.firstName}!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="account-form">

          {/* FirstName  */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          {/* LastName  */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          {/* Email  */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='example@example.com'
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password  */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth (dd/mm/yyyy)</label>
            <input
              type="text"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>

          {/* Confirm Password  */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-btn">SUBMIT</button>
        </form>
      )}
    </div>
  );
}

export default App;
