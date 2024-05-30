import { relative } from 'path';
import { type AssertionResult, createEmptyTestResult } from '@jest/test-result';

export class TestResultFactory {
    private readonly result = createEmptyTestResult();
    constructor(
        testPath: string,
        private readonly rootDir: string,
    ) {
        const start = Date.now();
        this.result.perfStats.start = start;
        this.result.testFilePath = testPath;
    }
    private addTestResult(data: Partial<AssertionResult>): void {
        this.result.testResults.push({
            ancestorTitles: [],
            failureDetails: [],
            failureMessages: [],
            fullName: '',
            numPassingAsserts: 0,
            status: 'todo',
            title: `prettier ${relative(this.rootDir, this.result.testFilePath)}`,
            ...data,
        });
    }
    private common() {
        const end = Date.now();
        const duration = end - this.result.perfStats.start;
        this.result.perfStats.end = end;
        this.result.perfStats.runtime = duration;
        for (const result of this.result.testResults) {
            result.duration = duration;
        }
        return this.result;
    }
    pass() {
        this.result.numPassingTests = 1;
        this.addTestResult({ numPassingAsserts: 1, status: 'passed' });
        return this.common();
    }
    fail(errorMessage: string) {
        this.result.failureMessage = errorMessage;
        this.result.numFailingTests = 1;
        this.addTestResult({
            failureMessages: [errorMessage],
            status: 'failed',
        });
        return this.common();
    }
}
