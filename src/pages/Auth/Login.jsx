import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../redux/user/userSlice';
import { Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password } = formData;


  const onChange = e => {
    // If the field is password, trim whitespace
    const value = e.target.name === 'password' ? e.target.value.trim() : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Login attempt with email:", email);

      // Try direct login without the preliminary check
      const result = await dispatch(login(email, password));

      if (result.error) {
        setError(result.error);
        console.error('Login error from Redux action:', result.error);
      } else {
        console.log('Login successful, navigating to home');
        toast.success('Login successful');
        navigate('/');
      }
    } catch (error) {
      console.error("Login submission error:", error);
      setError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Cyber Grid Background Effect */}
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
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                >
                  FORGOT PASSWORD?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 text-black py-3 rounded-lg hover:bg-black transition-all duration-300 flex items-center justify-center space-x-2 uppercase font-bold tracking-wider group hover:cursor-pointer hover:shadow-lg hover:border-cyan-500 hover:border hover:text-cyan-500"
              >
                {isLoading ? (
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

              {/* Sign Up - Fixed HTML structure */}
              <div className="text-center">
                <p className="text-sm text-cyan-300/70 uppercase tracking-wider">
                  NO ACCESS? {' '}
                  <Link
                    to="/auth/register"
                    className="text-cyan-500 hover:text-cyan-300 font-bold transition-colors"
                  >
                    SIGN UP
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

export default Login;