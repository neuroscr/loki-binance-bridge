"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.retry = exports.RetryableError = exports.CancelledError = void 0;
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function waitRandom(min, max) {
    return wait(min + Math.round(Math.random() * Math.max(0, max - min)));
}
/**
 * This error is thrown if the function is cancelled before completing
 */
var CancelledError = /** @class */ (function (_super) {
    __extends(CancelledError, _super);
    function CancelledError() {
        return _super.call(this, 'Cancelled') || this;
    }
    return CancelledError;
}(Error));
exports.CancelledError = CancelledError;
/**
 * Throw this error if the function should retry
 */
var RetryableError = /** @class */ (function (_super) {
    __extends(RetryableError, _super);
    function RetryableError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RetryableError;
}(Error));
exports.RetryableError = RetryableError;
/**
 * Retries the function that returns the promise until the promise successfully resolves up to n retries
 * @param fn function to retry
 * @param n how many times to retry
 * @param minWait min wait between retries in ms
 * @param maxWait max wait between retries in ms
 */
function retry(fn, _a) {
    var _this = this;
    var n = _a.n, minWait = _a.minWait, maxWait = _a.maxWait;
    var completed = false;
    var rejectCancelled;
    var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rejectCancelled = reject;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 7];
                    result = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fn()];
                case 3:
                    result = _a.sent();
                    if (!completed) {
                        resolve(result);
                        completed = true;
                    }
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    if (completed) {
                        return [3 /*break*/, 7];
                    }
                    if (n <= 0 || !(error_1 instanceof RetryableError)) {
                        reject(error_1);
                        completed = true;
                        return [3 /*break*/, 7];
                    }
                    n--;
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, waitRandom(minWait, maxWait)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    return {
        promise: promise,
        cancel: function () {
            if (completed)
                return;
            completed = true;
            rejectCancelled(new CancelledError());
        }
    };
}
exports.retry = retry;
