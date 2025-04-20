import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../../constants';
import { LogOut, User, Smartphone, Activity, Calendar, ClipboardCheck, Users, Cigarette, Beer, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [smoker, setSmoker] = useState(false);
  const [alcoholic, setAlcoholic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (data.autherr) {
          location.assign('/login');
        }
        if (data._id) {
          setUser(data.email);
          setDeviceId(data.deviceId);
          setAge(data.age);
          setGender(data.gender);
          setSmoker(data.smoker);
          setAlcoholic(data.alcoholic);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/logout`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      location.assign('/login');
    } catch (err) {
      console.log(err);
    }
  };

  // Helper function to format gender for display
  const formatGender = (gender) => {
    if (!gender) return "Not specified";
    
    if (gender === "prefernottosay") return "Prefer not to say";
    
    // Capitalize first letter
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 mb-30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-teal-700">Pratibimb</h1>
        <button 
          onClick={handleLogout} 
          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* User Info Card */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-200 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white rounded-full p-2 text-teal-600">
              <User size={24} />
            </div>
            <div>
              <div className="text-xs text-teal-100">Welcome</div>
              <div className="font-bold text-xl truncate max-w-xs">{user}</div>
            </div>
          </div>
          
          {/* Personal Details Section */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Age */}
            <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-teal-200" />
                <span className="text-xs text-teal-100">Age</span>
              </div>
              <div className="font-bold mt-1">{age || "Not specified"}</div>
            </div>
            
            {/* Gender */}
            <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-teal-200" />
                <span className="text-xs text-teal-100">Gender</span>
              </div>
              <div className="font-bold mt-1">{formatGender(gender)}</div>
            </div>
          </div>
          
          {/* Health Habits Section */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Smoker Status */}
            <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Cigarette size={16} className="text-teal-200" />
                <span className="text-xs text-teal-100">Smoking Status</span>
              </div>
              <div className="font-bold mt-1">{smoker ? "Smoker" : "Non-smoker"}</div>
            </div>
            
            {/* Alcohol Status */}
            <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Beer size={16} className="text-teal-200" />
                <span className="text-xs text-teal-100">Alcohol Status</span>
              </div>
              <div className="font-bold mt-1">{alcoholic ? "Consumes alcohol" : "Non-alcoholic"}</div>
            </div>
          </div>
          
          {/* Device ID */}
          <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg mt-3">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-teal-200" />
              <span className="text-xs text-teal-100">Connected Device</span>
            </div>
            <div className="font-bold mt-1 truncate">{deviceId || "No device connected"}</div>
          </div>
        </div>
      )}

      {/* Quick Access Sections */}
      <h2 className="text-md font-medium mb-4 bg-teal-50 text-teal-800 py-2 px-4 rounded-lg inline-block">
        Quick Access
      </h2>
      
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <Link to="/bmi" className="no-underline">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-100 rounded-full p-3 mb-3">
              <Activity size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-800">BMI Tracker</h3>
            <p className="text-xs text-gray-500 mt-1">Monitor your progress</p>
          </div>
        </Link>

        <Link to="/reports" className="no-underline">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 rounded-full p-3 mb-3">
              <ClipboardCheck size={24} className="text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">Report Analysis</h3>
            <p className="text-xs text-gray-500 mt-1">AI Powered Health Analysis</p>
          </div>
        </Link>
        
        <Link to="/bmicalendar" className="no-underline">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <div className="bg-amber-100 rounded-full p-3 mb-3">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <h3 className="font-medium text-gray-800">Calendar</h3>
            <p className="text-xs text-gray-500 mt-1">Detailed history view</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;