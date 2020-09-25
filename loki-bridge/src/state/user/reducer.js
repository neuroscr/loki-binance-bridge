"use strict";
exports.__esModule = true;
exports.initialState = void 0;
var constants_1 = require("../../constants");
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("../global/actions");
var actions_2 = require("./actions");
var currentTimestamp = function () { return new Date().getTime(); };
function pairKey(token0Address, token1Address) {
    return token0Address + ";" + token1Address;
}
exports.initialState = {
    userDarkMode: null,
    matchesDarkMode: false,
    userExpertMode: false,
    userSlippageTolerance: constants_1.INITIAL_ALLOWED_SLIPPAGE,
    userDeadline: constants_1.DEFAULT_DEADLINE_FROM_NOW,
    tokens: {},
    pairs: {},
    timestamp: currentTimestamp()
};
exports["default"] = toolkit_1.createReducer(exports.initialState, function (builder) {
    return builder
        .addCase(actions_1.updateVersion, function (state) {
        // slippage isnt being tracked in local storage, reset to default
        // noinspection SuspiciousTypeOfGuard
        if (typeof state.userSlippageTolerance !== 'number') {
            state.userSlippageTolerance = constants_1.INITIAL_ALLOWED_SLIPPAGE;
        }
        // deadline isnt being tracked in local storage, reset to default
        // noinspection SuspiciousTypeOfGuard
        if (typeof state.userDeadline !== 'number') {
            state.userDeadline = constants_1.DEFAULT_DEADLINE_FROM_NOW;
        }
        state.lastUpdateVersionTimestamp = currentTimestamp();
    })
        .addCase(actions_2.updateUserDarkMode, function (state, action) {
        state.userDarkMode = action.payload.userDarkMode;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.updateMatchesDarkMode, function (state, action) {
        state.matchesDarkMode = action.payload.matchesDarkMode;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.updateUserExpertMode, function (state, action) {
        state.userExpertMode = action.payload.userExpertMode;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.updateUserSlippageTolerance, function (state, action) {
        state.userSlippageTolerance = action.payload.userSlippageTolerance;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.updateUserDeadline, function (state, action) {
        state.userDeadline = action.payload.userDeadline;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.addSerializedToken, function (state, _a) {
        var serializedToken = _a.payload.serializedToken;
        state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {};
        state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken;
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.removeSerializedToken, function (state, _a) {
        var _b = _a.payload, address = _b.address, chainId = _b.chainId;
        state.tokens[chainId] = state.tokens[chainId] || {};
        delete state.tokens[chainId][address];
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.addSerializedPair, function (state, _a) {
        var serializedPair = _a.payload.serializedPair;
        if (serializedPair.token0.chainId === serializedPair.token1.chainId &&
            serializedPair.token0.address !== serializedPair.token1.address) {
            var chainId = serializedPair.token0.chainId;
            state.pairs[chainId] = state.pairs[chainId] || {};
            state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair;
        }
        state.timestamp = currentTimestamp();
    })
        .addCase(actions_2.removeSerializedPair, function (state, _a) {
        var _b = _a.payload, chainId = _b.chainId, tokenAAddress = _b.tokenAAddress, tokenBAddress = _b.tokenBAddress;
        if (state.pairs[chainId]) {
            // just delete both keys if either exists
            delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)];
            delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)];
        }
        state.timestamp = currentTimestamp();
    });
});
