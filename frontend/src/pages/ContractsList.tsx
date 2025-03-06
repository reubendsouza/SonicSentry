import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Interface for contract data
interface Contract {
  id: string;
  address: string;
  contractName: string;
  riskScore?: number;
  vulnerabilities?: number;
  timestamp?: string;
}

function getRiskScoreColor(score: number) {
  if (score >= 80) return 'text-red-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-green-600';
}

function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/verified-smart-contracts');
        
        // Transform the data to match our component needs
        const formattedContracts = response.data.map((contract: any, index: number) => ({
          id: contract.id || String(index + 1),
          address: contract.address,
          name: contract.contractName,
          riskScore: contract.riskScore || 0,
          timestamp: contract.createdAt || new Date().toISOString().split('T')[0],
          vulnerabilities: contract.vulnerabilities?.length || 0,
        }));
        
        setContracts(formattedContracts);
        setError(null);
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('Failed to load contracts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Audited Smart Contracts</h2>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading contracts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Name
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
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No contracts found
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <Shield className="w-5 h-5 text-blue-600 mr-2" /> */}
                        <div className="text-sm text-gray-500">{contract.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getRiskScoreColor(contract.riskScore || 0)}`}>
                          {contract.riskScore || 0}/100
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {!contract.vulnerabilities ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-500">
                            {!contract.vulnerabilities
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractsList;