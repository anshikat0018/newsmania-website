// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../api/interceptor';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      {/* Header */}
      <div className="max-w-md w-full text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-[#242424]">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Sign in to continue to NewsMania</p>
      </div>

      {/* Form */}
      <form className="max-w-[380px] w-full space-y-5" onSubmit={handleSubmit}>
        
        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={`w-full border-2 rounded-lg py-3 pl-11 pr-4 text-sm outline-none transition ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:border-black bg-white'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full border-2 rounded-lg py-3 pl-11 pr-11 text-sm outline-none transition ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:border-black bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right pt-2">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-all mt-6"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-12 text-sm text-center">
        <span className="text-gray-500">Don't have an account? </span>
        <Link to="/sign-up" className="text-blue-600 font-semibold hover:underline">
          Sign Up
        </Link>
      </div>

      <p className="mt-12 max-w-[380px] text-center text-xs text-gray-400 leading-relaxed">
        By signing in, you agree to NewsMania's Terms of Service and acknowledge that NewsMania's Privacy Policy applies to you.
      </p>
    </div>
  );
};

export default Login;