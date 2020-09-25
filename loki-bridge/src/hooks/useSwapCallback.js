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
exports.useSwapCallback = exports.SwapCallbackState = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var constants_1 = require("../constants");
var V1_1 = require("../data/V1");
var hooks_1 = require("../state/transactions/hooks");
var utils_1 = require("../utils");
var isZero_1 = __importDefault(require("../utils/isZero"));
var v1SwapArguments_1 = __importDefault(require("../utils/v1SwapArguments"));
var index_1 = require("./index");
var useContract_1 = require("./useContract");
var useENS_1 = __importDefault(require("./useENS"));
var useToggledVersion_1 = require("./useToggledVersion");
var SwapCallbackState;
(function (SwapCallbackState) {
    SwapCallbackState[SwapCallbackState["INVALID"] = 0] = "INVALID";
    SwapCallbackState[SwapCallbackState["LOADING"] = 1] = "LOADING";
    SwapCallbackState[SwapCallbackState["VALID"] = 2] = "VALID";
})(SwapCallbackState = exports.SwapCallbackState || (exports.SwapCallbackState = {}));
/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(trade, // trade to execute, required
allowedSlippage, // in bips
deadline, // in seconds from now
recipientAddressOrName // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
) {
    if (allowedSlippage === void 0) { allowedSlippage = constants_1.INITIAL_ALLOWED_SLIPPAGE; }
    if (deadline === void 0) { deadline = constants_1.DEFAULT_DEADLINE_FROM_NOW; }
    var _a = index_1.useActiveWeb3React(), account = _a.account, chainId = _a.chainId, library = _a.library;
    var recipientAddress = useENS_1["default"](recipientAddressOrName).address;
    var recipient = recipientAddressOrName === null ? account : recipientAddress;
    var v1Exchange = useContract_1.useV1ExchangeContract(V1_1.useV1TradeExchangeAddress(trade), true);
    return react_1.useMemo(function () {
        var tradeVersion = V1_1.getTradeVersion(trade);
        if (!trade || !recipient || !library || !account || !tradeVersion || !chainId)
            return [];
        var contract = tradeVersion === useToggledVersion_1.Version.v2 ? utils_1.getRouterContract(chainId, library, account) : v1Exchange;
        if (!contract) {
            return [];
        }
        var swapMethods = [];
        switch (tradeVersion) {
            case useToggledVersion_1.Version.v2:
                swapMethods.push(sdk_1.Router.swapCallParameters(trade, {
                    feeOnTransfer: false,
                    allowedSlippage: new sdk_1.Percent(sdk_1.JSBI.BigInt(allowedSlippage), constants_1.BIPS_BASE),
                    recipient: recipient,
                    ttl: deadline
                }));
                if (trade.tradeType === sdk_1.TradeType.EXACT_INPUT) {
                    swapMethods.push(sdk_1.Router.swapCallParameters(trade, {
                        feeOnTransfer: true,
                        allowedSlippage: new sdk_1.Percent(sdk_1.JSBI.BigInt(allowedSlippage), constants_1.BIPS_BASE),
                        recipient: recipient,
                        ttl: deadline
                    }));
                }
                break;
            case useToggledVersion_1.Version.v1:
                swapMethods.push(v1SwapArguments_1["default"](trade, {
                    allowedSlippage: new sdk_1.Percent(sdk_1.JSBI.BigInt(allowedSlippage), constants_1.BIPS_BASE),
                    recipient: recipient,
                    ttl: deadline
                }));
                break;
        }
        return swapMethods.map(function (parameters) { return ({ parameters: parameters, contract: contract }); });
    }, [account, allowedSlippage, chainId, deadline, library, recipient, trade, v1Exchange]);
}
// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
function useSwapCallback(trade, // trade to execute, required
allowedSlippage, // in bips
deadline, // in seconds from now
recipientAddressOrName // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
) {
    if (allowedSlippage === void 0) { allowedSlippage = constants_1.INITIAL_ALLOWED_SLIPPAGE; }
    if (deadline === void 0) { deadline = constants_1.DEFAULT_DEADLINE_FROM_NOW; }
    var _a = index_1.useActiveWeb3React(), account = _a.account, chainId = _a.chainId, library = _a.library;
    var swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline, recipientAddressOrName);
    var addTransaction = hooks_1.useTransactionAdder();
    var recipientAddress = useENS_1["default"](recipientAddressOrName).address;
    var recipient = recipientAddressOrName === null ? account : recipientAddress;
    return react_1.useMemo(function () {
        if (!trade || !library || !account || !chainId) {
            return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' };
        }
        if (!recipient) {
            if (recipientAddressOrName !== null) {
                return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' };
            }
            else {
                return { state: SwapCallbackState.LOADING, callback: null, error: null };
            }
        }
        var tradeVersion = V1_1.getTradeVersion(trade);
        return {
            state: SwapCallbackState.VALID,
            callback: function onSwap() {
                return __awaiter(this, void 0, void 0, function () {
                    var estimatedCalls, successfulEstimation, errorCalls, _a, contract, _b, methodName, args, value, gasEstimate;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, Promise.all(swapCalls.map(function (call) {
                                    var _a;
                                    var _b = call.parameters, methodName = _b.methodName, args = _b.args, value = _b.value, contract = call.contract;
                                    var options = !value || isZero_1["default"](value) ? {} : { value: value };
                                    return (_a = contract.estimateGas)[methodName].apply(_a, __spreadArrays(args, [options])).then(function (gasEstimate) {
                                        return {
                                            call: call,
                                            gasEstimate: gasEstimate
                                        };
                                    })["catch"](function (gasError) {
                                        var _a;
                                        console.debug('Gas estimate failed, trying eth_call to extract error', call);
                                        return (_a = contract.callStatic)[methodName].apply(_a, __spreadArrays(args, [options])).then(function (result) {
                                            console.debug('Unexpected successful call after failed estimate gas', call, gasError, result);
                                            return { call: call, error: new Error('Unexpected issue with estimating the gas. Please try again.') };
                                        })["catch"](function (callError) {
                                            console.debug('Call threw error', call, callError);
                                            var errorMessage;
                                            switch (callError.reason) {
                                                case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                                                case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                                                    errorMessage =
                                                        'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.';
                                                    break;
                                                default:
                                                    errorMessage = "The transaction cannot succeed due to error: " + callError.reason + ". This is probably an issue with one of the tokens you are swapping.";
                                            }
                                            return { call: call, error: new Error(errorMessage) };
                                        });
                                    });
                                }))
                                // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
                            ];
                            case 1:
                                estimatedCalls = _c.sent();
                                successfulEstimation = estimatedCalls.find(function (el, ix, list) {
                                    return 'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]);
                                });
                                if (!successfulEstimation) {
                                    errorCalls = estimatedCalls.filter(function (call) { return 'error' in call; });
                                    if (errorCalls.length > 0)
                                        throw errorCalls[errorCalls.length - 1].error;
                                    throw new Error('Unexpected error. Please contact support: none of the calls threw an error');
                                }
                                _a = successfulEstimation.call, contract = _a.contract, _b = _a.parameters, methodName = _b.methodName, args = _b.args, value = _b.value, gasEstimate = successfulEstimation.gasEstimate;
                                return [2 /*return*/, contract[methodName].apply(contract, __spreadArrays(args, [__assign({ gasLimit: utils_1.calculateGasMargin(gasEstimate) }, (value && !isZero_1["default"](value) ? { value: value, from: account } : { from: account }))])).then(function (response) {
                                        var inputSymbol = trade.inputAmount.currency.symbol;
                                        var outputSymbol = trade.outputAmount.currency.symbol;
                                        var inputAmount = trade.inputAmount.toSignificant(3);
                                        var outputAmount = trade.outputAmount.toSignificant(3);
                                        var base = "Swap " + inputAmount + " " + inputSymbol + " for " + outputAmount + " " + outputSymbol;
                                        var withRecipient = recipient === account
                                            ? base
                                            : base + " to " + (recipientAddressOrName && utils_1.isAddress(recipientAddressOrName)
                                                ? utils_1.shortenAddress(recipientAddressOrName)
                                                : recipientAddressOrName);
                                        var withVersion = tradeVersion === useToggledVersion_1.Version.v2 ? withRecipient : withRecipient + " on " + tradeVersion.toUpperCase();
                                        addTransaction(response, {
                                            summary: withVersion
                                        });
                                        return response.hash;
                                    })["catch"](function (error) {
                                        // if the user rejected the tx, pass this along
                                        if ((error === null || error === void 0 ? void 0 : error.code) === 4001) {
                                            throw new Error('Transaction rejected.');
                                        }
                                        else {
                                            // otherwise, the error was unexpected and we need to convey that
                                            console.error("Swap failed", error, methodName, args, value);
                                            throw new Error("Swap failed: " + error.message);
                                        }
                                    })];
                        }
                    });
                });
            },
            error: null
        };
    }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction]);
}
exports.useSwapCallback = useSwapCallback;
