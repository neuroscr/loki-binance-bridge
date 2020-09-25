"use strict";
exports.__esModule = true;
exports.usePair = exports.usePairs = exports.PairState = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
var abi_1 = require("@ethersproject/abi");
var hooks_1 = require("../hooks");
var hooks_2 = require("../state/multicall/hooks");
var wrappedCurrency_1 = require("../utils/wrappedCurrency");
var PAIR_INTERFACE = new abi_1.Interface(IUniswapV2Pair_json_1.abi);
var PairState;
(function (PairState) {
    PairState[PairState["LOADING"] = 0] = "LOADING";
    PairState[PairState["NOT_EXISTS"] = 1] = "NOT_EXISTS";
    PairState[PairState["EXISTS"] = 2] = "EXISTS";
    PairState[PairState["INVALID"] = 3] = "INVALID";
})(PairState = exports.PairState || (exports.PairState = {}));
function usePairs(currencies) {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var tokens = react_1.useMemo(function () {
        return currencies.map(function (_a) {
            var currencyA = _a[0], currencyB = _a[1];
            return [
                wrappedCurrency_1.wrappedCurrency(currencyA, chainId),
                wrappedCurrency_1.wrappedCurrency(currencyB, chainId)
            ];
        });
    }, [chainId, currencies]);
    var pairAddresses = react_1.useMemo(function () {
        return tokens.map(function (_a) {
            var tokenA = _a[0], tokenB = _a[1];
            return tokenA && tokenB && !tokenA.equals(tokenB) ? sdk_1.Pair.getAddress(tokenA, tokenB) : undefined;
        });
    }, [tokens]);
    var results = hooks_2.useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');
    return react_1.useMemo(function () {
        return results.map(function (result, i) {
            var reserves = result.result, loading = result.loading;
            var tokenA = tokens[i][0];
            var tokenB = tokens[i][1];
            if (loading)
                return [PairState.LOADING, null];
            if (!tokenA || !tokenB || tokenA.equals(tokenB))
                return [PairState.INVALID, null];
            if (!reserves)
                return [PairState.NOT_EXISTS, null];
            var reserve0 = reserves.reserve0, reserve1 = reserves.reserve1;
            var _a = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA], token0 = _a[0], token1 = _a[1];
            return [
                PairState.EXISTS,
                new sdk_1.Pair(new sdk_1.TokenAmount(token0, reserve0.toString()), new sdk_1.TokenAmount(token1, reserve1.toString()))
            ];
        });
    }, [results, tokens]);
}
exports.usePairs = usePairs;
function usePair(tokenA, tokenB) {
    return usePairs([[tokenA, tokenB]])[0];
}
exports.usePair = usePair;
