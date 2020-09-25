"use strict";
exports.__esModule = true;
exports.updateVersion = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// fired once when the app reloads but before the app renders
// allows any updates to be applied to store data loaded from localStorage
exports.updateVersion = toolkit_1.createAction('global/updateVersion');
