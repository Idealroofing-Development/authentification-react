import React from 'react';
import backgroundImage from '../assets/house.jpg';

export default function WrapperBackGround({ children }) {
  return (
    <div
      className="h-max"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      {children}
    </div>
  );
}
