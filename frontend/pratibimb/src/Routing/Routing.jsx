import React, {useContext} from 'react'
import {Routes, Route, Router, Navigate} from 'react-router-dom'
import Home from '../Components/Home/Home'
import ReportAnalyzer from '../Components/ReportAnalyzer/ReportAnalyzer'
import Login from '../Components/Auth/Login'
import Signup from '../Components/Auth/Signup'
import Bmi from '../Components/BMI/Bmi'
import BmiCalendar from '../Components/BMI/BmiCalendar'
import { AuthProvider, AuthContext } from '../Components/Auth/AuthProvider'

const Routing = () => {
  
  return (
    <AuthProvider>
    <Routes>
      <Route path='/login' element={<GuestRoute><Login/></GuestRoute>}/>
      <Route path='/signup' element={<GuestRoute><Signup/></GuestRoute>}/>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path='/home' element={<PrivateRoute><Home/></PrivateRoute>}/>
      <Route path='/bmi' element={<PrivateRoute><Bmi/></PrivateRoute>}/>
      <Route path='/bmicalendar' element={<PrivateRoute><BmiCalendar/></PrivateRoute>}/>
      
      <Route path='/reports' element={<PrivateRoute><ReportAnalyzer/></PrivateRoute>}/>
    </Routes>
    </AuthProvider>
  )
}
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isLoggedIn ? children : <Navigate to="/home" />;
}


export default Routing