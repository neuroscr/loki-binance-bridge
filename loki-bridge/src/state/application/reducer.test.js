"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sdk_1 = require("@uniswap/sdk");
var redux_1 = require("redux");
var actions_1 = require("./actions");
var reducer_1 = __importDefault(require("./reducer"));
describe('application reducer', function () {
    var store;
    beforeEach(function () {
        var _a;
        store = redux_1.createStore(reducer_1["default"], {
            popupList: [],
            walletModalOpen: false,
            settingsMenuOpen: false,
            blockNumber: (_a = {},
                _a[sdk_1.ChainId.MAINNET] = 3,
                _a)
        });
    });
    describe('addPopup', function () {
        it('adds the popup to list with a generated id', function () {
            store.dispatch(actions_1.addPopup({ content: { txn: { hash: 'abc', summary: 'test', success: true } } }));
            var list = store.getState().popupList;
            expect(list).toHaveLength(1);
            expect(typeof list[0].key).toEqual('string');
            expect(list[0].show).toEqual(true);
            expect(list[0].content).toEqual({ txn: { hash: 'abc', summary: 'test', success: true } });
            expect(list[0].removeAfterMs).toEqual(15000);
        });
        it('replaces any existing popups with the same key', function () {
            store.dispatch(actions_1.addPopup({ key: 'abc', content: { txn: { hash: 'abc', summary: 'test', success: true } } }));
            store.dispatch(actions_1.addPopup({ key: 'abc', content: { txn: { hash: 'def', summary: 'test2', success: false } } }));
            var list = store.getState().popupList;
            expect(list).toHaveLength(1);
            expect(list[0].key).toEqual('abc');
            expect(list[0].show).toEqual(true);
            expect(list[0].content).toEqual({ txn: { hash: 'def', summary: 'test2', success: false } });
            expect(list[0].removeAfterMs).toEqual(15000);
        });
    });
    describe('toggleWalletModal', function () {
        it('toggles wallet modal', function () {
            store.dispatch(actions_1.toggleWalletModal());
            expect(store.getState().walletModalOpen).toEqual(true);
            store.dispatch(actions_1.toggleWalletModal());
            expect(store.getState().walletModalOpen).toEqual(false);
            store.dispatch(actions_1.toggleWalletModal());
            expect(store.getState().walletModalOpen).toEqual(true);
        });
    });
    describe('settingsMenuOpen', function () {
        it('toggles settings menu', function () {
            store.dispatch(actions_1.toggleSettingsMenu());
            expect(store.getState().settingsMenuOpen).toEqual(true);
            store.dispatch(actions_1.toggleSettingsMenu());
            expect(store.getState().settingsMenuOpen).toEqual(false);
            store.dispatch(actions_1.toggleSettingsMenu());
            expect(store.getState().settingsMenuOpen).toEqual(true);
        });
    });
    describe('updateBlockNumber', function () {
        it('updates block number', function () {
            store.dispatch(actions_1.updateBlockNumber({ chainId: sdk_1.ChainId.MAINNET, blockNumber: 4 }));
            expect(store.getState().blockNumber[sdk_1.ChainId.MAINNET]).toEqual(4);
        });
        it('no op if late', function () {
            store.dispatch(actions_1.updateBlockNumber({ chainId: sdk_1.ChainId.MAINNET, blockNumber: 2 }));
            expect(store.getState().blockNumber[sdk_1.ChainId.MAINNET]).toEqual(3);
        });
        it('works with non-set chains', function () {
            var _a;
            store.dispatch(actions_1.updateBlockNumber({ chainId: sdk_1.ChainId.ROPSTEN, blockNumber: 2 }));
            expect(store.getState().blockNumber).toEqual((_a = {},
                _a[sdk_1.ChainId.MAINNET] = 3,
                _a[sdk_1.ChainId.ROPSTEN] = 2,
                _a));
        });
    });
    describe('removePopup', function () {
        beforeEach(function () {
            store.dispatch(actions_1.addPopup({ key: 'abc', content: { txn: { hash: 'abc', summary: 'test', success: true } } }));
        });
        it('hides the popup', function () {
            expect(store.getState().popupList[0].show).toBe(true);
            store.dispatch(actions_1.removePopup({ key: 'abc' }));
            expect(store.getState().popupList).toHaveLength(1);
            expect(store.getState().popupList[0].show).toBe(false);
        });
    });
});
