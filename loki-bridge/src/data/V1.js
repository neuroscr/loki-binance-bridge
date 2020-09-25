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
exports.__esModule = true;
exports.isTradeBetter = exports.useV1TradeExchangeAddress = exports.getTradeVersion = exports.useV1Trade = exports.useUserHasLiquidityInAllTokens = exports.useAllTokenV1Exchanges = exports.MockV1Pair = exports.useV1ExchangeAddress = void 0;
var constants_1 = require("@ethersproject/constants");
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var hooks_1 = require("../hooks");
var Tokens_1 = require("../hooks/Tokens");
var useContract_1 = require("../hooks/useContract");
var useToggledVersion_1 = require("../hooks/useToggledVersion");
var hooks_2 = require("../state/multicall/hooks");
var hooks_3 = require("../state/wallet/hooks");
function useV1ExchangeAddress(tokenAddress) {
    var _a, _b;
    var contract = useContract_1.useV1FactoryContract();
    var inputs = react_1.useMemo(function () { return [tokenAddress]; }, [tokenAddress]);
    return (_b = (_a = hooks_2.useSingleCallResult(contract, 'getExchange', inputs)) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
}
exports.useV1ExchangeAddress = useV1ExchangeAddress;
var MockV1Pair = /** @class */ (function (_super) {
    __extends(MockV1Pair, _super);
    function MockV1Pair(etherAmount, tokenAmount) {
        return _super.call(this, tokenAmount, new sdk_1.TokenAmount(sdk_1.WETH[tokenAmount.token.chainId], etherAmount)) || this;
    }
    return MockV1Pair;
}(sdk_1.Pair));
exports.MockV1Pair = MockV1Pair;
function useMockV1Pair(inputCurrency) {
    var token = inputCurrency instanceof sdk_1.Token ? inputCurrency : undefined;
    var isWETH = Boolean(token && token.equals(sdk_1.WETH[token.chainId]));
    var v1PairAddress = useV1ExchangeAddress(isWETH ? undefined : token === null || token === void 0 ? void 0 : token.address);
    var tokenBalance = hooks_3.useTokenBalance(v1PairAddress, token);
    var ETHBalance = hooks_3.useETHBalances([v1PairAddress])[v1PairAddress !== null && v1PairAddress !== void 0 ? v1PairAddress : ''];
    return react_1.useMemo(function () {
        return token && tokenBalance && ETHBalance && inputCurrency ? new MockV1Pair(ETHBalance.raw, tokenBalance) : undefined;
    }, [ETHBalance, inputCurrency, token, tokenBalance]);
}
// returns all v1 exchange addresses in the user's token list
function useAllTokenV1Exchanges() {
    var allTokens = Tokens_1.useAllTokens();
    var factory = useContract_1.useV1FactoryContract();
    var args = react_1.useMemo(function () { return Object.keys(allTokens).map(function (tokenAddress) { return [tokenAddress]; }); }, [allTokens]);
    var data = hooks_2.useSingleContractMultipleData(factory, 'getExchange', args, hooks_2.NEVER_RELOAD);
    return react_1.useMemo(function () { var _a; return (_a = data === null || data === void 0 ? void 0 : data.reduce(function (memo, _a, ix) {
        var result = _a.result;
        if ((result === null || result === void 0 ? void 0 : result[0]) && result[0] !== constants_1.AddressZero) {
            memo[result[0]] = allTokens[args[ix][0]];
        }
        return memo;
    }, {})) !== null && _a !== void 0 ? _a : {}; }, [allTokens, args, data]);
}
exports.useAllTokenV1Exchanges = useAllTokenV1Exchanges;
// returns whether any of the tokens in the user's token list have liquidity on v1
function useUserHasLiquidityInAllTokens() {
    var _a = hooks_1.useActiveWeb3React(), account = _a.account, chainId = _a.chainId;
    var exchanges = useAllTokenV1Exchanges();
    var v1ExchangeLiquidityTokens = react_1.useMemo(function () {
        return chainId ? Object.keys(exchanges).map(function (address) { return new sdk_1.Token(chainId, address, 18, 'UNI-V1', 'Uniswap V1'); }) : [];
    }, [chainId, exchanges]);
    var balances = hooks_3.useTokenBalances(account !== null && account !== void 0 ? account : undefined, v1ExchangeLiquidityTokens);
    return react_1.useMemo(function () {
        return Object.keys(balances).some(function (tokenAddress) {
            var _a;
            var b = (_a = balances[tokenAddress]) === null || _a === void 0 ? void 0 : _a.raw;
            return b && sdk_1.JSBI.greaterThan(b, sdk_1.JSBI.BigInt(0));
        });
    }, [balances]);
}
exports.useUserHasLiquidityInAllTokens = useUserHasLiquidityInAllTokens;
/**
 * Returns the trade to execute on V1 to go between input and output token
 */
function useV1Trade(isExactIn, inputCurrency, outputCurrency, exactAmount) {
    // get the mock v1 pairs
    var inputPair = useMockV1Pair(inputCurrency);
    var outputPair = useMockV1Pair(outputCurrency);
    var inputIsETH = inputCurrency === sdk_1.ETHER;
    var outputIsETH = outputCurrency === sdk_1.ETHER;
    // construct a direct or through ETH v1 route
    var pairs = [];
    if (inputIsETH && outputPair) {
        pairs = [outputPair];
    }
    else if (outputIsETH && inputPair) {
        pairs = [inputPair];
    }
    // if neither are ETH, it's token-to-token (if they both exist)
    else if (inputPair && outputPair) {
        pairs = [inputPair, outputPair];
    }
    var route = inputCurrency && pairs && pairs.length > 0 && new sdk_1.Route(pairs, inputCurrency, outputCurrency);
    var v1Trade;
    try {
        v1Trade =
            route && exactAmount
                ? new sdk_1.Trade(route, exactAmount, isExactIn ? sdk_1.TradeType.EXACT_INPUT : sdk_1.TradeType.EXACT_OUTPUT)
                : undefined;
    }
    catch (error) {
        console.debug('Failed to create V1 trade', error);
    }
    return v1Trade;
}
exports.useV1Trade = useV1Trade;
function getTradeVersion(trade) {
    var _a, _b;
    var isV1 = (_b = (_a = trade === null || trade === void 0 ? void 0 : trade.route) === null || _a === void 0 ? void 0 : _a.pairs) === null || _b === void 0 ? void 0 : _b.some(function (pair) { return pair instanceof MockV1Pair; });
    if (isV1)
        return useToggledVersion_1.Version.v1;
    if (isV1 === false)
        return useToggledVersion_1.Version.v2;
    return undefined;
}
exports.getTradeVersion = getTradeVersion;
// returns the v1 exchange against which a trade should be executed
function useV1TradeExchangeAddress(trade) {
    var tokenAddress = react_1.useMemo(function () {
        if (!trade)
            return undefined;
        var isV1 = getTradeVersion(trade) === useToggledVersion_1.Version.v1;
        if (!isV1)
            return undefined;
        return trade.inputAmount instanceof sdk_1.TokenAmount
            ? trade.inputAmount.token.address
            : trade.outputAmount instanceof sdk_1.TokenAmount
                ? trade.outputAmount.token.address
                : undefined;
    }, [trade]);
    return useV1ExchangeAddress(tokenAddress);
}
exports.useV1TradeExchangeAddress = useV1TradeExchangeAddress;
var ZERO_PERCENT = new sdk_1.Percent('0');
var ONE_HUNDRED_PERCENT = new sdk_1.Percent('1');
// returns whether tradeB is better than tradeA by at least a threshold percentage amount
function isTradeBetter(tradeA, tradeB, minimumDelta) {
    if (minimumDelta === void 0) { minimumDelta = ZERO_PERCENT; }
    if (tradeA && !tradeB)
        return false;
    if (tradeB && !tradeA)
        return true;
    if (!tradeA || !tradeB)
        return undefined;
    if (tradeA.tradeType !== tradeB.tradeType ||
        !sdk_1.currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
        !sdk_1.currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)) {
        throw new Error('Trades are not comparable');
    }
    if (minimumDelta.equalTo(ZERO_PERCENT)) {
        return tradeA.executionPrice.lessThan(tradeB.executionPrice);
    }
    else {
        return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice);
    }
}
exports.isTradeBetter = isTradeBetter;
