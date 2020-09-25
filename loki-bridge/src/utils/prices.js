"use strict";
exports.__esModule = true;
exports.formatExecutionPrice = exports.warningSeverity = exports.computeSlippageAdjustedAmounts = exports.computeTradePriceBreakdown = void 0;
var constants_1 = require("../constants");
var sdk_1 = require("@uniswap/sdk");
var constants_2 = require("../constants");
var actions_1 = require("../state/swap/actions");
var index_1 = require("./index");
var BASE_FEE = new sdk_1.Percent(sdk_1.JSBI.BigInt(30), sdk_1.JSBI.BigInt(10000));
var ONE_HUNDRED_PERCENT = new sdk_1.Percent(sdk_1.JSBI.BigInt(10000), sdk_1.JSBI.BigInt(10000));
var INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);
// computes price breakdown for the trade
function computeTradePriceBreakdown(trade) {
    // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
    var realizedLPFee = !trade
        ? undefined
        : ONE_HUNDRED_PERCENT.subtract(trade.route.pairs.reduce(function (currentFee) { return currentFee.multiply(INPUT_FRACTION_AFTER_FEE); }, ONE_HUNDRED_PERCENT));
    // remove lp fees from price impact
    var priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined;
    // the x*y=k impact
    var priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
        ? new sdk_1.Percent(priceImpactWithoutFeeFraction === null || priceImpactWithoutFeeFraction === void 0 ? void 0 : priceImpactWithoutFeeFraction.numerator, priceImpactWithoutFeeFraction === null || priceImpactWithoutFeeFraction === void 0 ? void 0 : priceImpactWithoutFeeFraction.denominator)
        : undefined;
    // the amount of the input that accrues to LPs
    var realizedLPFeeAmount = realizedLPFee &&
        trade &&
        (trade.inputAmount instanceof sdk_1.TokenAmount
            ? new sdk_1.TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
            : sdk_1.CurrencyAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient));
    return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount };
}
exports.computeTradePriceBreakdown = computeTradePriceBreakdown;
// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
function computeSlippageAdjustedAmounts(trade, allowedSlippage) {
    var _a;
    var pct = index_1.basisPointsToPercent(allowedSlippage);
    return _a = {},
        _a[actions_1.Field.INPUT] = trade === null || trade === void 0 ? void 0 : trade.maximumAmountIn(pct),
        _a[actions_1.Field.OUTPUT] = trade === null || trade === void 0 ? void 0 : trade.minimumAmountOut(pct),
        _a;
}
exports.computeSlippageAdjustedAmounts = computeSlippageAdjustedAmounts;
function warningSeverity(priceImpact) {
    if (!(priceImpact === null || priceImpact === void 0 ? void 0 : priceImpact.lessThan(constants_1.BLOCKED_PRICE_IMPACT_NON_EXPERT)))
        return 4;
    if (!(priceImpact === null || priceImpact === void 0 ? void 0 : priceImpact.lessThan(constants_2.ALLOWED_PRICE_IMPACT_HIGH)))
        return 3;
    if (!(priceImpact === null || priceImpact === void 0 ? void 0 : priceImpact.lessThan(constants_2.ALLOWED_PRICE_IMPACT_MEDIUM)))
        return 2;
    if (!(priceImpact === null || priceImpact === void 0 ? void 0 : priceImpact.lessThan(constants_2.ALLOWED_PRICE_IMPACT_LOW)))
        return 1;
    return 0;
}
exports.warningSeverity = warningSeverity;
function formatExecutionPrice(trade, inverted) {
    if (!trade) {
        return '';
    }
    return inverted
        ? trade.executionPrice.invert().toSignificant(6) + " " + trade.inputAmount.currency.symbol + " / " + trade.outputAmount.currency.symbol
        : trade.executionPrice.toSignificant(6) + " " + trade.outputAmount.currency.symbol + " / " + trade.inputAmount.currency.symbol;
}
exports.formatExecutionPrice = formatExecutionPrice;
