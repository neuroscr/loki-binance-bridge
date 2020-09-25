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
    independentField: actions_1.Field.CURRENCY_A,
    typedValue: '',
    otherTypedValue: ''
};
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder
        .addCase(actions_1.resetMintState, function () { return initialState; })
        .addCase(actions_1.typeInput, function (state, _a) {
        var _b = _a.payload, field = _b.field, typedValue = _b.typedValue, noLiquidity = _b.noLiquidity;
        if (noLiquidity) {
            // they're typing into the field they've last typed in
            if (field === state.independentField) {
                return __assign(__assign({}, state), { independentField: field, typedValue: typedValue });
            }
            // they're typing into a new field, store the other value
            else {
                return __assign(__assign({}, state), { independentField: field, typedValue: typedValue, otherTypedValue: state.typedValue });
            }
        }
        else {
            return __assign(__assign({}, state), { independentField: field, typedValue: typedValue, otherTypedValue: '' });
        }
    });
});
