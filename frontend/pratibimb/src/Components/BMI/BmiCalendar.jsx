import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { BACKEND_URL } from '../../../constants.js';

const BmiCalendar = () => {
  const [bmiList, setBmiList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch BMI data
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

  // Group BMI entries by date
  const bmiByDate = bmiList.reduce((acc, bmi) => {
    const date = new Date(bmi.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(bmi);
    return acc;
  }, {});

  // Calculate daily averages
  const calculateDailyAverages = (entries) => {
    if (!entries || entries.length === 0) return null;
    
    const totalBmi = entries.reduce((sum, entry) => sum + entry.bmi, 0);
    const totalHeight = entries.reduce((sum, entry) => sum + entry.height, 0);
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    
    return {
      bmi: totalBmi / entries.length,
      height: totalHeight / entries.length,
      weight: totalWeight / entries.length
    };
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toLocaleDateString();
      const bmiEntries = bmiByDate[date] || [];
      const dailyAverage = calculateDailyAverages(bmiEntries);
      
      days.push(
        <div key={day} className="h-32 p-2 border border-gray-200 overflow-y-auto">
          <div className="font-bold text-gray-700">{day}</div>
          
          {/* Daily Average in teal box */}
          {dailyAverage && (
            <div className="mt-1 p-1 bg-teal-100 rounded text-xs border border-teal-200">
              <div className="font-semibold text-teal-800">Daily Average:</div>
              <div className="text-teal-700">BMI: {dailyAverage.bmi.toFixed(1)}</div>
              <div className="text-teal-700">H: {dailyAverage.height.toFixed(1)}cm, W: {dailyAverage.weight.toFixed(1)}kg</div>
            </div>
          )}
          
          {/* Individual entries */}
          {bmiEntries.length > 0 ? (
            bmiEntries.map((bmi, index) => (
              <div key={index} className="mt-1 p-1 bg-blue-100 rounded text-xs">
                <div className="font-semibold">BMI: {bmi.bmi.toFixed(1)}</div>
                <div>H: {bmi.height}cm, W: {bmi.weight}kg</div>
                <div className="text-gray-500 text-xs">
                  {new Date(bmi.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-xs mt-2">No BMI data</div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar size={20} />
          BMI Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading BMI data...</div>
        </div>
      ) : (
        <>
          {/* Calendar header with day names */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium py-1 bg-gray-100">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar body */}
          <div className="grid grid-cols-7 gap-1 h-96 overflow-y-auto">
            {generateCalendarDays()}
          </div>
        </>
      )}
    </div>
  );
};

export default BmiCalendar;