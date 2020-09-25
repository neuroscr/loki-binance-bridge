"use strict";
exports.__esModule = true;
var sdk_1 = require("@uniswap/sdk");
var prices_1 = require("./prices");
describe('prices', function () {
    var token1 = new sdk_1.Token(sdk_1.ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18);
    var token2 = new sdk_1.Token(sdk_1.ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18);
    var token3 = new sdk_1.Token(sdk_1.ChainId.MAINNET, '0x0000000000000000000000000000000000000003', 18);
    var pair12 = new sdk_1.Pair(new sdk_1.TokenAmount(token1, sdk_1.JSBI.BigInt(10000)), new sdk_1.TokenAmount(token2, sdk_1.JSBI.BigInt(20000)));
    var pair23 = new sdk_1.Pair(new sdk_1.TokenAmount(token2, sdk_1.JSBI.BigInt(20000)), new sdk_1.TokenAmount(token3, sdk_1.JSBI.BigInt(30000)));
    describe('computeTradePriceBreakdown', function () {
        it('returns undefined for undefined', function () {
            expect(prices_1.computeTradePriceBreakdown(undefined)).toEqual({
                priceImpactWithoutFee: undefined,
                realizedLPFee: undefined
            });
        });
        it('correct realized lp fee for single hop', function () {
            expect(prices_1.computeTradePriceBreakdown(new sdk_1.Trade(new sdk_1.Route([pair12], token1), new sdk_1.TokenAmount(token1, sdk_1.JSBI.BigInt(1000)), sdk_1.TradeType.EXACT_INPUT)).realizedLPFee).toEqual(new sdk_1.TokenAmount(token1, sdk_1.JSBI.BigInt(3)));
        });
        it('correct realized lp fee for double hop', function () {
            expect(prices_1.computeTradePriceBreakdown(new sdk_1.Trade(new sdk_1.Route([pair12, pair23], token1), new sdk_1.TokenAmount(token1, sdk_1.JSBI.BigInt(1000)), sdk_1.TradeType.EXACT_INPUT)).realizedLPFee).toEqual(new sdk_1.TokenAmount(token1, sdk_1.JSBI.BigInt(5)));
        });
    });
});
