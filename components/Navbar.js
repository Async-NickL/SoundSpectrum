'use client'
import React from 'react';
import Shinytext from './Shinytext';


const Navbar = () => {
  return (
    <nav className="h-16 w-full backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="h-full flex items-center justify-center">
        <div className="text-white relative p-10 font-bold">
          <Shinytext text="SoundSpectrum" disabled={false} speed={3} className='text-4xl font-bold' />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 

