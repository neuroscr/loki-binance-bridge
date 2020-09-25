"use strict";
exports.__esModule = true;
exports.removePopup = exports.addPopup = exports.toggleSettingsMenu = exports.toggleWalletModal = exports.updateBlockNumber = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
exports.updateBlockNumber = toolkit_1.createAction('app/updateBlockNumber');
exports.toggleWalletModal = toolkit_1.createAction('app/toggleWalletModal');
exports.toggleSettingsMenu = toolkit_1.createAction('app/toggleSettingsMenu');
exports.addPopup = toolkit_1.createAction('app/addPopup');
exports.removePopup = toolkit_1.createAction('app/removePopup');
