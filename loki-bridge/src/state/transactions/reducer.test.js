"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var sdk_1 = require("@uniswap/sdk");
var redux_1 = require("redux");
var actions_1 = require("./actions");
var reducer_1 = __importStar(require("./reducer"));
describe('transaction reducer', function () {
    var store;
    beforeEach(function () {
        store = redux_1.createStore(reducer_1["default"], reducer_1.initialState);
    });
    describe('addTransaction', function () {
        it('adds the transaction', function () {
            var _a, _b;
            var beforeTime = new Date().getTime();
            store.dispatch(actions_1.addTransaction({
                chainId: sdk_1.ChainId.MAINNET,
                summary: 'hello world',
                hash: '0x0',
                approval: { tokenAddress: 'abc', spender: 'def' },
                from: 'abc'
            }));
            var txs = store.getState();
            expect(txs[sdk_1.ChainId.MAINNET]).toBeTruthy();
            expect((_a = txs[sdk_1.ChainId.MAINNET]) === null || _a === void 0 ? void 0 : _a['0x0']).toBeTruthy();
            var tx = (_b = txs[sdk_1.ChainId.MAINNET]) === null || _b === void 0 ? void 0 : _b['0x0'];
            expect(tx).toBeTruthy();
            expect(tx === null || tx === void 0 ? void 0 : tx.hash).toEqual('0x0');
            expect(tx === null || tx === void 0 ? void 0 : tx.summary).toEqual('hello world');
            expect(tx === null || tx === void 0 ? void 0 : tx.approval).toEqual({ tokenAddress: 'abc', spender: 'def' });
            expect(tx === null || tx === void 0 ? void 0 : tx.from).toEqual('abc');
            expect(tx === null || tx === void 0 ? void 0 : tx.addedTime).toBeGreaterThanOrEqual(beforeTime);
        });
    });
    describe('finalizeTransaction', function () {
        it('no op if not valid transaction', function () {
            store.dispatch(actions_1.finalizeTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                receipt: {
                    status: 1,
                    transactionIndex: 1,
                    transactionHash: '0x0',
                    to: '0x0',
                    from: '0x0',
                    contractAddress: '0x0',
                    blockHash: '0x0',
                    blockNumber: 1
                }
            }));
            expect(store.getState()).toEqual({});
        });
        it('sets receipt', function () {
            var _a;
            store.dispatch(actions_1.addTransaction({
                hash: '0x0',
                chainId: sdk_1.ChainId.RINKEBY,
                approval: { spender: '0x0', tokenAddress: '0x0' },
                summary: 'hello world',
                from: '0x0'
            }));
            var beforeTime = new Date().getTime();
            store.dispatch(actions_1.finalizeTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                receipt: {
                    status: 1,
                    transactionIndex: 1,
                    transactionHash: '0x0',
                    to: '0x0',
                    from: '0x0',
                    contractAddress: '0x0',
                    blockHash: '0x0',
                    blockNumber: 1
                }
            }));
            var tx = (_a = store.getState()[sdk_1.ChainId.RINKEBY]) === null || _a === void 0 ? void 0 : _a['0x0'];
            expect(tx === null || tx === void 0 ? void 0 : tx.summary).toEqual('hello world');
            expect(tx === null || tx === void 0 ? void 0 : tx.confirmedTime).toBeGreaterThanOrEqual(beforeTime);
            expect(tx === null || tx === void 0 ? void 0 : tx.receipt).toEqual({
                status: 1,
                transactionIndex: 1,
                transactionHash: '0x0',
                to: '0x0',
                from: '0x0',
                contractAddress: '0x0',
                blockHash: '0x0',
                blockNumber: 1
            });
        });
    });
    describe('checkedTransaction', function () {
        it('no op if not valid transaction', function () {
            store.dispatch(actions_1.checkedTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                blockNumber: 1
            }));
            expect(store.getState()).toEqual({});
        });
        it('sets lastCheckedBlockNumber', function () {
            var _a;
            store.dispatch(actions_1.addTransaction({
                hash: '0x0',
                chainId: sdk_1.ChainId.RINKEBY,
                approval: { spender: '0x0', tokenAddress: '0x0' },
                summary: 'hello world',
                from: '0x0'
            }));
            store.dispatch(actions_1.checkedTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                blockNumber: 1
            }));
            var tx = (_a = store.getState()[sdk_1.ChainId.RINKEBY]) === null || _a === void 0 ? void 0 : _a['0x0'];
            expect(tx === null || tx === void 0 ? void 0 : tx.lastCheckedBlockNumber).toEqual(1);
        });
        it('never decreases', function () {
            var _a;
            store.dispatch(actions_1.addTransaction({
                hash: '0x0',
                chainId: sdk_1.ChainId.RINKEBY,
                approval: { spender: '0x0', tokenAddress: '0x0' },
                summary: 'hello world',
                from: '0x0'
            }));
            store.dispatch(actions_1.checkedTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                blockNumber: 3
            }));
            store.dispatch(actions_1.checkedTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                hash: '0x0',
                blockNumber: 1
            }));
            var tx = (_a = store.getState()[sdk_1.ChainId.RINKEBY]) === null || _a === void 0 ? void 0 : _a['0x0'];
            expect(tx === null || tx === void 0 ? void 0 : tx.lastCheckedBlockNumber).toEqual(3);
        });
    });
    describe('clearAllTransactions', function () {
        it('removes all transactions for the chain', function () {
            var _a, _b, _c, _d;
            store.dispatch(actions_1.addTransaction({
                chainId: sdk_1.ChainId.MAINNET,
                summary: 'hello world',
                hash: '0x0',
                approval: { tokenAddress: 'abc', spender: 'def' },
                from: 'abc'
            }));
            store.dispatch(actions_1.addTransaction({
                chainId: sdk_1.ChainId.RINKEBY,
                summary: 'hello world',
                hash: '0x1',
                approval: { tokenAddress: 'abc', spender: 'def' },
                from: 'abc'
            }));
            expect(Object.keys(store.getState())).toHaveLength(2);
            expect(Object.keys(store.getState())).toEqual([String(sdk_1.ChainId.MAINNET), String(sdk_1.ChainId.RINKEBY)]);
            expect(Object.keys((_a = store.getState()[sdk_1.ChainId.MAINNET]) !== null && _a !== void 0 ? _a : {})).toEqual(['0x0']);
            expect(Object.keys((_b = store.getState()[sdk_1.ChainId.RINKEBY]) !== null && _b !== void 0 ? _b : {})).toEqual(['0x1']);
            store.dispatch(actions_1.clearAllTransactions({ chainId: sdk_1.ChainId.MAINNET }));
            expect(Object.keys(store.getState())).toHaveLength(2);
            expect(Object.keys(store.getState())).toEqual([String(sdk_1.ChainId.MAINNET), String(sdk_1.ChainId.RINKEBY)]);
            expect(Object.keys((_c = store.getState()[sdk_1.ChainId.MAINNET]) !== null && _c !== void 0 ? _c : {})).toEqual([]);
            expect(Object.keys((_d = store.getState()[sdk_1.ChainId.RINKEBY]) !== null && _d !== void 0 ? _d : {})).toEqual(['0x1']);
        });
    });
});
