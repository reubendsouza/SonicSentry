export interface Vulnerability {
  type: string;
  description: string;
  severity: string;
  line: number;
}

export interface AuditResult {
  vulnerabilities: Vulnerability[];
  riskScore: number;
} 