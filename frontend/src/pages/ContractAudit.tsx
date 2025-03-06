import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ContractAuditView from "../components/ContractAuditView";
import axios from "axios";

// Add this type definition
interface ContractDetails {
  name?: string;
  sourceCode?: string;
  vulnerabilities?: { type: string; description: string; severity: string; line: number }[];
  contract?: {
    riskScore: number;
  };
}

function ContractAudit() {
  const { contractId } = useParams();
  const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/verified-smart-contracts/${contractId}`);
        setContractDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Failed to load contract details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  // Extract contract code from the details or use a placeholder
  const contractCode = contractDetails?.sourceCode || "// No contract code available";

  if (loading) return <div>Loading contract details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <ContractAuditView
      title={contractDetails?.name || "Contract Audit Details"}
      description={`Viewing audit details for contract ${contractId}`}
      initialCode={contractCode}
      initialResults={
        contractDetails?.vulnerabilities && contractDetails?.contract?.riskScore
          ? {
              vulnerabilities: contractDetails.vulnerabilities,
              riskScore: contractDetails.contract.riskScore
            }
          : undefined
      }
    />
  );
}

export default ContractAudit;