import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { AlertTriangle, CheckCircle, Code2, AlertCircle, File } from "lucide-react";

interface ContractAuditViewProps {
  initialCode?: string;
  title: string;
  description?: string;
  initialResults?: {
    vulnerabilities: { type: string; description: string; severity: string; line: number }[];
    riskScore: number;
  } | null;
}

function ContractAuditView({ initialCode = "", title, description, initialResults = null }: ContractAuditViewProps) {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<{
    vulnerabilities: { type: string; description: string; severity: string; line: number }[];
    riskScore: number;
  } | null>(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedFiles, setParsedFiles] = useState<{name: string, content: string}[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  useEffect(() => {
    // Try to parse the code as JSON to check if it contains multiple files
    try {
      const parsedCode = JSON.parse(initialCode);
      if (parsedCode.sources && typeof parsedCode.sources === 'object') {
        // Extract files from the sources object
        const files = Object.entries(parsedCode.sources).map(([path, fileObj]: [string, any]) => {
          // Handle both formats: when fileObj has content property or when it is the content itself
          const content = fileObj.content || 
                         (typeof fileObj === 'string' ? fileObj : JSON.stringify(fileObj, null, 2));
          return {
            name: path,
            content: content
          };
        });
        
        if (files.length > 0) {
          setParsedFiles(files);
          setCode(files[0].content);
          return;
        }
      }
    } catch (e) {
      // Not JSON or doesn't have the expected structure, use as a single file
      console.log("Failed to parse as JSON with sources:", e);
    }
    
    // If we couldn't parse multiple files, treat as a single file
    setParsedFiles([{ name: "Contract.sol", content: initialCode }]);
    setCode(initialCode);
  }, [initialCode]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please enter some Solidity code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/audit", { code });
      console.log(response.data);
      setResults(response.data.result);
    } catch (err) {
      setError("Failed to analyze the code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      {error && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Smart Contract Code</h2>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                         font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Code"
              )}
            </button>
          </div>

          {/* File tabs for multiple files */}
          {parsedFiles.length > 1 && (
            <div className="flex overflow-x-auto border-b border-gray-200 mb-2">
              {parsedFiles.map((file, index) => (
                <button
                  key={index}
                  className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap
                            ${selectedFileIndex === index 
                              ? 'border-b-2 border-blue-500 text-blue-600' 
                              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => {
                    setSelectedFileIndex(index);
                    setCode(parsedFiles[index].content);
                  }}
                >
                  <File className="w-4 h-4 mr-2" />
                  <span className="truncate max-w-xs">
                    {file.name.split('/').pop() || file.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Editor
              height="100%"
              defaultLanguage="sol"
              value={code}
              onChange={(value) => {
                setCode(value || "");
                // Update the content in parsedFiles array
                if (parsedFiles.length > 0) {
                  const updatedFiles = [...parsedFiles];
                  updatedFiles[selectedFileIndex] = {
                    ...updatedFiles[selectedFileIndex],
                    content: value || ""
                  };
                  setParsedFiles(updatedFiles);
                }
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: "on",
                folding: true,
                padding: { top: 16 },
              }}
            />
          </div>
          
          {parsedFiles.length > 1 && (
            <div className="text-sm text-gray-500">
              File {selectedFileIndex + 1} of {parsedFiles.length}: {parsedFiles[selectedFileIndex].name}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          </div>

          {results ? (
            <div className="space-y-6">
              {/* Risk Score Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h3>
                <div className="flex items-baseline">
                  <span className={`text-4xl font-bold ${getRiskScoreColor(results.riskScore)}`}>
                    {results.riskScore}
                  </span>
                  <span className="text-gray-500 ml-2">/100</span>
                </div>
              </div>

              {/* Vulnerabilities Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  {results.vulnerabilities.length > 0 ? 'Vulnerabilities Found' : 'Security Analysis'}
                </h3>

                {results.vulnerabilities.length > 0 ? (
                  <div className="space-y-4">
                    {results.vulnerabilities.map((vuln, index) => (
                      <div 
                        key={index}
                        className={`rounded-lg border p-4 space-y-3 ${getSeverityColor(vuln.severity)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                          <span className="text-sm text-gray-500">Line {vuln.line}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{vuln.type}</h4>
                        <p className="text-sm text-gray-600">{vuln.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>No vulnerabilities found in the code.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
              <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Submit your code to see the audit results</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ContractAuditView;