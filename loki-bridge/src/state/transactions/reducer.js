"use strict";
exports.__esModule = true;
exports.initialState = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("./actions");
var now = function () { return new Date().getTime(); };
exports.initialState = {};
exports["default"] = toolkit_1.createReducer(exports.initialState, function (builder) {
    return builder
        .addCase(actions_1.addTransaction, function (transactions, _a) {
        var _b, _c;
        var _d = _a.payload, chainId = _d.chainId, from = _d.from, hash = _d.hash, approval = _d.approval, summary = _d.summary;
        if ((_b = transactions[chainId]) === null || _b === void 0 ? void 0 : _b[hash]) {
            throw Error('Attempted to add existing transaction.');
        }
        var txs = (_c = transactions[chainId]) !== null && _c !== void 0 ? _c : {};
        txs[hash] = { hash: hash, approval: approval, summary: summary, from: from, addedTime: now() };
        transactions[chainId] = txs;
    })
        .addCase(actions_1.clearAllTransactions, function (transactions, _a) {
        var chainId = _a.payload.chainId;
        if (!transactions[chainId])
            return;
        transactions[chainId] = {};
    })
        .addCase(actions_1.checkedTransaction, function (transactions, _a) {
        var _b;
        var _c = _a.payload, chainId = _c.chainId, hash = _c.hash, blockNumber = _c.blockNumber;
        var tx = (_b = transactions[chainId]) === null || _b === void 0 ? void 0 : _b[hash];
        if (!tx) {
            return;
        }
        if (!tx.lastCheckedBlockNumber) {
            tx.lastCheckedBlockNumber = blockNumber;
        }
        else {
            tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber);
        }
    })
        .addCase(actions_1.finalizeTransaction, function (transactions, _a) {
        var _b;
        var _c = _a.payload, hash = _c.hash, chainId = _c.chainId, receipt = _c.receipt;
        var tx = (_b = transactions[chainId]) === null || _b === void 0 ? void 0 : _b[hash];
        if (!tx) {
            return;
        }
        tx.receipt = receipt;
        tx.confirmedTime = now();
    });
});
