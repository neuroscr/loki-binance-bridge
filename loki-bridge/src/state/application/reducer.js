"use strict";
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("./actions");
var initialState = {
    blockNumber: {},
    popupList: [],
    walletModalOpen: false,
    settingsMenuOpen: false
};
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder
        .addCase(actions_1.updateBlockNumber, function (state, action) {
        var _a = action.payload, chainId = _a.chainId, blockNumber = _a.blockNumber;
        if (typeof state.blockNumber[chainId] !== 'number') {
            state.blockNumber[chainId] = blockNumber;
        }
        else {
            state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId]);
        }
    })
        .addCase(actions_1.toggleWalletModal, function (state) {
        state.walletModalOpen = !state.walletModalOpen;
    })
        .addCase(actions_1.toggleSettingsMenu, function (state) {
        state.settingsMenuOpen = !state.settingsMenuOpen;
    })
        .addCase(actions_1.addPopup, function (state, _a) {
        var _b = _a.payload, content = _b.content, key = _b.key, _c = _b.removeAfterMs, removeAfterMs = _c === void 0 ? 15000 : _c;
        state.popupList = (key ? state.popupList.filter(function (popup) { return popup.key !== key; }) : state.popupList).concat([
            {
                key: key || toolkit_1.nanoid(),
                show: true,
                content: content,
                removeAfterMs: removeAfterMs
            }
        ]);
    })
        .addCase(actions_1.removePopup, function (state, _a) {
        var key = _a.payload.key;
        state.popupList.forEach(function (p) {
            if (p.key === key) {
                p.show = false;
            }
        });
    });
});
