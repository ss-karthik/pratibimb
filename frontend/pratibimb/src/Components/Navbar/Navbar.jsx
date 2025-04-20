import { Clipboard, House, Ruler, MessageSquareText } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-teal-800 text-white p-4">
      <div className="container mx-auto flex justify-center items-center gap-10">
        <Link to='/home'><House/></Link>
        <Link to='/bmi'><Ruler/></Link>
        <Link to='/reports'><Clipboard/></Link>
        <Link to='/medchat'><MessageSquareText/></Link>
      </div>
    </nav>
  )
}

export default Navbar