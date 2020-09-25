"use strict";
exports.__esModule = true;
exports.resetMintState = exports.typeInput = exports.Field = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var Field;
(function (Field) {
    Field["CURRENCY_A"] = "CURRENCY_A";
    Field["CURRENCY_B"] = "CURRENCY_B";
})(Field = exports.Field || (exports.Field = {}));
exports.typeInput = toolkit_1.createAction('mint/typeInputMint');
exports.resetMintState = toolkit_1.createAction('mint/resetMintState');
