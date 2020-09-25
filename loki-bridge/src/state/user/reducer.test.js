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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var redux_1 = require("redux");
var constants_1 = require("../../constants");
var actions_1 = require("../global/actions");
var reducer_1 = __importStar(require("./reducer"));
describe('swap reducer', function () {
    var store;
    beforeEach(function () {
        store = redux_1.createStore(reducer_1["default"], reducer_1.initialState);
    });
    describe('updateVersion', function () {
        it('has no timestamp originally', function () {
            expect(store.getState().lastUpdateVersionTimestamp).toBeUndefined();
        });
        it('sets the lastUpdateVersionTimestamp', function () {
            var time = new Date().getTime();
            store.dispatch(actions_1.updateVersion());
            expect(store.getState().lastUpdateVersionTimestamp).toBeGreaterThanOrEqual(time);
        });
        it('sets allowed slippage and deadline', function () {
            store = redux_1.createStore(reducer_1["default"], __assign(__assign({}, reducer_1.initialState), { userDeadline: undefined, userSlippageTolerance: undefined }));
            store.dispatch(actions_1.updateVersion());
            expect(store.getState().userDeadline).toEqual(constants_1.DEFAULT_DEADLINE_FROM_NOW);
            expect(store.getState().userSlippageTolerance).toEqual(constants_1.INITIAL_ALLOWED_SLIPPAGE);
        });
    });
});
