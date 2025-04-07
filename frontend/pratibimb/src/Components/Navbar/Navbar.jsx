import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-center items-center gap-10">
        <Link to='/home'>Home</Link>
        <Link to='/reports'>Reports</Link>
      </div>
    </nav>
  )
}

export default Navbar