import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Unauthorized Access</h2>
        <p className="text-lg text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Link to="/">
          <div className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 focus:outline-none">Go Home</div>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

