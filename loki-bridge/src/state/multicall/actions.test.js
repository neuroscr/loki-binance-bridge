"use strict";
exports.__esModule = true;
var actions_1 = require("./actions");
describe('actions', function () {
    describe('#parseCallKey', function () {
        it('does not throw for invalid address', function () {
            expect(actions_1.parseCallKey('0x-0x')).toEqual({ address: '0x', callData: '0x' });
        });
        it('does not throw for invalid calldata', function () {
            expect(actions_1.parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-abc')).toEqual({
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                callData: 'abc'
            });
        });
        it('throws for invalid format', function () {
            expect(function () { return actions_1.parseCallKey('abc'); }).toThrow('Invalid call key: abc');
        });
        it('throws for uppercase calldata', function () {
            expect(actions_1.parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcD')).toEqual({
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                callData: '0xabcD'
            });
        });
        it('parses pieces into address', function () {
            expect(actions_1.parseCallKey('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcd')).toEqual({
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                callData: '0xabcd'
            });
        });
    });
    describe('#toCallKey', function () {
        it('throws for invalid address', function () {
            expect(function () { return actions_1.toCallKey({ callData: '0x', address: '0x' }); }).toThrow('Invalid address: 0x');
        });
        it('throws for invalid calldata', function () {
            expect(function () {
                return actions_1.toCallKey({
                    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                    callData: 'abc'
                });
            }).toThrow('Invalid hex: abc');
        });
        it('throws for uppercase hex', function () {
            expect(function () {
                return actions_1.toCallKey({
                    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                    callData: '0xabcD'
                });
            }).toThrow('Invalid hex: 0xabcD');
        });
        it('concatenates address to data', function () {
            expect(actions_1.toCallKey({ address: '0x6b175474e89094c44da98b954eedeac495271d0f', callData: '0xabcd' })).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f-0xabcd');
        });
    });
});
