import { OpenAIModels, Services } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../../types/scanner-strategy';
import showAsyncSpinner from '../show-async-spinner';
import spinners from 'cli-spinners';
import { yellow } from '../colors';

export default class AzureScanner implements ScannerStrategy {
  async scan(codeSnippets: string[], modelName: keyof typeof OpenAIModels) {
    const statementsPromises = Promise.all(
      codeSnippets.map(async snippet => {
        return await Services.azure.getStatementsFromCode(snippet, modelName);
      })
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Scanning for Azure SDK calls (this process might take a few minutes)'
        ),
      },
      statementsPromises
    );

    const statements = (await statementsPromises).flat();

    const policiesPromise = Services.azure.getPoliciesFromStatements(
      statements,
      modelName
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Generating policies (this process might take a few minutes)'
        ),
      },
      policiesPromise
    );

    return await policiesPromise;
  }
}
