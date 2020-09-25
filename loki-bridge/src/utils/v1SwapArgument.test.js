"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sdk_1 = require("@uniswap/sdk");
var constants_1 = require("../constants");
var V1_1 = require("../data/V1");
var v1SwapArguments_1 = __importDefault(require("./v1SwapArguments"));
describe('v1SwapArguments', function () {
    var USDC_WETH = new V1_1.MockV1Pair('1000000', new sdk_1.TokenAmount(constants_1.USDC, '1000000'));
    var DAI_WETH = new V1_1.MockV1Pair('1000000', new sdk_1.TokenAmount(constants_1.DAI, '1000000'));
    // just some random address
    var TEST_RECIPIENT_ADDRESS = USDC_WETH.liquidityToken.address;
    function checkDeadline(hex, ttl) {
        if (typeof hex !== 'string')
            throw new Error('invalid hex');
        var now = new Date().getTime() / 1000;
        expect(parseInt(hex) - now).toBeGreaterThanOrEqual(ttl - 3);
        expect(parseInt(hex) - now).toBeLessThanOrEqual(ttl + 3);
    }
    it('exact eth to token', function () {
        var trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH], sdk_1.ETHER), sdk_1.CurrencyAmount.ether('100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('ethToTokenTransferInput');
        expect(result.args[0]).toEqual('0x62');
        expect(result.args[2]).toEqual(TEST_RECIPIENT_ADDRESS);
        checkDeadline(result.args[1], 20 * 60);
        expect(result.value).toEqual('0x64');
    });
    it('exact token to eth', function () {
        var trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH], constants_1.USDC, sdk_1.ETHER), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToEthTransferInput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x62');
        checkDeadline(result.args[2], 20 * 60);
        expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x0');
    });
    it('exact token to token', function () {
        var trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH, DAI_WETH], constants_1.USDC), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToTokenTransferInput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x61');
        expect(result.args[2]).toEqual('0x1');
        expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.args[5]).toEqual(constants_1.DAI.address);
        checkDeadline(result.args[3], 20 * 60);
        expect(result.value).toEqual('0x0');
    });
    it('eth to exact token', function () {
        var trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH], sdk_1.ETHER), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('ethToTokenTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        checkDeadline(result.args[1], 20 * 60);
        expect(result.args[2]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x66');
    });
    it('token to exact eth', function () {
        var trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH], constants_1.USDC, sdk_1.ETHER), sdk_1.CurrencyAmount.ether('100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToEthTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x66');
        checkDeadline(result.args[2], 20 * 60);
        expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x0');
    });
    it('token to exact token', function () {
        var trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH, DAI_WETH], constants_1.USDC), new sdk_1.TokenAmount(constants_1.DAI, '100'));
        var result = v1SwapArguments_1["default"](trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            ttl: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToTokenTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x67');
        expect(result.args[2]).toEqual("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        checkDeadline(result.args[3], 20 * 60);
        expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.args[5]).toEqual(constants_1.DAI.address);
        expect(result.value).toEqual('0x0');
    });
});
