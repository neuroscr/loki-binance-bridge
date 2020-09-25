"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("./actions");
var initialState = {
    independentField: actions_1.Field.LIQUIDITY_PERCENT,
    typedValue: '0'
};
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder.addCase(actions_1.typeInput, function (state, _a) {
        var _b = _a.payload, field = _b.field, typedValue = _b.typedValue;
        return __assign(__assign({}, state), { independentField: field, typedValue: typedValue });
    });
});
