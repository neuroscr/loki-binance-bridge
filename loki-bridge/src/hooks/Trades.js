"use strict";
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
exports.useTradeExactOut = exports.useTradeExactIn = void 0;
var sdk_1 = require("@uniswap/sdk");
var lodash_flatmap_1 = __importDefault(require("lodash.flatmap"));
var react_1 = require("react");
var constants_1 = require("../constants");
var Reserves_1 = require("../data/Reserves");
var wrappedCurrency_1 = require("../utils/wrappedCurrency");
var index_1 = require("./index");
function useAllCommonPairs(currencyA, currencyB) {
    var chainId = index_1.useActiveWeb3React().chainId;
    var bases = chainId ? constants_1.BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];
    var _a = chainId
        ? [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)]
        : [undefined, undefined], tokenA = _a[0], tokenB = _a[1];
    var basePairs = react_1.useMemo(function () {
        return lodash_flatmap_1["default"](bases, function (base) { return bases.map(function (otherBase) { return [base, otherBase]; }); }).filter(function (_a) {
            var t0 = _a[0], t1 = _a[1];
            return t0.address !== t1.address;
        });
    }, [bases]);
    var allPairCombinations = react_1.useMemo(function () {
        return tokenA && tokenB
            ? __spreadArrays([
                // the direct pair
                [tokenA, tokenB]
            ], bases.map(function (base) { return [tokenA, base]; }), bases.map(function (base) { return [tokenB, base]; }), basePairs).filter(function (tokens) { return Boolean(tokens[0] && tokens[1]); })
                .filter(function (_a) {
                var t0 = _a[0], t1 = _a[1];
                return t0.address !== t1.address;
            })
                .filter(function (_a) {
                var tokenA = _a[0], tokenB = _a[1];
                if (!chainId)
                    return true;
                var customBases = constants_1.CUSTOM_BASES[chainId];
                if (!customBases)
                    return true;
                var customBasesA = customBases[tokenA.address];
                var customBasesB = customBases[tokenB.address];
                if (!customBasesA && !customBasesB)
                    return true;
                if (customBasesA && !customBasesA.find(function (base) { return tokenB.equals(base); }))
                    return false;
                if (customBasesB && !customBasesB.find(function (base) { return tokenA.equals(base); }))
                    return false;
                return true;
            })
            : [];
    }, [tokenA, tokenB, bases, basePairs, chainId]);
    var allPairs = Reserves_1.usePairs(allPairCombinations);
    // only pass along valid pairs, non-duplicated pairs
    return react_1.useMemo(function () {
        return Object.values(allPairs
            // filter out invalid pairs
            .filter(function (result) { return Boolean(result[0] === Reserves_1.PairState.EXISTS && result[1]); })
            // filter out duplicated pairs
            .reduce(function (memo, _a) {
            var _b;
            var curr = _a[1];
            memo[curr.liquidityToken.address] = (_b = memo[curr.liquidityToken.address]) !== null && _b !== void 0 ? _b : curr;
            return memo;
        }, {}));
    }, [allPairs]);
}
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
function useTradeExactIn(currencyAmountIn, currencyOut) {
    var allowedPairs = useAllCommonPairs(currencyAmountIn === null || currencyAmountIn === void 0 ? void 0 : currencyAmountIn.currency, currencyOut);
    return react_1.useMemo(function () {
        var _a;
        if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
            return ((_a = sdk_1.Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 3, maxNumResults: 1 })[0]) !== null && _a !== void 0 ? _a : null);
        }
        return null;
    }, [allowedPairs, currencyAmountIn, currencyOut]);
}
exports.useTradeExactIn = useTradeExactIn;
/**
 * Returns the best trade for the token in to the exact amount of token out
 */
function useTradeExactOut(currencyIn, currencyAmountOut) {
    var allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut === null || currencyAmountOut === void 0 ? void 0 : currencyAmountOut.currency);
    return react_1.useMemo(function () {
        var _a;
        if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
            return ((_a = sdk_1.Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 3, maxNumResults: 1 })[0]) !== null && _a !== void 0 ? _a : null);
        }
        return null;
    }, [allowedPairs, currencyIn, currencyAmountOut]);
}
exports.useTradeExactOut = useTradeExactOut;
