import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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
import { useLoader } from '../../context/LoaderContext';

const Register = () => {
  const dispatch = useDispatch();
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

    console.log("Submitting registration data:", formData);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await axios.post(`${apiUrl}/organizer/register`, formData);

      console.log("Registration successful:", response.data);

      if (response.data.token) {
        localStorage.setItem('organizer_token', response.data.token);
      }

      dispatch({
        type: 'organizer/setToken',
        payload: response.data.token
      });

      dispatch({
        type: 'organizer/setUser',
        payload: response.data.user || response.data
      });

      toast.success("Registration successful! Please complete your profile details.");
      setRegistered(true);

      setTimeout(() => {
        navigate('/organizer/details');
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
        <div className="w-full max-w-md z-10 relative">
          <div className="bg-black border-2 border-cyan-500 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-cyan-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-cyan-500 tracking-tight mb-2">REGISTRATION SUCCESSFUL</h2>
              <p className="text-cyan-300/70 mt-2 tracking-wider mb-6">
                Your account has been created. Please complete your profile details to continue.
              </p>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">Redirecting to profile details...</p>
                <div className="w-full bg-gray-800 h-1 mt-2 rounded overflow-hidden">
                  <div className="bg-cyan-500 h-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/10 opacity-20"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(6, 255, 252, 0.04) 25%, rgba(6, 255, 252, 0.04) 26%, transparent 27%, transparent 74%, rgba(6, 255, 252, 0.04) 75%, rgba(6, 255, 252, 0.04) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 255, 252, 0.04) 25%, rgba(6, 255, 252, 0.04) 26%, transparent 27%, transparent 74%, rgba(6, 255, 252, 0.04) 75%, rgba(6, 255, 252, 0.04) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-black border-2 border-cyan-500 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <Zap className="h-12 w-12 text-cyan-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-500 tracking-tight">REGISTER AS ORGANIZER</h2>
              <p className="text-cyan-300/70 mt-2 tracking-wider">CREATE NEW CREDENTIALS</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
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

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-500 text-black py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 uppercase font-bold tracking-wider group hover:cursor-pointer hover:bg-black hover:text-cyan-500 hover:shadow-lg hover:border-cyan-500 hover:border"
              >
                {submitting ? (
                  <>
                    <span>REGISTERING...</span>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  </>
                ) : (
                  <>
                    <span>REGISTER</span>
                    <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-cyan-300/70 uppercase tracking-wider">
                  ALREADY HAVE CREDENTIALS? {' '}
                  <Link
                    to="/auth/organizer-login"
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