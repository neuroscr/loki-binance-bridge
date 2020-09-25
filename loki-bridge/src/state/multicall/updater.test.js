"use strict";
exports.__esModule = true;
var updater_1 = require("./updater");
describe('multicall updater', function () {
    describe('#activeListeningKeys', function () {
        it('ignores 0, returns call key to block age key', function () {
            var _a, _b;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = {
                        4: 2,
                        1: 0 // 0 listeners care about 1 block old data
                    },
                    _b),
                _a), 1)).toEqual({
                abc: 4
            });
        });
        it('applies min', function () {
            var _a, _b;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = {
                        4: 2,
                        3: 1,
                        1: 0 // 0 listeners care about 1 block old data
                    },
                    _b),
                _a), 1)).toEqual({
                abc: 3
            });
        });
        it('works for infinity', function () {
            var _a, _b;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = {
                        4: 2,
                        1: 0 // 0 listeners care about 1 block old data
                    },
                    _b['def'] = {
                        Infinity: 2
                    },
                    _b),
                _a), 1)).toEqual({
                abc: 4,
                def: Infinity
            });
        });
        it('multiple keys', function () {
            var _a, _b;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = {
                        4: 2,
                        1: 0 // 0 listeners care about 1 block old data
                    },
                    _b['def'] = {
                        2: 1,
                        5: 2
                    },
                    _b),
                _a), 1)).toEqual({
                abc: 4,
                def: 2
            });
        });
        it('ignores negative numbers', function () {
            var _a, _b, _c;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = (_c = {
                            4: 2,
                            1: -1
                        },
                        _c[-3] = 4,
                        _c),
                    _b),
                _a), 1)).toEqual({
                abc: 4
            });
        });
        it('applies min to infinity', function () {
            var _a, _b;
            expect(updater_1.activeListeningKeys((_a = {},
                _a[1] = (_b = {},
                    _b['abc'] = {
                        Infinity: 2,
                        4: 2,
                        1: 0 // 0 listeners care about 1 block old data
                    },
                    _b),
                _a), 1)).toEqual({
                abc: 4
            });
        });
    });
    describe('#outdatedListeningKeys', function () {
        it('returns empty if missing block number or chain id', function () {
            expect(updater_1.outdatedListeningKeys({}, { abc: 2 }, undefined, undefined)).toEqual([]);
            expect(updater_1.outdatedListeningKeys({}, { abc: 2 }, 1, undefined)).toEqual([]);
            expect(updater_1.outdatedListeningKeys({}, { abc: 2 }, undefined, 1)).toEqual([]);
        });
        it('returns everything for no results', function () {
            expect(updater_1.outdatedListeningKeys({}, { abc: 2, def: 3 }, 1, 1)).toEqual(['abc', 'def']);
        });
        it('returns only outdated keys', function () {
            var _a;
            expect(updater_1.outdatedListeningKeys((_a = {}, _a[1] = { abc: { data: '0x', blockNumber: 2 } }, _a), { abc: 1, def: 1 }, 1, 2)).toEqual(['def']);
        });
        it('returns only keys not being fetched', function () {
            var _a;
            expect(updater_1.outdatedListeningKeys((_a = {},
                _a[1] = { abc: { data: '0x', blockNumber: 2 }, def: { fetchingBlockNumber: 2 } },
                _a), { abc: 1, def: 1 }, 1, 2)).toEqual([]);
        });
        it('returns keys being fetched for old blocks', function () {
            var _a;
            expect(updater_1.outdatedListeningKeys((_a = {}, _a[1] = { abc: { data: '0x', blockNumber: 2 }, def: { fetchingBlockNumber: 1 } }, _a), { abc: 1, def: 1 }, 1, 2)).toEqual(['def']);
        });
        it('respects blocks per fetch', function () {
            var _a;
            expect(updater_1.outdatedListeningKeys((_a = {}, _a[1] = { abc: { data: '0x', blockNumber: 2 }, def: { data: '0x', fetchingBlockNumber: 1 } }, _a), { abc: 2, def: 2 }, 1, 3)).toEqual(['def']);
        });
    });
});
