import React, {useState, useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import { BACKEND_URL } from '../../../constants';

const Home = () => {
  const [user, setUser] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [bmiList, setBmiList] = useState([]);

  useEffect(()=>{
    async function fetchUserData(){
    try{
      const response = await fetch(`${BACKEND_URL}/user`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
      })
      const data = await response.json();
      console.log(data);
      if(data.autherr){
          location.assign('/login');
      }
      if(data._id) {
          setUser(data.email);
          setDeviceId(data.deviceId);
          fetchBmiData();
      }
    } catch(err){
        console.log(err);
    }
    }
    async function fetchBmiData() {
      try {
        const response = await fetch(`${BACKEND_URL}/bmi`, { // Changed endpoint
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Important for cookies
        });
        const data = await response.json();
        setBmiList(data);
      } catch (err) {
        console.error('Error fetching BMI data:', err);
      }
    }

    
    fetchUserData();
  }, [])

  const handleLogout = async ()=> {
      try{
        const response = await fetch(`${BACKEND_URL}/logout`, {
            method: 'GET',
            //body: JSON.stringify({email, password}),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        const data = await response.json();
        console.log(data);
        location.assign('/login');
    } catch(err){
        console.log(err);
    }
  }
  return (
    <>
    <h1>Pratibimb</h1>
    
    <h1>User: {user}</h1>
    <h1>Device: {deviceId}</h1>
    <button onClick={handleLogout} className='text-xl border border-black rounded-md my-2 p-1 cursor-pointer'>
      Log Out
    </button>
    <h2>BMI History</h2>
      <ul>
        {bmiList.map((bmi) => (
          <li key={bmi._id}>
            Height: {bmi.height}, Weight: {bmi.weight}, BMI: {bmi.bmi}, Date: {new Date(bmi.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Home