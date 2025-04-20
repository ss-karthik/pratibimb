import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../constants';
import { User, Lock, Smartphone, Calendar, Cigarette, Beer, Users } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [alcoholic, setAlcoholic] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [deviceIdError, setDeviceIdError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setAgeError('');
    setDeviceIdError('');
    setGenderError('');
    
    try {
      const ageNumber = age ? parseInt(age, 10) : null;
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          deviceId, 
          age: ageNumber,
          gender,
          smoker, 
          alcoholic 
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      
      if (data.errors) {
        setEmailError(data.errors.email);
        setPasswordError(data.errors.password);
        setAgeError(data.errors.age);
        setDeviceIdError(data.errors.deviceId);
        setGenderError(data.errors.gender);
      }
      
      if (data.user) {
        location.assign('/home');
      }
    } catch (err) {
      console.log('Signup failed: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-teal-700 mb-8">Pratibimb</h1>
      
      {/* Signup Card */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
          <h2 className="text-xl font-bold text-white text-center">Create Account</h2>
          <p className="text-teal-100 text-center text-sm mt-1">Sign up to get started</p>
        </div>
        
        <form onSubmit={handleSignUp} className="p-6">
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          
          {/* Device ID Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Device ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                placeholder="Enter your device ID"
              />
            </div>
            {deviceIdError && <p className="mt-1 text-sm text-red-600">{deviceIdError}</p>}
          </div>
          
          {/* Age Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="1"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                placeholder="Your age"
              />
            </div>
            {ageError && <p className="mt-1 text-sm text-red-600">{ageError}</p>}
          </div>
          
          {/* Gender Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={18} className="text-gray-400" />
              </div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors appearance-none bg-white"
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefernottosay">Prefer not to say</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {genderError && <p className="mt-1 text-sm text-red-600">{genderError}</p>}
          </div>
          
          {/* Health Habits Section */}
          <div className="mb-6">
            <h3 className="text-gray-700 text-sm font-medium mb-3">Health Information</h3>
            
            {/* Smoker Toggle */}
            <div className="flex items-center justify-between mb-3 py-2 px-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Cigarette size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700">Are you a smoker?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smoker}
                  onChange={(e) => setSmoker(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            
            {/* Alcoholic Toggle */}
            <div className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Beer size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700">Do you consume alcohol?</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alcoholic}
                  onChange={(e) => setAlcoholic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
      
      {/* Login link */}
      <p className="mt-6 text-center text-gray-600">
        Already have an account? {' '}
        <Link to="/login" className="font-medium text-teal-600 hover:text-teal-800 transition-colors">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Signup;