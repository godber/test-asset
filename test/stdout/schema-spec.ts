import 'jest-extended';
import { WorkerTestHarness } from 'teraslice-test-harness';
import { AnyObject } from '@terascope/job-components';
import { StdoutConfig } from '../../asset/src/stdout/interfaces';

describe('stdout schema', () => {
    let harness: WorkerTestHarness;
    const name = 'stdout';

    async function makeSchema(config: AnyObject = {}): Promise<StdoutConfig> {
        const opConfig = Object.assign({}, { _op: name }, config);
        harness = WorkerTestHarness.testProcessor(opConfig);

        await harness.initialize();

        const validConfig = harness.executionContext.config.operations.find(
            (testConfig) => testConfig._op === name
        );

        return validConfig as StdoutConfig;
    }

    afterEach(async () => {
        if (harness) await harness.shutdown();
    });

    it('should expect to be properly configured', async () => {
        await expect(makeSchema({ limit: { some: 'stuff' } })).toReject();
        await expect(makeSchema({ limit: 'hello' })).toReject();
        await expect(makeSchema({ field: 12 })).not.toReject();
    });
});
