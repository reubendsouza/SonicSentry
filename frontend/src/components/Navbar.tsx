import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/SonicSentry.png" alt="Sonic Sentry Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">AI Smart Contract Auditor</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/contracts" className="text-gray-600 hover:text-gray-900">Contracts</Link>
            <Link to="/custom-audit" className="text-gray-600 hover:text-gray-900">Audit Your Code</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;