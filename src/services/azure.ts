import { OpenAIModels } from '../types/openai-models';
import { callLLM } from '../utils/llm';

async function getPermissionsFromCode(
  code: string,
  modelName: keyof typeof OpenAIModels
): Promise<string[]> {
  const prompt = `Given the following Azure SDK code, list all the Azure permissions required:

${code}

Return the list of permissions, one per line.`;

  const response = await callLLM(prompt, modelName);
  return response.split('\n').filter(line => line.trim() !== '');
}

async function getRolesFromPermissions(
  permissions: string[],
  modelName: keyof typeof OpenAIModels
): Promise<string[]> {
  const prompt = `Given the following Azure permissions, suggest appropriate Azure roles:

${permissions.join('\n')}

Return a list of Azure roles, one per line, that would encompass these permissions.`;

  const response = await callLLM(prompt, modelName);
  return response.split('\n').filter(line => line.trim() !== '');
}

export default {
  getPermissionsFromCode,
  getRolesFromPermissions,
};
