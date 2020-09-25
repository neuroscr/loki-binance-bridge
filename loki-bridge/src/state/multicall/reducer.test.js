"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var actions_1 = require("./actions");
var reducer_1 = __importDefault(require("./reducer"));
var toolkit_1 = require("@reduxjs/toolkit");
var DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
describe('multicall reducer', function () {
    var store;
    beforeEach(function () {
        store = toolkit_1.createStore(reducer_1["default"]);
    });
    it('has correct initial state', function () {
        expect(store.getState().callResults).toEqual({});
        expect(store.getState().callListeners).toEqual(undefined);
    });
    describe('addMulticallListeners', function () {
        it('adds listeners', function () {
            var _a, _b, _c;
            store.dispatch(actions_1.addMulticallListeners({
                chainId: 1,
                calls: [
                    {
                        address: DAI_ADDRESS,
                        callData: '0x'
                    }
                ]
            }));
            expect(store.getState()).toEqual({
                callListeners: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x"] = (_c = {},
                            _c[1] = 1,
                            _c),
                        _b),
                    _a),
                callResults: {}
            });
        });
    });
    describe('removeMulticallListeners', function () {
        it('noop', function () {
            store.dispatch(actions_1.removeMulticallListeners({
                calls: [
                    {
                        address: DAI_ADDRESS,
                        callData: '0x'
                    }
                ],
                chainId: 1
            }));
            expect(store.getState()).toEqual({ callResults: {}, callListeners: {} });
        });
        it('removes listeners', function () {
            var _a, _b;
            store.dispatch(actions_1.addMulticallListeners({
                chainId: 1,
                calls: [
                    {
                        address: DAI_ADDRESS,
                        callData: '0x'
                    }
                ]
            }));
            store.dispatch(actions_1.removeMulticallListeners({
                calls: [
                    {
                        address: DAI_ADDRESS,
                        callData: '0x'
                    }
                ],
                chainId: 1
            }));
            expect(store.getState()).toEqual({
                callResults: {},
                callListeners: (_a = {}, _a[1] = (_b = {}, _b[DAI_ADDRESS + "-0x"] = {}, _b), _a)
            });
        });
    });
    describe('updateMulticallResults', function () {
        it('updates data if not present', function () {
            var _a;
            store.dispatch(actions_1.updateMulticallResults({
                chainId: 1,
                blockNumber: 1,
                results: {
                    abc: '0x'
                }
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = {
                        abc: {
                            blockNumber: 1,
                            data: '0x'
                        }
                    },
                    _a)
            });
        });
        it('updates old data', function () {
            var _a;
            store.dispatch(actions_1.updateMulticallResults({
                chainId: 1,
                blockNumber: 1,
                results: {
                    abc: '0x'
                }
            }));
            store.dispatch(actions_1.updateMulticallResults({
                chainId: 1,
                blockNumber: 2,
                results: {
                    abc: '0x2'
                }
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = {
                        abc: {
                            blockNumber: 2,
                            data: '0x2'
                        }
                    },
                    _a)
            });
        });
        it('ignores late updates', function () {
            var _a;
            store.dispatch(actions_1.updateMulticallResults({
                chainId: 1,
                blockNumber: 2,
                results: {
                    abc: '0x2'
                }
            }));
            store.dispatch(actions_1.updateMulticallResults({
                chainId: 1,
                blockNumber: 1,
                results: {
                    abc: '0x1'
                }
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = {
                        abc: {
                            blockNumber: 2,
                            data: '0x2'
                        }
                    },
                    _a)
            });
        });
    });
    describe('fetchingMulticallResults', function () {
        it('updates state to fetching', function () {
            var _a, _b;
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x0"] = { fetchingBlockNumber: 2 },
                        _b),
                    _a)
            });
        });
        it('updates state to fetching even if already fetching older block', function () {
            var _a, _b;
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 3,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x0"] = { fetchingBlockNumber: 3 },
                        _b),
                    _a)
            });
        });
        it('does not do update if fetching newer block', function () {
            var _a, _b;
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 1,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x0"] = { fetchingBlockNumber: 2 },
                        _b),
                    _a)
            });
        });
    });
    describe('errorFetchingMulticallResults', function () {
        it('does nothing if not fetching', function () {
            var _a;
            store.dispatch(actions_1.errorFetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 1,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = {},
                    _a)
            });
        });
        it('updates block number if we were fetching', function () {
            var _a, _b;
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            store.dispatch(actions_1.errorFetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x0"] = {
                            blockNumber: 2,
                            // null data indicates error
                            data: null
                        },
                        _b),
                    _a)
            });
        });
        it('does nothing if not errored on latest block', function () {
            var _a, _b;
            store.dispatch(actions_1.fetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 3,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            store.dispatch(actions_1.errorFetchingMulticallResults({
                chainId: 1,
                fetchingBlockNumber: 2,
                calls: [{ address: DAI_ADDRESS, callData: '0x0' }]
            }));
            expect(store.getState()).toEqual({
                callResults: (_a = {},
                    _a[1] = (_b = {},
                        _b[DAI_ADDRESS + "-0x0"] = { fetchingBlockNumber: 3 },
                        _b),
                    _a)
            });
        });
    });
});
