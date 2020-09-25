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
exports.__esModule = true;
exports.useCurrency = exports.useToken = exports.useIsUserAddedToken = exports.useAllTokens = void 0;
var strings_1 = require("@ethersproject/strings");
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var hooks_1 = require("../state/lists/hooks");
var hooks_2 = require("../state/multicall/hooks");
var hooks_3 = require("../state/user/hooks");
var utils_1 = require("../utils");
var index_1 = require("./index");
var useContract_1 = require("./useContract");
function useAllTokens() {
    var chainId = index_1.useActiveWeb3React().chainId;
    var userAddedTokens = hooks_3.useUserAddedTokens();
    var allTokens = hooks_1.useSelectedTokenList();
    return react_1.useMemo(function () {
        if (!chainId)
            return {};
        return (userAddedTokens
            // reduce into all ALL_TOKENS filtered by the current chain
            .reduce(function (tokenMap, token) {
            tokenMap[token.address] = token;
            return tokenMap;
        }, __assign({}, allTokens[chainId])));
    }, [chainId, userAddedTokens, allTokens]);
}
exports.useAllTokens = useAllTokens;
// Check if currency is included in custom list from user storage
function useIsUserAddedToken(currency) {
    var userAddedTokens = hooks_3.useUserAddedTokens();
    return !!userAddedTokens.find(function (token) { return sdk_1.currencyEquals(currency, token); });
}
exports.useIsUserAddedToken = useIsUserAddedToken;
// parse a name or symbol from a token response
var BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;
function parseStringOrBytes32(str, bytes32, defaultValue) {
    return str && str.length > 0
        ? str
        : bytes32 && BYTES32_REGEX.test(bytes32)
            ? strings_1.parseBytes32String(bytes32)
            : defaultValue;
}
// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
function useToken(tokenAddress) {
    var chainId = index_1.useActiveWeb3React().chainId;
    var tokens = useAllTokens();
    var address = utils_1.isAddress(tokenAddress);
    var tokenContract = useContract_1.useTokenContract(address ? address : undefined, false);
    var tokenContractBytes32 = useContract_1.useBytes32TokenContract(address ? address : undefined, false);
    var token = address ? tokens[address] : undefined;
    var tokenName = hooks_2.useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, hooks_2.NEVER_RELOAD);
    var tokenNameBytes32 = hooks_2.useSingleCallResult(token ? undefined : tokenContractBytes32, 'name', undefined, hooks_2.NEVER_RELOAD);
    var symbol = hooks_2.useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, hooks_2.NEVER_RELOAD);
    var symbolBytes32 = hooks_2.useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, hooks_2.NEVER_RELOAD);
    var decimals = hooks_2.useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, hooks_2.NEVER_RELOAD);
    return react_1.useMemo(function () {
        var _a, _b, _c, _d;
        if (token)
            return token;
        if (!chainId || !address)
            return undefined;
        if (decimals.loading || symbol.loading || tokenName.loading)
            return null;
        if (decimals.result) {
            return new sdk_1.Token(chainId, address, decimals.result[0], parseStringOrBytes32((_a = symbol.result) === null || _a === void 0 ? void 0 : _a[0], (_b = symbolBytes32.result) === null || _b === void 0 ? void 0 : _b[0], 'UNKNOWN'), parseStringOrBytes32((_c = tokenName.result) === null || _c === void 0 ? void 0 : _c[0], (_d = tokenNameBytes32.result) === null || _d === void 0 ? void 0 : _d[0], 'Unknown Token'));
        }
        return undefined;
    }, [
        address,
        chainId,
        decimals.loading,
        decimals.result,
        symbol.loading,
        symbol.result,
        symbolBytes32.result,
        token,
        tokenName.loading,
        tokenName.result,
        tokenNameBytes32.result
    ]);
}
exports.useToken = useToken;
function useCurrency(currencyId) {
    var isETH = (currencyId === null || currencyId === void 0 ? void 0 : currencyId.toUpperCase()) === 'ETH';
    var token = useToken(isETH ? undefined : currencyId);
    return isETH ? sdk_1.ETHER : token;
}
exports.useCurrency = useCurrency;
