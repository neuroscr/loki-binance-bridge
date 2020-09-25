"use strict";
exports.__esModule = true;
exports.setRecipient = exports.replaceSwapState = exports.typeInput = exports.switchCurrencies = exports.selectCurrency = exports.Field = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var Field;
(function (Field) {
    Field["INPUT"] = "INPUT";
    Field["OUTPUT"] = "OUTPUT";
})(Field = exports.Field || (exports.Field = {}));
exports.selectCurrency = toolkit_1.createAction('swap/selectCurrency');
exports.switchCurrencies = toolkit_1.createAction('swap/switchCurrencies');
exports.typeInput = toolkit_1.createAction('swap/typeInput');
exports.replaceSwapState = toolkit_1.createAction('swap/replaceSwapState');
exports.setRecipient = toolkit_1.createAction('swap/setRecipient');
