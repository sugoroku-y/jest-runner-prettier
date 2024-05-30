import { ensureConfig } from '../../src/utils/ensureConfig';

describe('ensureConfig', () => {
    describe('simple', () => {
        const EXPECTED = {
            'undefined:true': true,
            'undefined:false': false,
            'undefined:123': 123,
            'undefined:"abc"': 'abc',
            'undefined:[123]': [123],
            'undefined:["abc"]': ['abc'],
            'undefined:{"x":"abc","y":123}': { x: 'abc', y: 123 },
            'null:true': true,
            'null:false': false,
            'null:123': 123,
            'null:"abc"': 'abc',
            'null:[123]': [123],
            'null:["abc"]': ['abc'],
            'null:{"x":"abc","y":123}': { x: 'abc', y: 123 },
            'true:true': true,
            'true:false': true,
            'true:123': true,
            'true:"abc"': true,
            'true:[123]': true,
            'true:["abc"]': true,
            'true:{"x":"abc","y":123}': true,
            'false:true': false,
            'false:false': false,
            'false:123': false,
            'false:"abc"': false,
            'false:[123]': false,
            'false:["abc"]': false,
            'false:{"x":"abc","y":123}': false,
            '123:true': 123,
            '123:false': 123,
            '123:123': 123,
            '123:"abc"': 123,
            '123:[123]': 123,
            '123:["abc"]': 123,
            '123:{"x":"abc","y":123}': 123,
            '"abc":true': 'abc',
            '"abc":false': 'abc',
            '"abc":123': 'abc',
            '"abc":"abc"': 'abc',
            '"abc":[123]': 'abc',
            '"abc":["abc"]': 'abc',
            '"abc":{"x":"abc","y":123}': 'abc',
            '[123]:true': [123],
            '[123]:false': [123],
            '[123]:123': [123],
            '[123]:"abc"': [123],
            '[123]:[123]': [123],
            '[123]:["abc"]': [123],
            '[123]:{"x":"abc","y":123}': [123],
            '["abc"]:true': ['abc'],
            '["abc"]:false': ['abc'],
            '["abc"]:123': ['abc'],
            '["abc"]:"abc"': ['abc'],
            '["abc"]:[123]': ['abc'],
            '["abc"]:["abc"]': ['abc'],
            '["abc"]:{"x":"abc","y":123}': ['abc'],
            '{"x":"abc","y":123}:true': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:false': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:123': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:"abc"': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:[123]': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:["abc"]': { x: 'abc', y: 123 },
            '{"x":"abc","y":123}:{"x":"abc","y":123}': { x: 'abc', y: 123 },
        };
        describe.each`
            loaded
            ${undefined}
            ${null}
            ${true}
            ${false}
            ${123}
            ${'abc'}
            ${[123]}
            ${['abc']}
            ${{ x: 'abc', y: 123 }}
        `('loaded: $loaded', ({ loaded }) => {
            test.each`
                defaults
                ${true}
                ${false}
                ${123}
                ${'abc'}
                ${[123]}
                ${['abc']}
                ${{ x: 'abc', y: 123 }}
            `('defaults: $defaults', ({ defaults }) => {
                const key = `${JSON.stringify(loaded)}:${JSON.stringify(defaults)}`;
                const expected = EXPECTED[key as keyof typeof EXPECTED];
                expect(ensureConfig(loaded, defaults)).toEqual(expected);
            });
        });
    });
    describe('recursive', () => {
        test.each`
            loaded          | defaults                  | expected
            ${{ x: 'abc' }} | ${{ x: 'bcd', y: 123 }}   | ${{ x: 'abc', y: 123 }}
            ${{ x: null }}  | ${{ x: 'bcd', y: 123 }}   | ${{ x: 'bcd', y: 123 }}
            ${{ x: 123 }}   | ${{ x: ['bcd'], y: 123 }} | ${{ x: 123, y: 123 }}
        `(
            'loaded: $loaded defaults: $defaults',
            ({ loaded, defaults, expected }) => {
                expect(ensureConfig(loaded, defaults)).toEqual(expected);
            },
        );
    });
    describe('error', () => {
        test('defaults: function', () => {
            expect(() => ensureConfig(0, () => {})).toThrow(
                new Error(
                    'No functions or nullish values can be specified for `defaults`.',
                ),
            );
        });
        test('defaults: undefined', () => {
            expect(() => ensureConfig(0, undefined)).toThrow(
                new Error(
                    'No functions or nullish values can be specified for `defaults`.',
                ),
            );
        });
        test('defaults: null', () => {
            expect(() => ensureConfig(0, null)).toThrow(
                new Error(
                    'No functions or nullish values can be specified for `defaults`.',
                ),
            );
        });
        test('loaded: function', () => {
            expect(() => ensureConfig(() => {}, 0)).toThrow(
                new Error('No functions can be specified for `loaded`.'),
            );
        });
    });
});
