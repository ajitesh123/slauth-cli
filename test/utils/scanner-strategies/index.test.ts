import { expect } from 'chai';
import ScannerStrategies from '../../../src/utils/scanner-strategies';
import GCPScanner from '../../../src/utils/scanner-strategies/gcp';
import AWSScanner from '../../../src/utils/scanner-strategies/aws';
import AzureScanner from '../../../src/utils/scanner-strategies/azure';

describe('ScannerStrategies', () => {
  it('should have the correct scanner strategies', () => {
    expect(ScannerStrategies.gcp).to.be.instanceOf(GCPScanner);
    expect(ScannerStrategies.aws).to.be.instanceOf(AWSScanner);
    expect(ScannerStrategies.azure).to.be.instanceOf(AzureScanner);
  });

  it('should have the correct number of scanner strategies', () => {
    expect(Object.keys(ScannerStrategies)).to.have.lengthOf(3);
  });
});
