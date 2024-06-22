import { OpenAIModels } from '@slauth.io/langchain-wrapper';

export interface ScanResult {
  snippet: string;
  result: any; // Define more specific type based on usage
}

export default interface ScannerStrategy {
  scan(
    codeSnippets: string[],
    modelName?: keyof typeof OpenAIModels
  ): Promise<ScanResult[] | undefined>;
}
