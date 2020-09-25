"use strict";
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("./actions");
var initialState = {
    callResults: {}
};
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder
        .addCase(actions_1.addMulticallListeners, function (state, _a) {
        var _b;
        var _c = _a.payload, calls = _c.calls, chainId = _c.chainId, _d = _c.options, _e = (_d === void 0 ? {} : _d).blocksPerFetch, blocksPerFetch = _e === void 0 ? 1 : _e;
        var listeners = state.callListeners
            ? state.callListeners
            : (state.callListeners = {});
        listeners[chainId] = (_b = listeners[chainId]) !== null && _b !== void 0 ? _b : {};
        calls.forEach(function (call) {
            var _a, _b;
            var callKey = actions_1.toCallKey(call);
            listeners[chainId][callKey] = (_a = listeners[chainId][callKey]) !== null && _a !== void 0 ? _a : {};
            listeners[chainId][callKey][blocksPerFetch] = ((_b = listeners[chainId][callKey][blocksPerFetch]) !== null && _b !== void 0 ? _b : 0) + 1;
        });
    })
        .addCase(actions_1.removeMulticallListeners, function (state, _a) {
        var _b = _a.payload, chainId = _b.chainId, calls = _b.calls, _c = _b.options, _d = (_c === void 0 ? {} : _c).blocksPerFetch, blocksPerFetch = _d === void 0 ? 1 : _d;
        var listeners = state.callListeners
            ? state.callListeners
            : (state.callListeners = {});
        if (!listeners[chainId])
            return;
        calls.forEach(function (call) {
            var callKey = actions_1.toCallKey(call);
            if (!listeners[chainId][callKey])
                return;
            if (!listeners[chainId][callKey][blocksPerFetch])
                return;
            if (listeners[chainId][callKey][blocksPerFetch] === 1) {
                delete listeners[chainId][callKey][blocksPerFetch];
            }
            else {
                listeners[chainId][callKey][blocksPerFetch]--;
            }
        });
    })
        .addCase(actions_1.fetchingMulticallResults, function (state, _a) {
        var _b;
        var _c = _a.payload, chainId = _c.chainId, fetchingBlockNumber = _c.fetchingBlockNumber, calls = _c.calls;
        state.callResults[chainId] = (_b = state.callResults[chainId]) !== null && _b !== void 0 ? _b : {};
        calls.forEach(function (call) {
            var _a;
            var callKey = actions_1.toCallKey(call);
            var current = state.callResults[chainId][callKey];
            if (!current) {
                state.callResults[chainId][callKey] = {
                    fetchingBlockNumber: fetchingBlockNumber
                };
            }
            else {
                if (((_a = current.fetchingBlockNumber) !== null && _a !== void 0 ? _a : 0) >= fetchingBlockNumber)
                    return;
                state.callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber;
            }
        });
    })
        .addCase(actions_1.errorFetchingMulticallResults, function (state, _a) {
        var _b;
        var _c = _a.payload, fetchingBlockNumber = _c.fetchingBlockNumber, chainId = _c.chainId, calls = _c.calls;
        state.callResults[chainId] = (_b = state.callResults[chainId]) !== null && _b !== void 0 ? _b : {};
        calls.forEach(function (call) {
            var callKey = actions_1.toCallKey(call);
            var current = state.callResults[chainId][callKey];
            if (!current)
                return; // only should be dispatched if we are already fetching
            if (current.fetchingBlockNumber === fetchingBlockNumber) {
                delete current.fetchingBlockNumber;
                current.data = null;
                current.blockNumber = fetchingBlockNumber;
            }
        });
    })
        .addCase(actions_1.updateMulticallResults, function (state, _a) {
        var _b;
        var _c = _a.payload, chainId = _c.chainId, results = _c.results, blockNumber = _c.blockNumber;
        state.callResults[chainId] = (_b = state.callResults[chainId]) !== null && _b !== void 0 ? _b : {};
        Object.keys(results).forEach(function (callKey) {
            var _a;
            var current = state.callResults[chainId][callKey];
            if (((_a = current === null || current === void 0 ? void 0 : current.blockNumber) !== null && _a !== void 0 ? _a : 0) > blockNumber)
                return;
            state.callResults[chainId][callKey] = {
                data: results[callKey],
                blockNumber: blockNumber
            };
        });
    });
});
