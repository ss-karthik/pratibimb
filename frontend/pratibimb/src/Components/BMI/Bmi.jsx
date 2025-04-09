import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Activity, TrendingUp } from 'lucide-react';
import { BACKEND_URL } from '../../../constants.js';
import { Link } from 'react-router-dom';
const Bmi = () => {
  const [bmiList, setBmiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    async function fetchBmiData() {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/bmi`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        setBmiList(data);
      } catch (err) {
        console.error('Error fetching BMI data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBmiData();
  }, []);

  const bmiByDate = bmiList.reduce((acc, bmi) => {
    const date = formatDateKey(new Date(bmi.createdAt));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(bmi);
    return acc;
  }, {});

  const navigateDays = (direction) => {
    const newDate = new Date(currentViewDate);
    newDate.setDate(currentViewDate.getDate() + (direction * 5));
    setCurrentViewDate(newDate);
  };

  const generateFiveDays = () => {
    const days = [];
    // For 5-day view starting with current day and going back 4 days
    const today = new Date();
    const startDay = new Date(currentViewDate);
    startDay.setDate(currentViewDate.getDate() - 4); // Start 4 days before current view date
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + i);
      const dayKey = formatDateKey(day);
      
      const hasBmiData = bmiByDate[dayKey] && bmiByDate[dayKey].length > 0;
      
      const isToday = today.toDateString() === day.toDateString();
      
      const isSelected = selectedDate.toDateString() === day.toDateString();

      days.push(
        <div 
          key={dayKey}
          onClick={() => setSelectedDate(day)}
          className={`flex flex-col items-center justify-center p-1 rounded-xl cursor-pointer min-w-12 md:min-w-16 transition-all duration-200 ${
            isSelected ? 'bg-teal-600 text-white shadow-md' : 
            isToday ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border hover:bg-gray-50'
          } ${hasBmiData ? 'ring-2 ring-amber-400' : ''}`}
        >
          <div className="text-xs font-medium opacity-80">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}
          </div>
          <div className="text-lg font-bold my-1">{day.getDate()}</div>
          <div className="text-xs">
            {day.toLocaleString('default', { month: 'short' })}
          </div>
          {hasBmiData && (
            <div className="mt-1 w-2 h-2 bg-amber-500 rounded-full"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const getSelectedDayBmiData = () => {
    const dayKey = formatDateKey(selectedDate);
    return bmiByDate[dayKey] || [];
  };

  const getDailyAverages = () => {
    const bmiData = getSelectedDayBmiData();
    
    if (bmiData.length === 0) return null;
    
    const totalBmi = bmiData.reduce((sum, record) => sum + record.bmi, 0);
    const totalHeight = bmiData.reduce((sum, record) => sum + record.height, 0);
    const totalWeight = bmiData.reduce((sum, record) => sum + record.weight, 0);
    
    return {
      avgBmi: totalBmi / bmiData.length,
      avgHeight: totalHeight / bmiData.length,
      avgWeight: totalWeight / bmiData.length,
      count: bmiData.length
    };
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600 bg-blue-50" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600 bg-green-50" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Obese", color: "text-red-600 bg-red-50" };
  };

  const averages = getDailyAverages();
  const bmiCategory = averages ? getBmiCategory(averages.avgBmi) : null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Activity size={20} className="text-teal-500" />
          BMI Tracker
        </h2>
        <div className="text-sm font-medium text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
          {currentViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        
      </div>

      <div className="flex items-center mb-4 p-2 rounded-xl">
        <button 
          onClick={() => navigateDays(-1)}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          aria-label="Previous 5 days"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex overflow-x-auto justify-center py-2 gap-2 flex-grow hide-scrollbar">
          {generateFiveDays()}
        </div>
        
        <button 
          onClick={() => navigateDays(1)}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          aria-label="Next 5 days"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4">
        <div className='flex flex-wrap justify-between'>
        <h3 className="text-md font-medium mb-4 bg-teal-50 text-teal-800 py-2 px-4 rounded-lg inline-block">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </h3>
        <Link to='/bmicalendar'>
        <h3 className="text-md cursor-pointer font-medium mb-4 bg-indigo-500 text-teal-50 py-2 px-4 rounded-lg inline-block">
          Detailed View
        </h3>
        </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {averages && (
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={20} />
                  <h4 className="font-bold">Daily Average ({averages.count} measurements)</h4>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{averages.avgBmi.toFixed(1)}</div>
                  <div className="bg-white text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bmiCategory.label}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
                    <span className="text-xs text-teal-100">Avg. Height</span>
                    <div className="font-bold mt-1">{averages.avgHeight.toFixed(1)} cm</div>
                  </div>
                  <div className="bg-teal-700 bg-opacity-20 p-3 rounded-lg">
                    <span className="text-xs text-teal-100">Avg. Weight</span>
                    <div className="font-bold mt-1">{averages.avgWeight.toFixed(1)} kg</div>
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-md font-medium mb-4 bg-teal-50 text-teal-800 py-2 px-4 rounded-lg inline-block">
              Today's Measurements
            </h3>
            <div className="space-y-4">
              {getSelectedDayBmiData().length > 0 ? (
                getSelectedDayBmiData().map((bmi, index) => {
                  const category = getBmiCategory(bmi.bmi);
                  return (
                    <div key={index} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="text-2xl font-bold text-gray-800">{bmi.bmi.toFixed(1)}</div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${category.color}`}>
                            {category.label}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(bmi.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Height</span>
                          <span className="font-bold text-gray-800">{bmi.height} cm</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Weight</span>
                          <span className="font-bold text-gray-800">{bmi.weight} kg</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Calendar size={32} className="text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-3">No BMI data for this date</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bmi;