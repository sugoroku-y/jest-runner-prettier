import { readFile } from 'fs/promises';
import chalk from 'chalk';
import { diffLinesRaw, DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT } from 'jest-diff';
import { resolveConfig, check, format } from 'prettier';
import { optional } from '../utils/optional.js';
import { safeAccess } from '../utils/safeAccess.js';
import { TestResultFactory } from './TestResultFactory.js';
export async function runPrettierTest(testPath, rootDir, runnerConfig) {
    const { config, diff: { thresholdForOmitting }, } = runnerConfig;
    const threshold = typeof thresholdForOmitting === 'number' ? thresholdForOmitting : Infinity;
    const contents = await readFile(testPath, 'utf8');
    const prettierConfig = (await resolveConfig(testPath, { config })) ?? {};
    prettierConfig.filepath = testPath;
    const factory = new TestResultFactory(testPath, rootDir);
    const isPretty = await check(contents, prettierConfig);
    if (isPretty) {
        return factory.pass();
    }
    const formatted = await format(contents, prettierConfig);
    const errorMessages = prettierModification(testPath, formatted, contents, runnerConfig);
    const errorMessage = [
        ...limitMessage(errorMessages, threshold, `...Too many modifications to show all.`),
    ].join('\n');
    return factory.fail(errorMessage);
}
function* limitMessage(messages, limit, limitAfterMessage) {
    let count = 0;
    for (const message of messages) {
        if (count >= limit) {
            if (limitAfterMessage)
                yield limitAfterMessage;
            break;
        }
        yield message;
        count += 1;
    }
}
function prettierModification(testPath, formatted, contents, { diff: { expand, contextLines } }) {
    const diffs = classifyToBlocks(formatted, contents);
    return expand
        ? displayExpandedBlocks(diffs, testPath)
        : displayCollapsedBlocks(diffs, testPath, contextLines);
}
function* classifyToKeepBlock(context, text, lineNo) {
    if (context.current?.type !== 'keep') {
        if (context.current) {
            yield context.current;
        }
        context.current = {
            type: 'keep',
            startLineNo: lineNo,
            endLineNo: lineNo,
            lines: [],
        };
    }
    context.current.lines.push(text);
    context.current.endLineNo = lineNo;
}
function* classifyToModifiedBlock(context, text, lineNo, op) {
    if (context.current?.type !== 'modified') {
        if (context.current) {
            yield context.current;
        }
        context.current = {
            type: 'modified',
            startLineNo: lineNo,
            endLineNo: lineNo,
            actualLines: [],
            expectedLines: [],
        };
    }
    if (op === DIFF_INSERT) {
        context.current.actualLines.push(text);
    }
    else {
        context.current.expectedLines.push(text);
    }
    context.current.endLineNo = lineNo;
}
export function* classifyToBlocks(a, b) {
    const aa = a.split('\n');
    const bb = b.split('\n');
    const context = {};
    let lineItr = 0;
    for (const { 0: op, 1: text } of diffLinesRaw(aa, bb)) {
        const lineNo = op === DIFF_DELETE ? lineItr + 1 : (lineItr += 1);
        if (op === DIFF_EQUAL) {
            yield* classifyToKeepBlock(context, text, lineNo);
        }
        else {
            yield* classifyToModifiedBlock(context, text, lineNo, op);
        }
    }
    if (context.current) {
        yield context.current;
    }
}
const LINENO_WIDTH = 7;
const LINENO_SPACING = ' '.repeat(LINENO_WIDTH);
const actualColor = chalk.red;
const expectedColor = chalk.green;
const underline = chalk.underline;
const dim = chalk.dim;
const actualIndicator = actualColor('!!');
const expectedIndicator = expectedColor('=>');
function head(lineNo, options) {
    return ` ${lineNo
        ? // suffixが指定されていれば左寄せ
            optional(safeAccess(options, 'suffix'))?.((suffix) => `${lineNo}${suffix}`.padEnd(LINENO_WIDTH)) ??
                // prefixが指定されている、もしくはsuffix/prefix無しなら左寄せ
                `${safeAccess(options, 'prefix') ?? ''}${lineNo}`.padStart(LINENO_WIDTH)
        : LINENO_SPACING} |`;
}
function* displayKeepBlock(block, context, contextLines) {
    const [start, end] = !contextLines
        ? [block.startLineNo, block.endLineNo]
        : contextLines > 0
            ? [
                block.startLineNo,
                Math.min(block.startLineNo + contextLines - 1, block.endLineNo),
            ]
            : [
                Math.max((context?.lastEqualLineNo ?? 0) + 1, block.endLineNo + contextLines + 1),
                block.endLineNo,
            ];
    for (let lineNo = start; lineNo <= end; lineNo += 1) {
        yield `${head(lineNo)}    ${dim(block.lines[lineNo - block.startLineNo])}`;
        if (context) {
            context.lastEqualLineNo = lineNo;
        }
    }
}
function* displayModifiedBlock(block) {
    const headingLineNo = block.startLineNo === block.endLineNo
        ? [[block.startLineNo]]
        : [
            [block.startLineNo, { suffix: '-' }],
            [block.endLineNo, { prefix: '-' }],
        ];
    let headingItr = 0;
    for (const text of block.actualLines) {
        yield `${head(...(headingLineNo[headingItr++] ?? []))} ${actualIndicator} ${actualColor(text)}`;
    }
    for (const text of block.expectedLines) {
        yield `${head(...(headingLineNo[headingItr++] ?? []))} ${expectedIndicator} ${expectedColor(text)}`;
    }
}
function* displayExpandedBlocks(blocks, path) {
    yield underline(path);
    for (const block of blocks) {
        yield* block.type === 'keep'
            ? displayKeepBlock(block)
            : displayModifiedBlock(block);
    }
}
function* displayCollapsedKeepBlock(block, context) {
    if (context.prevDiff) {
        for (const line of displayKeepBlock(block, context, context.contextLines)) {
            yield line;
        }
    }
    context.prevEqualBlock = block;
    context.prevDiff = false;
}
function* displayCollapsedModifiedBlock(block, context) {
    if (!context.prevEqualBlock ||
        !context.lastEqualLineNo ||
        context.lastEqualLineNo <
            context.prevEqualBlock.endLineNo - context.contextLines) {
        // 異なる文字が見つかる列
        const column = block.expectedLines.length > 0 && block.actualLines.length > 0
            ? Array(Math.max(block.expectedLines[0].length, block.actualLines[0].length)).findIndex((_, i) => block.expectedLines[0].charCodeAt(i) !==
                block.actualLines[0].charCodeAt(i))
            : -1;
        yield `${underline(`${context.path}:${block.startLineNo}:${Math.max(column, 0) + 1}`)}`;
    }
    if (context.prevEqualBlock) {
        yield* displayKeepBlock(context.prevEqualBlock, context, -context.contextLines);
    }
    yield* displayModifiedBlock(block);
    context.prevDiff = true;
}
function* displayCollapsedBlocks(blocks, path, contextLines) {
    const context = { contextLines, path };
    for (const block of blocks) {
        if (block.type === 'keep') {
            yield* displayCollapsedKeepBlock(block, context);
        }
        else {
            yield* displayCollapsedModifiedBlock(block, context);
        }
    }
}
//# sourceMappingURL=runPrettierTest.js.map