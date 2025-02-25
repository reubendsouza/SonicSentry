import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ContractsList from './pages/ContractsList';
import ContractAudit from './pages/ContractAudit';
import CustomContractAudit from './pages/CustomContractAudit';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contracts" element={<ContractsList />} />
          <Route path="/audit/:contractId" element={<ContractAudit />} />
          <Route path="/custom-audit" element={<CustomContractAudit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;