import { expect } from 'chai';
import sinon from 'sinon';
import scanCommand from '../../src/commands/scan';
import * as readDirectory from '../../src/utils/read-directory';
import * as isGitRepository from '../../src/utils/is-git-repository';
import Scanner from '../../src/utils/scanner';

describe('scan command', () => {
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should handle AWS cloud provider', async () => {
    const mockPath = '/path/to/repo';
    const mockCloudProvider = 'aws';
    const mockOpenAIModel = 'gpt-3.5-turbo';
    const mockCodeSnippets = ['AWS SDK code snippet'];
    const mockResult = [{ policy: 'AWS policy' }];

    sinon.stub(isGitRepository, 'default').returns(true);
    sinon.stub(readDirectory, 'default').resolves(mockCodeSnippets.map(snippet => ({ pageContent: snippet })));
    sinon.stub(Scanner.prototype, 'scan').resolves(mockResult);

    await scanCommand.parseAsync(['node', 'test', 'scan', '-p', mockCloudProvider, '-m', mockOpenAIModel, mockPath]);

    expect(consoleLogStub.calledWith(sinon.match('Detected Policies:'))).to.be.true;
    expect(consoleLogStub.calledWith(sinon.match(JSON.stringify(mockResult, null, 2)))).to.be.true;
  });

  it('should handle GCP cloud provider', async () => {
    const mockPath = '/path/to/repo';
    const mockCloudProvider = 'gcp';
    const mockOpenAIModel = 'gpt-3.5-turbo';
    const mockCodeSnippets = ['GCP SDK code snippet'];
    const mockResult = [{ customRole: 'GCP custom role' }];

    sinon.stub(isGitRepository, 'default').returns(true);
    sinon.stub(readDirectory, 'default').resolves(mockCodeSnippets.map(snippet => ({ pageContent: snippet })));
    sinon.stub(Scanner.prototype, 'scan').resolves(mockResult);

    await scanCommand.parseAsync(['node', 'test', 'scan', '-p', mockCloudProvider, '-m', mockOpenAIModel, mockPath]);

    expect(consoleLogStub.calledWith(sinon.match('Detected Custom Roles:'))).to.be.true;
    expect(consoleLogStub.calledWith(sinon.match(JSON.stringify(mockResult, null, 2)))).to.be.true;
  });

  it('should handle Azure cloud provider', async () => {
    const mockPath = '/path/to/repo';
    const mockCloudProvider = 'azure';
    const mockOpenAIModel = 'gpt-3.5-turbo';
    const mockCodeSnippets = ['Azure SDK code snippet'];
    const mockResult = [{ roleAssignment: 'Azure role assignment' }];

    sinon.stub(isGitRepository, 'default').returns(true);
    sinon.stub(readDirectory, 'default').resolves(mockCodeSnippets.map(snippet => ({ pageContent: snippet })));
    sinon.stub(Scanner.prototype, 'scan').resolves(mockResult);

    await scanCommand.parseAsync(['node', 'test', 'scan', '-p', mockCloudProvider, '-m', mockOpenAIModel, mockPath]);

    expect(consoleLogStub.calledWith(sinon.match('Detected Role Assignments:'))).to.be.true;
    expect(consoleLogStub.calledWith(sinon.match(JSON.stringify(mockResult, null, 2)))).to.be.true;
  });

  // ... other existing tests ...
});
