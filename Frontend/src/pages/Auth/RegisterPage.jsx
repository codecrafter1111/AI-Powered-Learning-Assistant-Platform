import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success("Registration successful! Please login");
      navigate('/login');
    } catch (err) {
      setError(err.message || "Failed to register. Please try again");
      toast.error(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Start your AI-powered learning experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username Input */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                USERNAME
              </label>
              <div className={`relative transition-all ${
                focusedField === 'username' 
                  ? 'ring-2 ring-emerald-500 rounded-xl' 
                  : ''
              }`}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                  <User className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    focusedField === 'username' 
                      ? 'text-emerald-500' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="codecrafter"
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                EMAIL
              </label>
              <div className={`relative transition-all ${
                focusedField === 'email' 
                  ? 'ring-2 ring-emerald-500 rounded-xl' 
                  : ''
              }`}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                  <Mail className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    focusedField === 'email' 
                      ? 'text-emerald-500' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="codecrafter123@gmail.com"
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                PASSWORD
              </label>
              <div className={`relative transition-all ${
                focusedField === 'password' 
                  ? 'ring-2 ring-emerald-500 rounded-xl' 
                  : ''
              }`}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                  <Lock className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    focusedField === 'password' 
                      ? 'text-emerald-500' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 sm:py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Login 
              </Link>
            </p>
          </div>
        </div>

        {/* Terms & Privacy */}
        <div className="mt-4 sm:mt-6 text-center px-4">
          <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Terms
            </a>
            {' '}&{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;