"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var redux_1 = require("redux");
var actions_1 = require("./actions");
var reducer_1 = __importDefault(require("./reducer"));
describe('mint reducer', function () {
    var store;
    beforeEach(function () {
        store = redux_1.createStore(reducer_1["default"], {
            independentField: actions_1.Field.CURRENCY_A,
            typedValue: '',
            otherTypedValue: ''
        });
    });
    describe('typeInput', function () {
        it('sets typed value', function () {
            store.dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_A, typedValue: '1.0', noLiquidity: false }));
            expect(store.getState()).toEqual({ independentField: actions_1.Field.CURRENCY_A, typedValue: '1.0', otherTypedValue: '' });
        });
        it('clears other value', function () {
            store.dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_A, typedValue: '1.0', noLiquidity: false }));
            store.dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_B, typedValue: '1.0', noLiquidity: false }));
            expect(store.getState()).toEqual({ independentField: actions_1.Field.CURRENCY_B, typedValue: '1.0', otherTypedValue: '' });
        });
    });
});
