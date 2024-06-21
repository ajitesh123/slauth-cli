import { ScannerStrategy } from '../../types/scanner-strategy';
import { Services } from '../services';
import { showAsyncSpinner, spinners, yellow } from '../cli-utils';

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
          'Generating roles (this process might take a few minutes)'
        ),
      },
      rolesPromise
    );

    return await rolesPromise;
  }
}

export default AzureScanner;
