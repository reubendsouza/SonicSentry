import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, CheckCircle, Zap, Code2 } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Smart Contract Security
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Automatically audit smart contracts on the Sonic blockchain with advanced AI technology.
          Detect vulnerabilities and ensure your contracts are secure.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/contracts"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg 
                     font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Verified Contracts
          </Link>
          <Link
            to="/custom-audit"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg 
                     font-medium hover:bg-blue-50 transition-colors shadow-sm border border-blue-200"
          >
            Audit Your Code
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <Shield className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Automated Auditing</h3>
          <p className="text-gray-600">
            Our AI system automatically scans and analyzes smart contracts for potential vulnerabilities.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <Search className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Deep Analysis</h3>
          <p className="text-gray-600">
            Comprehensive security analysis covering common vulnerabilities and edge cases.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <Zap className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
          <p className="text-gray-600">
            Get instant feedback on your smart contract's security status and risk assessment.
          </p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
          <Shield className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Browse Verified Contracts
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our database of audited and verified smart contracts on the Sonic blockchain.
            Learn from secure implementations and best practices.
          </p>
          <Link
            to="/contracts"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg 
                     font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Contracts
          </Link>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
          <Code2 className="w-12 h-12 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Audit Your Code
          </h2>
          <p className="text-gray-600 mb-6">
            Get instant security analysis for your smart contract code. Our AI will identify potential
            vulnerabilities and provide detailed recommendations.
          </p>
          <Link
            to="/custom-audit"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg 
                     font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Start Audit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;