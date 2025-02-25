import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data - replace with actual API call
const contracts = [
  {
    id: '1',
    name: 'TokenSwap Contract',
    address: '0x1234...5678',
    riskScore: 2,
    timestamp: '2024-02-20',
    vulnerabilities: 0,
  },
  {
    id: '2',
    name: 'Staking Pool',
    address: '0x8765...4321',
    riskScore: 7,
    timestamp: '2024-02-19',
    vulnerabilities: 3,
  },
  // Add more mock contracts as needed
];

function getRiskScoreColor(score: number) {
  if (score >= 8) return 'text-red-600';
  if (score >= 5) return 'text-orange-600';
  return 'text-green-600';
}

function ContractsList() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Audited Smart Contracts</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-blue-600 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRiskScoreColor(contract.riskScore)}`}>
                      {contract.riskScore}/10
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {contract.vulnerabilities === 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-500">
                        {contract.vulnerabilities === 0
                          ? 'Secure'
                          : `${contract.vulnerabilities} issues found`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/audit/${contract.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContractsList;