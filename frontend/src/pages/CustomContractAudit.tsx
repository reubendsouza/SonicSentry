import React from "react";
import ContractAuditView from "../components/ContractAuditView";

function CustomContractAudit() {
  return (
    <ContractAuditView
      title="Audit Your Smart Contract"
      description="Paste your Solidity smart contract code below for an instant security analysis."
    />
  );
}

export default CustomContractAudit;