"use strict";
exports.__esModule = true;
exports.typeInput = exports.Field = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var Field;
(function (Field) {
    Field["LIQUIDITY_PERCENT"] = "LIQUIDITY_PERCENT";
    Field["LIQUIDITY"] = "LIQUIDITY";
    Field["CURRENCY_A"] = "CURRENCY_A";
    Field["CURRENCY_B"] = "CURRENCY_B";
})(Field = exports.Field || (exports.Field = {}));
exports.typeInput = toolkit_1.createAction('burn/typeInputBurn');
