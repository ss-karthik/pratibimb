import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { BACKEND_URL } from '../../../constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleLogIn = async (e)=>{
      e.preventDefault();
      try{
          const response = await fetch(`${BACKEND_URL}/login`, {
              method: 'POST',
              body: JSON.stringify({email, password}),
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
          })
          const data = await response.json();
          console.log(data);
          if(data.errors){
              setEmailError(data.errors.email);
              setPasswordError(data.errors.password);
          }
          if(data.user) {
              location.assign('/home');
          }
      } catch(err){
          console.log('Signup failed: ', err);
      }
  }
  return (
    <div className='flex flex-col gap-10 justify-center items-center p-4'>
        <h1>LOG IN</h1>
        <form onSubmit={handleLogIn}> 
                <div>Email</div>
                <input
                    type="text"
                    name="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='border border-black'
                />
                <div className='email-error text-red-500'>{emailError}</div>
                <div>Password</div>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='border border-black'
                />
                <div className='password-error text-red-500'>{passwordError}</div>
                <button type="submit" className='text-xl border border-black rounded-md my-2 p-1 cursor-pointer'>
                    Log In
                </button>
            </form>
        <div>Don't have an account? <Link to='/signup'>Sign Up</Link></div>
    </div>
  )
}

export default Login