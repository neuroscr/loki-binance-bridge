"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
var actions_1 = require("./actions");
var hooks_1 = require("./hooks");
describe('hooks', function () {
    describe('#queryParametersToSwapState', function () {
        test('ETH to DAI', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?inputCurrency=ETH&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
                _a[actions_1.Field.INPUT] = { currencyId: 'ETH' },
                _a.typedValue = '20.5',
                _a.independentField = actions_1.Field.OUTPUT,
                _a.recipient = null,
                _a));
        });
        test('does not duplicate eth for invalid output token', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=invalid', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual((_a = {},
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a[actions_1.Field.OUTPUT] = { currencyId: 'ETH' },
                _a.typedValue = '',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = null,
                _a));
        });
        test('output ETH only', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: 'ETH' },
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a.typedValue = '20.5',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = null,
                _a));
        });
        test('invalid recipient', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=abc', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: 'ETH' },
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a.typedValue = '20.5',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = null,
                _a));
        });
        test('valid recipient', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5', {
                parseArrays: false,
                ignoreQueryPrefix: true
            }))).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: 'ETH' },
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a.typedValue = '20.5',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
                _a));
        });
        test('accepts any recipient', function () {
            var _a;
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=bob.argent.xyz', {
                parseArrays: false,
                ignoreQueryPrefix: true
            }))).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: 'ETH' },
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a.typedValue = '20.5',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = 'bob.argent.xyz',
                _a));
        });
    });
});
