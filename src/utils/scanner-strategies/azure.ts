import { ScannerStrategy } from '../../types/scanner-strategy';
import { OpenAIModels } from '../../types/openai-models';
import { Services } from '../../services';
import { showAsyncSpinner } from '../spinner';
import { spinners } from '../../constants';
import { yellow } from 'chalk';

class AzureScanner implements ScannerStrategy {
  async scan(codeSnippets: string[], modelName: keyof typeof OpenAIModels) {
    const permissionsPromise = Promise.all(
      codeSnippets.map(async snippet => {
        return await Services.azure.getPermissionsFromCode(snippet, modelName);
      })
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Scanning for Azure SDK calls (this process might take a few minutes)'
        ),
      },
      permissionsPromise
    );

    const permissions = (await permissionsPromise).flat();

    const rolesPromise = Services.azure.getRolesFromPermissions(
      permissions,
      modelName
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Generating Azure roles (this process might take a few minutes)'
        ),
      },
      rolesPromise
    );

    return await rolesPromise;
  }
}

export default AzureScanner;
