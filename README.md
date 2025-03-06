# Sonic Sentry - AI Smart Contract Auditor

## Overview
Sonic Sentry is a web application that helps developers analyze and audit Solidity smart contracts for security vulnerabilities on the Sonic blockchain. The platform provides automated security analysis to identify potential issues in smart contract code, making development on Sonic blockchain safer and more secure. Sonic blockchain is an EVM-compatible chain focused on high performance and low transaction costs.

## Features
- **Automated Smart Contract Auditing**: Analyze Solidity code for security vulnerabilities
- **Multi-file Support**: Upload and analyze projects with multiple Solidity files
- **Vulnerability Detection**: Identifies common security issues with severity ratings
- **Risk Scoring**: Provides an overall risk assessment score for contracts
- **Verified Contracts Library**: Browse and learn from previously verified smart contracts
- **User-friendly Interface**: Monaco code editor with syntax highlighting for Solidity

## Tech Stack
### Backend
- NestJS framework
- TypeORM for database interactions
- PostgreSQL database
- Scheduled tasks for periodic operations
- REST API endpoints

### Frontend
- React with TypeScript
- React Router for navigation
- Monaco Editor for code editing
- Tailwind CSS for styling
- Axios for API requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Environment Variables
Backend requires the following environment variables:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=smartcontractauditor
PORT=3000

### Installation

1. Clone the repository
git clone https://github.com/yourusername/ai-smart-contract-auditor.git
cd ai-smart-contract-auditor

2. Install dependencies
cd backend
npm install

3. Install frontend dependencies
cd frontend
npm install

### Running the Application

1. Start the backend server
cd backend
npm run start:dev

2. Start the frontend development server
cd frontend
npm run dev

The application will be available at http://localhost:5173

## API Endpoints

- `GET /` - Health check endpoint
- `POST /audit` - Submit smart contract code for analysis
- `GET /verified-smart-contracts` - Get list of verified smart contracts
- `GET /verified-smart-contracts/:id` - Get details of a specific verified contract

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
