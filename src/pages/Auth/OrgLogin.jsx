/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginOrganizer, fixNullValues, checkOrganizerProfileCompletion } from '../../redux/user/organizer';
import { Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { fixPersistenceIssues } from '../../utils/persistFix';

const OrgLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, profileComplete } = useSelector((state) => state.organizer || {});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // For local error handling

  const { email, password } = formData;

  // Fix persistence issues on mount
  useEffect(() => {
    // Clean up any "null" string issues before login
    fixPersistenceIssues();
    dispatch(fixNullValues());
  }, [dispatch]);

  // Handle redirection after authentication based on profile completion
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkOrganizerProfileCompletion())
        .then((result) => {
          if (result.payload && result.payload.profileComplete) {
            navigate('/organizer/dashboard');
          } else {
            navigate('/organizer/details');
          }
        });
    }
  }, [isAuthenticated, dispatch, navigate]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Clear error on input change
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMsg(''); // Clear any previous errors

    try {
      const resultAction = await dispatch(loginOrganizer(formData));

      if (loginOrganizer.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        // The redirection will be handled by the useEffect above
      } else if (loginOrganizer.rejected.match(resultAction)) {
        // Handle the error from the rejected action
        const errorMessage = resultAction.payload || 'Login failed';
        setErrorMsg(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      // Handle any uncaught errors
      console.error("Login error:", err);

      // Format the error message based on its type
      const errorMessage = typeof err === 'object' && err.message
        ? err.message
        : 'An unexpected error occurred';

      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Existing background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/10 opacity-20"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(6, 255, 252, 0.04) 25%, rgba(6, 255, 252, 0.04) 26%, transparent 27%, transparent 74%, rgba(6, 255, 252, 0.04) 75%, rgba(6, 255, 252, 0.04) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 255, 252, 0.04) 25%, rgba(6, 255, 252, 0.04) 26%, transparent 27%, transparent 74%, rgba(6, 255, 252, 0.04) 75%, rgba(6, 255, 252, 0.04) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Login Container */}
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-black border-2 border-cyan-500 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <Zap className="h-12 w-12 text-cyan-500 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold text-cyan-500 tracking-tight">Welcome Back</h2>
              <p className="text-cyan-300/70 mt-2 tracking-wider">SECURE AUTHENTICATION REQUIRED</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="ENTER EMAIL"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-cyan-500/30 text-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300  tracking-wider placeholder-cyan-500/50"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="ENTER PASSWORD"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-black border border-cyan-500/30 text-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300  tracking-wider placeholder-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-cyan-500 hover:text-cyan-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-cyan-500 hover:text-cyan-300 transition-colors" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {(errorMsg || error) && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center uppercase tracking-wider">
                  {errorMsg || error}
                </div>
              )}

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-black py-3 rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center space-x-2 uppercase font-bold tracking-wider group hover:cursor-pointer hover:shadow-lg hover:border-cyan-500 hover:border hover:text-cyan-500"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  </>
                )}
              </button>

              {/* Sign Up */}
              <div className="text-center mt-4">
                <p className="text-sm text-cyan-300/70 uppercase tracking-wider">
                  NO ACCESS? {' '}
                  <Link
                    to="/organizer/register"
                    className="text-cyan-500 hover:text-cyan-300 font-bold transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgLogin;