import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { registerOrganizer } from '../../redux/user/organizer';
import {
  User,
  Mail,
  Lock,
  Phone,
  Zap,
  Eye,
  EyeOff,
  Building
} from 'lucide-react';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const { loading = false, error = null } = useSelector((state) => state.organizer || {});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { name, email, password, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Add console logs to debug the request
    console.log("Submitting registration data:", formData);

    dispatch(registerOrganizer(formData)).unwrap()
      .then((response) => {
        console.log("Registration successful:", response);
        toast.success("Registration successful");
        navigate('/organizer/login');
        // Handle successful registration (e.g., redirect, show success message)
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        toast.error(err.message || "Registration failed");
      });
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

      {/* Registration Container */}
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-black border-2 border-cyan-500 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <Zap className="h-12 w-12 text-cyan-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-500 tracking-tight">REGISTER AS ORGANIZER</h2>
              <p className="text-cyan-300/70 mt-2 tracking-wider">CREATE NEW CREDENTIALS</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="ENTER NAME"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-cyan-500/30 text-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 uppercase tracking-wider placeholder-cyan-500/50"
                />
              </div>

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

              {/* Organization Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization || ""}
                  onChange={onChange}
                  placeholder="ENTER ORGANIZATION NAME"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-cyan-500/30 text-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 uppercase tracking-wider placeholder-cyan-500/50"
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
                  minLength="8"
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

              {/* Phone Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  placeholder="ENTER PHONE (OPTIONAL)"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-cyan-500/30 text-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 uppercase tracking-wider placeholder-cyan-500/50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-black py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 uppercase font-bold tracking-wider group hover:cursor-pointer hover:bg-black hover:text-cyan-500 hover:shadow-lg hover:border-cyan-500 hover:border"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>REGISTER</span>
                    <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-cyan-300/70 uppercase tracking-wider">
                  ALREADY HAVE CREDENTIALS? {' '}
                  <Link
                    to="/organizer/login"
                    className="text-cyan-500 hover:text-cyan-300 font-bold transition-colors"
                  >
                    LOGIN
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

export default Register;