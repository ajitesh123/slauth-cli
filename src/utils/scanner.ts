import { OpenAIModels } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../types/scanner-strategy';

export default class Scanner {
  private strategy: ScannerStrategy;

  constructor(strategy: ScannerStrategy) {
    this.strategy = strategy;
  }

  public async scan(
    codeSnippets: string[],
    modelName?: keyof typeof OpenAIModels
  ) {
    try {
      // existing scan logic
    } catch (error) {
      console.error(`Scanning error: ${error.message}`);
      // Implement retry logic or return a default/fallback result
    }
  ) {
    return await this.strategy.scan(codeSnippets, modelName);
  }
}
