import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import { Vulnerability, AuditResult } from './types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuditService {
  constructor(private readonly httpService: HttpService) {}

  async analyze(
    codeInput: string | { sources: Record<string, { content: string }> },
  ): Promise<AuditResult> {
    // Handle both string input (single file) and object input (multiple files)
    if (typeof codeInput === 'string') {
      return this.analyzeSingleFile(codeInput);
    } else {
      return this.analyzeMultipleFiles(codeInput.sources);
    }
  }

  private async analyzeSingleFile(code: string): Promise<AuditResult> {
    if (!code || code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }

    try {
      const vulnerabilities = await this.analyzeWithAI(code);

      return {
        vulnerabilities,
        riskScore: this.calculateRiskScore(vulnerabilities),
      };
    } catch (error) {
      throw new Error(`Audit failed: ${error?.message}`);
    }
  }

  private async analyzeMultipleFiles(
    sources: Record<string, { content: string }>,
  ): Promise<AuditResult> {
    try {
      // Combine all files into a single string with file separators
      let combinedCode = '';
      const fileLineOffsets: Record<string, number> = {};
      let currentLineCount = 0;

      for (const [filePath, { content }] of Object.entries(sources)) {
        fileLineOffsets[filePath] = currentLineCount;
        combinedCode += `// FILE: ${filePath}\n${content}\n\n`;
        // Update line count (+1 for the FILE comment, +1 for the trailing newlines)
        currentLineCount += content.split('\n').length + 2;
      }

      const vulnerabilities = await this.analyzeWithAI(combinedCode);

      // Map vulnerabilities back to their original files
      const mappedVulnerabilities = vulnerabilities.map((vuln) => {
        const fileEntry = Object.entries(fileLineOffsets).find(
          ([_, offset], index, arr) => {
            const nextOffset =
              index < arr.length - 1 ? arr[index + 1][1] : currentLineCount;
            return vuln.line >= offset && vuln.line < nextOffset;
          },
        );

        if (fileEntry) {
          const [filePath, offset] = fileEntry;
          return {
            ...vuln,
            filePath,
            // Adjust line number to be relative to the file
            line: vuln.line - offset - 1, // -1 to account for the FILE comment
          };
        }

        return vuln;
      });

      return {
        vulnerabilities: mappedVulnerabilities,
        riskScore: this.calculateRiskScore(mappedVulnerabilities),
      };
    } catch (error) {
      throw new Error(`Audit failed: ${error?.message}`);
    }
  }

  private async analyzeWithAI(code: string): Promise<Vulnerability[]> {
    try {
      // DeepSeek API endpoint
      const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

      // Prepare the prompt for the AI
      const prompt = `
You are a smart contract security auditor. Analyze the following Solidity code for security vulnerabilities:

\`\`\`solidity
${code}
\`\`\`

Identify any security issues and vulnerabilities. For each vulnerability found, provide:
1. The type of vulnerability
2. A clear description of the issue
3. The severity (High, Medium, or Low)
4. The line number where the vulnerability occurs

Format your response as a JSON array of objects with the following structure:
[
  {
    "type": "vulnerability type",
    "description": "detailed description",
    "severity": "High/Medium/Low",
    "line": line_number
  }
]

If no vulnerabilities are found, return an empty array.
`;

      // Make API request to DeepSeek
      const response = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: 'qwen/qwen2.5-vl-72b-instruct:free',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            },
          },
        ),
      );

      // Extract the AI's response
      const aiResponse = response.data.choices[0].message.content;

      // Parse the JSON response from the AI
      try {
        // First try to parse the entire response as JSON
        return JSON.parse(aiResponse);
      } catch (error) {
        // If that fails, try to extract JSON array from the response
        const jsonMatch = aiResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch (jsonError) {
            console.error('Failed to parse extracted JSON:', jsonError);
            return [];
          }
        }
        
        // If no JSON array found, return empty array
        console.warn('No valid JSON found in AI response');
        return [];
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`Failed to analyze with AI: ${error.message}`);
    }
  }

  public deleteFolderRecursive(folderPath: string) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Recursive call
          this.deleteFolderRecursive(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }

  private calculateRiskScore(vulnerabilities: Vulnerability[]): number {
    if (vulnerabilities.length === 0) return 0;

    const severityWeights = {
      High: 10,
      Medium: 5,
      Low: 1,
    };

    const totalScore = vulnerabilities.reduce((score, vuln) => {
      return score + (severityWeights[vuln.severity] || 0);
    }, 0);

    // Normalize the score to a range of 0-100
    return Math.min(totalScore, 100);
  }
}
