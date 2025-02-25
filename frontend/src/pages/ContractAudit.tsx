import React from "react";
import { useParams } from "react-router-dom";
import ContractAuditView from "../components/ContractAuditView";

function ContractAudit() {
  const { contractId } = useParams();

  // In a real app, you would fetch the contract code using the contractId
  const mockContractCode = "// Contract code would be loaded here based on contractId";

  return (
    <ContractAuditView
      title="Contract Audit Details"
      description={`Viewing audit details for contract ${contractId}`}
      initialCode={mockContractCode}
    />
  );
}

export default ContractAudit;