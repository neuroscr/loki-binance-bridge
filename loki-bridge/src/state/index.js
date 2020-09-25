"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var redux_localstorage_simple_1 = require("redux-localstorage-simple");
var reducer_1 = __importDefault(require("./application/reducer"));
var actions_1 = require("./global/actions");
var reducer_2 = __importDefault(require("./user/reducer"));
var reducer_3 = __importDefault(require("./transactions/reducer"));
var reducer_4 = __importDefault(require("./swap/reducer"));
var reducer_5 = __importDefault(require("./mint/reducer"));
var reducer_6 = __importDefault(require("./lists/reducer"));
var reducer_7 = __importDefault(require("./burn/reducer"));
var reducer_8 = __importDefault(require("./multicall/reducer"));
var PERSISTED_KEYS = ['user', 'transactions', 'lists'];
var store = toolkit_1.configureStore({
    reducer: {
        application: reducer_1["default"],
        user: reducer_2["default"],
        transactions: reducer_3["default"],
        swap: reducer_4["default"],
        mint: reducer_5["default"],
        burn: reducer_7["default"],
        multicall: reducer_8["default"],
        lists: reducer_6["default"]
    },
    middleware: __spreadArrays(toolkit_1.getDefaultMiddleware({ thunk: false }), [redux_localstorage_simple_1.save({ states: PERSISTED_KEYS })]),
    preloadedState: redux_localstorage_simple_1.load({ states: PERSISTED_KEYS })
});
store.dispatch(actions_1.updateVersion());
exports["default"] = store;
