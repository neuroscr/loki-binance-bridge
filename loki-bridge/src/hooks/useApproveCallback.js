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
exports.useApproveCallbackFromTrade = exports.useApproveCallback = exports.ApprovalState = void 0;
var constants_1 = require("@ethersproject/constants");
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var constants_2 = require("../constants");
var Allowances_1 = require("../data/Allowances");
var V1_1 = require("../data/V1");
var actions_1 = require("../state/swap/actions");
var hooks_1 = require("../state/transactions/hooks");
var prices_1 = require("../utils/prices");
var utils_1 = require("../utils");
var useContract_1 = require("./useContract");
var index_1 = require("./index");
var useToggledVersion_1 = require("./useToggledVersion");
var ApprovalState;
(function (ApprovalState) {
    ApprovalState[ApprovalState["UNKNOWN"] = 0] = "UNKNOWN";
    ApprovalState[ApprovalState["NOT_APPROVED"] = 1] = "NOT_APPROVED";
    ApprovalState[ApprovalState["PENDING"] = 2] = "PENDING";
    ApprovalState[ApprovalState["APPROVED"] = 3] = "APPROVED";
})(ApprovalState = exports.ApprovalState || (exports.ApprovalState = {}));
// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveCallback(amountToApprove, spender) {
    var _this = this;
    var account = index_1.useActiveWeb3React().account;
    var token = amountToApprove instanceof sdk_1.TokenAmount ? amountToApprove.token : undefined;
    var currentAllowance = Allowances_1.useTokenAllowance(token, account !== null && account !== void 0 ? account : undefined, spender);
    var pendingApproval = hooks_1.useHasPendingApproval(token === null || token === void 0 ? void 0 : token.address, spender);
    // check the current approval status
    var approvalState = react_1.useMemo(function () {
        if (!amountToApprove || !spender)
            return ApprovalState.UNKNOWN;
        if (amountToApprove.currency === sdk_1.ETHER)
            return ApprovalState.APPROVED;
        // we might not have enough data to know whether or not we need to approve
        if (!currentAllowance)
            return ApprovalState.UNKNOWN;
        // amountToApprove will be defined if currentAllowance is
        return currentAllowance.lessThan(amountToApprove)
            ? pendingApproval
                ? ApprovalState.PENDING
                : ApprovalState.NOT_APPROVED
            : ApprovalState.APPROVED;
    }, [amountToApprove, currentAllowance, pendingApproval, spender]);
    var tokenContract = useContract_1.useTokenContract(token === null || token === void 0 ? void 0 : token.address);
    var addTransaction = hooks_1.useTransactionAdder();
    var approve = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var useExact, estimatedGas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (approvalState !== ApprovalState.NOT_APPROVED) {
                        console.error('approve was called unnecessarily');
                        return [2 /*return*/];
                    }
                    if (!token) {
                        console.error('no token');
                        return [2 /*return*/];
                    }
                    if (!tokenContract) {
                        console.error('tokenContract is null');
                        return [2 /*return*/];
                    }
                    if (!amountToApprove) {
                        console.error('missing amount to approve');
                        return [2 /*return*/];
                    }
                    if (!spender) {
                        console.error('no spender');
                        return [2 /*return*/];
                    }
                    useExact = false;
                    return [4 /*yield*/, tokenContract.estimateGas.approve(spender, constants_1.MaxUint256)["catch"](function () {
                            // general fallback for tokens who restrict approval amounts
                            useExact = true;
                            return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString());
                        })];
                case 1:
                    estimatedGas = _a.sent();
                    return [2 /*return*/, tokenContract
                            .approve(spender, useExact ? amountToApprove.raw.toString() : constants_1.MaxUint256, {
                            gasLimit: utils_1.calculateGasMargin(estimatedGas)
                        })
                            .then(function (response) {
                            addTransaction(response, {
                                summary: 'Approve ' + amountToApprove.currency.symbol,
                                approval: { tokenAddress: token.address, spender: spender }
                            });
                        })["catch"](function (error) {
                            console.debug('Failed to approve token', error);
                            throw error;
                        })];
            }
        });
    }); }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction]);
    return [approvalState, approve];
}
exports.useApproveCallback = useApproveCallback;
// wraps useApproveCallback in the context of a swap
function useApproveCallbackFromTrade(trade, allowedSlippage) {
    if (allowedSlippage === void 0) { allowedSlippage = 0; }
    var amountToApprove = react_1.useMemo(function () { return (trade ? prices_1.computeSlippageAdjustedAmounts(trade, allowedSlippage)[actions_1.Field.INPUT] : undefined); }, [trade, allowedSlippage]);
    var tradeIsV1 = V1_1.getTradeVersion(trade) === useToggledVersion_1.Version.v1;
    var v1ExchangeAddress = V1_1.useV1TradeExchangeAddress(trade);
    return useApproveCallback(amountToApprove, tradeIsV1 ? v1ExchangeAddress : constants_2.ROUTER_ADDRESS);
}
exports.useApproveCallbackFromTrade = useApproveCallbackFromTrade;
