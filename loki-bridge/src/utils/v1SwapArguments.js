"use strict";
exports.__esModule = true;
var constants_1 = require("@ethersproject/constants");
var sdk_1 = require("@uniswap/sdk");
var V1_1 = require("../data/V1");
var useToggledVersion_1 = require("../hooks/useToggledVersion");
function toHex(currencyAmount) {
    return "0x" + currencyAmount.raw.toString(16);
}
function deadlineFromNow(ttl) {
    return "0x" + (Math.floor(new Date().getTime() / 1000) + ttl).toString(16);
}
/**
 * Get the arguments to make for a swap
 * @param trade trade to get v1 arguments for swapping
 * @param options options for swapping
 */
function v1SwapArguments(trade, options) {
    if (V1_1.getTradeVersion(trade) !== useToggledVersion_1.Version.v1) {
        throw new Error('invalid trade version');
    }
    if (trade.route.pairs.length > 2) {
        throw new Error('too many pairs');
    }
    var isExactIn = trade.tradeType === sdk_1.TradeType.EXACT_INPUT;
    var inputETH = trade.inputAmount.currency === sdk_1.ETHER;
    var outputETH = trade.outputAmount.currency === sdk_1.ETHER;
    if (inputETH && outputETH)
        throw new Error('ETHER to ETHER');
    var minimumAmountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    var maximumAmountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var deadline = deadlineFromNow(options.ttl);
    if (isExactIn) {
        if (inputETH) {
            return {
                methodName: 'ethToTokenTransferInput',
                args: [minimumAmountOut, deadline, options.recipient],
                value: maximumAmountIn
            };
        }
        else if (outputETH) {
            return {
                methodName: 'tokenToEthTransferInput',
                args: [maximumAmountIn, minimumAmountOut, deadline, options.recipient],
                value: '0x0'
            };
        }
        else {
            var outputToken = trade.outputAmount.currency;
            // should never happen, needed for type check
            if (!(outputToken instanceof sdk_1.Token)) {
                throw new Error('token to token');
            }
            return {
                methodName: 'tokenToTokenTransferInput',
                args: [maximumAmountIn, minimumAmountOut, '0x1', deadline, options.recipient, outputToken.address],
                value: '0x0'
            };
        }
    }
    else {
        if (inputETH) {
            return {
                methodName: 'ethToTokenTransferOutput',
                args: [minimumAmountOut, deadline, options.recipient],
                value: maximumAmountIn
            };
        }
        else if (outputETH) {
            return {
                methodName: 'tokenToEthTransferOutput',
                args: [minimumAmountOut, maximumAmountIn, deadline, options.recipient],
                value: '0x0'
            };
        }
        else {
            var output = trade.outputAmount.currency;
            if (!(output instanceof sdk_1.Token)) {
                throw new Error('invalid output amount currency');
            }
            return {
                methodName: 'tokenToTokenTransferOutput',
                args: [
                    minimumAmountOut,
                    maximumAmountIn,
                    constants_1.MaxUint256.toHexString(),
                    deadline,
                    options.recipient,
                    output.address
                ],
                value: '0x0'
            };
        }
    }
}
exports["default"] = v1SwapArguments;
