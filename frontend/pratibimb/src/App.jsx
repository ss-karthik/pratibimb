import React, { useState } from 'react'
import Routing from './Routing/Routing'
import Navbar from './Components/Navbar/Navbar'

function App() {
  return (
    <div className='overflow-hidden'>
      <Navbar/>
      <Routing/>
    </div>
  )
}

export default App