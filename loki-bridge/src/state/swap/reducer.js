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
var _a;
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var actions_1 = require("./actions");
var initialState = (_a = {
        independentField: actions_1.Field.INPUT,
        typedValue: ''
    },
    _a[actions_1.Field.INPUT] = {
        currencyId: ''
    },
    _a[actions_1.Field.OUTPUT] = {
        currencyId: ''
    },
    _a.recipient = null,
    _a);
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder
        .addCase(actions_1.replaceSwapState, function (state, _a) {
        var _b;
        var _c = _a.payload, typedValue = _c.typedValue, recipient = _c.recipient, field = _c.field, inputCurrencyId = _c.inputCurrencyId, outputCurrencyId = _c.outputCurrencyId;
        return _b = {},
            _b[actions_1.Field.INPUT] = {
                currencyId: inputCurrencyId
            },
            _b[actions_1.Field.OUTPUT] = {
                currencyId: outputCurrencyId
            },
            _b.independentField = field,
            _b.typedValue = typedValue,
            _b.recipient = recipient,
            _b;
    })
        .addCase(actions_1.selectCurrency, function (state, _a) {
        var _b, _c;
        var _d = _a.payload, currencyId = _d.currencyId, field = _d.field;
        var otherField = field === actions_1.Field.INPUT ? actions_1.Field.OUTPUT : actions_1.Field.INPUT;
        if (currencyId === state[otherField].currencyId) {
            // the case where we have to swap the order
            return __assign(__assign({}, state), (_b = { independentField: state.independentField === actions_1.Field.INPUT ? actions_1.Field.OUTPUT : actions_1.Field.INPUT }, _b[field] = { currencyId: currencyId }, _b[otherField] = { currencyId: state[field].currencyId }, _b));
        }
        else {
            // the normal case
            return __assign(__assign({}, state), (_c = {}, _c[field] = { currencyId: currencyId }, _c));
        }
    })
        .addCase(actions_1.switchCurrencies, function (state) {
        var _a;
        return __assign(__assign({}, state), (_a = { independentField: state.independentField === actions_1.Field.INPUT ? actions_1.Field.OUTPUT : actions_1.Field.INPUT }, _a[actions_1.Field.INPUT] = { currencyId: state[actions_1.Field.OUTPUT].currencyId }, _a[actions_1.Field.OUTPUT] = { currencyId: state[actions_1.Field.INPUT].currencyId }, _a));
    })
        .addCase(actions_1.typeInput, function (state, _a) {
        var _b = _a.payload, field = _b.field, typedValue = _b.typedValue;
        return __assign(__assign({}, state), { independentField: field, typedValue: typedValue });
    })
        .addCase(actions_1.setRecipient, function (state, _a) {
        var recipient = _a.payload.recipient;
        state.recipient = recipient;
    });
});
