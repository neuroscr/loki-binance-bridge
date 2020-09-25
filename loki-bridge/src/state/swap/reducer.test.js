"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var redux_1 = require("redux");
var actions_1 = require("./actions");
var reducer_1 = __importDefault(require("./reducer"));
describe('swap reducer', function () {
    var store;
    beforeEach(function () {
        var _a;
        store = redux_1.createStore(reducer_1["default"], (_a = {},
            _a[actions_1.Field.OUTPUT] = { currencyId: '' },
            _a[actions_1.Field.INPUT] = { currencyId: '' },
            _a.typedValue = '',
            _a.independentField = actions_1.Field.INPUT,
            _a.recipient = null,
            _a));
    });
    describe('selectToken', function () {
        it('changes token', function () {
            var _a;
            store.dispatch(actions_1.selectCurrency({
                field: actions_1.Field.OUTPUT,
                currencyId: '0x0000'
            }));
            expect(store.getState()).toEqual((_a = {},
                _a[actions_1.Field.OUTPUT] = { currencyId: '0x0000' },
                _a[actions_1.Field.INPUT] = { currencyId: '' },
                _a.typedValue = '',
                _a.independentField = actions_1.Field.INPUT,
                _a.recipient = null,
                _a));
        });
    });
});
