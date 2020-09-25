"use strict";
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
exports.WrapType = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var hooks_1 = require("../state/swap/hooks");
var hooks_2 = require("../state/transactions/hooks");
var hooks_3 = require("../state/wallet/hooks");
var index_1 = require("./index");
var useContract_1 = require("./useContract");
var WrapType;
(function (WrapType) {
    WrapType[WrapType["NOT_APPLICABLE"] = 0] = "NOT_APPLICABLE";
    WrapType[WrapType["WRAP"] = 1] = "WRAP";
    WrapType[WrapType["UNWRAP"] = 2] = "UNWRAP";
})(WrapType = exports.WrapType || (exports.WrapType = {}));
var NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
function useWrapCallback(inputCurrency, outputCurrency, typedValue) {
    var _this = this;
    var _a = index_1.useActiveWeb3React(), chainId = _a.chainId, account = _a.account;
    var wethContract = useContract_1.useWETHContract();
    var balance = hooks_3.useCurrencyBalance(account !== null && account !== void 0 ? account : undefined, inputCurrency);
    // we can always parse the amount typed as the input currency, since wrapping is 1:1
    var inputAmount = react_1.useMemo(function () { return hooks_1.tryParseAmount(typedValue, inputCurrency); }, [inputCurrency, typedValue]);
    var addTransaction = hooks_2.useTransactionAdder();
    return react_1.useMemo(function () {
        if (!wethContract || !chainId || !inputCurrency || !outputCurrency)
            return NOT_APPLICABLE;
        var sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);
        if (inputCurrency === sdk_1.ETHER && sdk_1.currencyEquals(sdk_1.WETH[chainId], outputCurrency)) {
            return {
                wrapType: WrapType.WRAP,
                execute: sufficientBalance && inputAmount
                    ? function () { return __awaiter(_this, void 0, void 0, function () {
                        var txReceipt, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, wethContract.deposit({ value: "0x" + inputAmount.raw.toString(16) })];
                                case 1:
                                    txReceipt = _a.sent();
                                    addTransaction(txReceipt, { summary: "Wrap " + inputAmount.toSignificant(6) + " ETH to WETH" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error('Could not deposit', error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }
                    : undefined,
                inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
            };
        }
        else if (sdk_1.currencyEquals(sdk_1.WETH[chainId], inputCurrency) && outputCurrency === sdk_1.ETHER) {
            return {
                wrapType: WrapType.UNWRAP,
                execute: sufficientBalance && inputAmount
                    ? function () { return __awaiter(_this, void 0, void 0, function () {
                        var txReceipt, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, wethContract.withdraw("0x" + inputAmount.raw.toString(16))];
                                case 1:
                                    txReceipt = _a.sent();
                                    addTransaction(txReceipt, { summary: "Unwrap " + inputAmount.toSignificant(6) + " WETH to ETH" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _a.sent();
                                    console.error('Could not withdraw', error_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }
                    : undefined,
                inputError: sufficientBalance ? undefined : 'Insufficient WETH balance'
            };
        }
        else {
            return NOT_APPLICABLE;
        }
    }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction]);
}
exports["default"] = useWrapCallback;
