import { expect } from 'chai';
import sinon from 'sinon';
import AzureScanner from '../../../src/utils/scanner-strategies/azure';
import { Services } from '@slauth.io/langchain-wrapper';

describe('AzureScanner', () => {
  let azureScanner: AzureScanner;

  beforeEach(() => {
    azureScanner = new AzureScanner();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should scan code snippets and return policies', async () => {
    const codeSnippets = ['Azure SDK code snippet'];
    const statements = ['Azure statement'];
    const policies = ['Azure policy'];

    sinon.stub(Services.azure, 'getStatementsFromCode').resolves(statements);
    sinon.stub(Services.azure, 'getPoliciesFromStatements').resolves(policies);

    const result = await azureScanner.scan(codeSnippets, 'gpt-3.5-turbo');

    expect(result).to.deep.equal(policies);
    expect(Services.azure.getStatementsFromCode).to.have.been.calledOnceWith(codeSnippets[0], 'gpt-3.5-turbo');
    expect(Services.azure.getPoliciesFromStatements).to.have.been.calledOnceWith(statements, 'gpt-3.5-turbo');
  });

  it('should handle empty code snippets', async () => {
    const codeSnippets: string[] = [];
    const result = await azureScanner.scan(codeSnippets, 'gpt-3.5-turbo');

    expect(result).to.deep.equal([]);
  });

  it('should handle errors in getStatementsFromCode', async () => {
    const codeSnippets = ['Azure SDK code snippet'];
    const error = new Error('Azure SDK error');

    sinon.stub(Services.azure, 'getStatementsFromCode').rejects(error);

    await expect(azureScanner.scan(codeSnippets, 'gpt-3.5-turbo')).to.be.rejectedWith(error);
  });

  it('should handle errors in getPoliciesFromStatements', async () => {
    const codeSnippets = ['Azure SDK code snippet'];
    const statements = ['Azure statement'];
    const error = new Error('Azure policy generation error');

    sinon.stub(Services.azure, 'getStatementsFromCode').resolves(statements);
    sinon.stub(Services.azure, 'getPoliciesFromStatements').rejects(error);

    await expect(azureScanner.scan(codeSnippets, 'gpt-3.5-turbo')).to.be.rejectedWith(error);
  });
});
