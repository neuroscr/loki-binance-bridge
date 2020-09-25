"use strict";
exports.__esModule = true;
exports.maxAmountSpend = void 0;
var sdk_1 = require("@uniswap/sdk");
var constants_1 = require("../constants");
/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
function maxAmountSpend(currencyAmount) {
    if (!currencyAmount)
        return undefined;
    if (currencyAmount.currency === sdk_1.ETHER) {
        if (sdk_1.JSBI.greaterThan(currencyAmount.raw, constants_1.MIN_ETH)) {
            return sdk_1.CurrencyAmount.ether(sdk_1.JSBI.subtract(currencyAmount.raw, constants_1.MIN_ETH));
        }
        else {
            return sdk_1.CurrencyAmount.ether(sdk_1.JSBI.BigInt(0));
        }
    }
    return currencyAmount;
}
exports.maxAmountSpend = maxAmountSpend;
