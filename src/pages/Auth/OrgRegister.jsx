import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaGoogle,
  FaTwitter
} from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useLoader } from '../../context/LoaderContext';

const Register = () => {
  const navigate = useNavigate();
  const { loading = false, error = null } = useSelector((state) => state.organizer || {});
  const { setIsLoading } = useLoader();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { name, email, password, phone } = formData;

  useEffect(() => {
    setIsLoading(loading || submitting);
    return () => setIsLoading(false);
  }, [loading, submitting, setIsLoading]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setSubmitting(false);
      return;
    }

    // Prepare data - only include phone if it has a value
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organization: formData.organization,
      ...(formData.phone && { phone: formData.phone }) // Only include phone if it has a value
    };

    console.log("Submitting registration data:", submitData);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await axios.post(`${apiUrl}/organizer/register`, submitData);

      console.log("Registration successful:", response.data);

      // Don't store token or redirect automatically since account needs approval
      toast.success("Registration successful! Your account is pending approval. You will be notified once verified.");
      setRegistered(true);

      setTimeout(() => {
        navigate('/organizer/login'); // Redirect to login instead of details
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err);

      // Improved error handling
      if (err.response) {
        const errorMessage = err.response?.data?.message || 'Registration failed';
        toast.error(errorMessage);
      } else if (err.request) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-xl shadow-xl overflow-hidden p-8"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <FaUser className="h-10 w-10 text-cyan-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">Registration Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your account has been created. Please complete your profile details to continue.
              </p>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">Redirecting to profile details...</p>
                <div className="w-full bg-gray-800 h-1 mt-2 rounded overflow-hidden">
                  <div className="bg-cyan-500 h-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-white">Organizer Registration</h1>
          <p className="mt-2 text-gray-400">Create your organizer account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-xl shadow-xl overflow-hidden"
        >
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="p-8">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={onChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={onChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-400">
                  Organization Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    required
                    value={formData.organization || ""}
                    onChange={onChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength="8"
                    value={password}
                    onChange={onChange}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500 hover:text-gray-400 focus:outline-none"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
                  Phone Number (Optional)
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={onChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-black font-medium cursor-pointer ${submitting
                    ? "bg-cyan-700 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-black hover:border hover:border-cyan-500 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register as Organizer"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <Link
                  to="/auth/google-signup"
                  className="flex justify-center py-4 px-4 border border-gray-700 rounded-full shadow-sm text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <FaGoogle size={18} />
                </Link>
                <Link
                  to="/auth/twitter-signup"
                  className="flex justify-center py-4 px-4 border border-gray-700 rounded-full shadow-sm text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  <FaTwitter size={18} />
                </Link>
              </div>

              <div className="mt-6">
                <Link
                  to="/auth/register"
                  className="w-full flex justify-center py-2 px-4 border border-cyan-700 rounded-md shadow-sm text-sm font-medium text-cyan-400 bg-gray-800 hover:bg-gray-700"
                >
                  Register as a regular user
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Already have an organizer account?{" "}
            <Link to="/auth/organizer-login" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;