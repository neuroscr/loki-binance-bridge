"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useAllTokenBalances = exports.useCurrencyBalance = exports.useCurrencyBalances = exports.useTokenBalance = exports.useTokenBalances = exports.useTokenBalancesWithLoadingIndicator = exports.useETHBalances = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var erc20_1 = __importDefault(require("../../constants/abis/erc20"));
var Tokens_1 = require("../../hooks/Tokens");
var hooks_1 = require("../../hooks");
var useContract_1 = require("../../hooks/useContract");
var utils_1 = require("../../utils");
var hooks_2 = require("../multicall/hooks");
/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
function useETHBalances(uncheckedAddresses) {
    var multicallContract = useContract_1.useMulticallContract();
    var addresses = react_1.useMemo(function () {
        return uncheckedAddresses
            ? uncheckedAddresses
                .map(utils_1.isAddress)
                .filter(function (a) { return a !== false; })
                .sort()
            : [];
    }, [uncheckedAddresses]);
    var results = hooks_2.useSingleContractMultipleData(multicallContract, 'getEthBalance', addresses.map(function (address) { return [address]; }));
    return react_1.useMemo(function () {
        return addresses.reduce(function (memo, address, i) {
            var _a, _b;
            var value = (_b = (_a = results === null || results === void 0 ? void 0 : results[i]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
            if (value)
                memo[address] = sdk_1.CurrencyAmount.ether(sdk_1.JSBI.BigInt(value.toString()));
            return memo;
        }, {});
    }, [addresses, results]);
}
exports.useETHBalances = useETHBalances;
/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
function useTokenBalancesWithLoadingIndicator(address, tokens) {
    var validatedTokens = react_1.useMemo(function () { var _a; return (_a = tokens === null || tokens === void 0 ? void 0 : tokens.filter(function (t) { return utils_1.isAddress(t === null || t === void 0 ? void 0 : t.address) !== false; })) !== null && _a !== void 0 ? _a : []; }, [tokens]);
    var validatedTokenAddresses = react_1.useMemo(function () { return validatedTokens.map(function (vt) { return vt.address; }); }, [validatedTokens]);
    var balances = hooks_2.useMultipleContractSingleData(validatedTokenAddresses, erc20_1["default"], 'balanceOf', [address]);
    var anyLoading = react_1.useMemo(function () { return balances.some(function (callState) { return callState.loading; }); }, [balances]);
    return [
        react_1.useMemo(function () {
            return address && validatedTokens.length > 0
                ? validatedTokens.reduce(function (memo, token, i) {
                    var _a, _b;
                    var value = (_b = (_a = balances === null || balances === void 0 ? void 0 : balances[i]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
                    var amount = value ? sdk_1.JSBI.BigInt(value.toString()) : undefined;
                    if (amount) {
                        memo[token.address] = new sdk_1.TokenAmount(token, amount);
                    }
                    return memo;
                }, {})
                : {};
        }, [address, validatedTokens, balances]),
        anyLoading
    ];
}
exports.useTokenBalancesWithLoadingIndicator = useTokenBalancesWithLoadingIndicator;
function useTokenBalances(address, tokens) {
    return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}
exports.useTokenBalances = useTokenBalances;
// get the balance for a single token/account combo
function useTokenBalance(account, token) {
    var tokenBalances = useTokenBalances(account, [token]);
    if (!token)
        return undefined;
    return tokenBalances[token.address];
}
exports.useTokenBalance = useTokenBalance;
function useCurrencyBalances(account, currencies) {
    var tokens = react_1.useMemo(function () { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.filter(function (currency) { return currency instanceof sdk_1.Token; })) !== null && _a !== void 0 ? _a : []; }, [
        currencies
    ]);
    var tokenBalances = useTokenBalances(account, tokens);
    var containsETH = react_1.useMemo(function () { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.some(function (currency) { return currency === sdk_1.ETHER; })) !== null && _a !== void 0 ? _a : false; }, [currencies]);
    var ethBalance = useETHBalances(containsETH ? [account] : []);
    return react_1.useMemo(function () { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.map(function (currency) {
        if (!account || !currency)
            return undefined;
        if (currency instanceof sdk_1.Token)
            return tokenBalances[currency.address];
        if (currency === sdk_1.ETHER)
            return ethBalance[account];
        return undefined;
    })) !== null && _a !== void 0 ? _a : []; }, [account, currencies, ethBalance, tokenBalances]);
}
exports.useCurrencyBalances = useCurrencyBalances;
function useCurrencyBalance(account, currency) {
    return useCurrencyBalances(account, [currency])[0];
}
exports.useCurrencyBalance = useCurrencyBalance;
// mimics useAllBalances
function useAllTokenBalances() {
    var account = hooks_1.useActiveWeb3React().account;
    var allTokens = Tokens_1.useAllTokens();
    var allTokensArray = react_1.useMemo(function () { return Object.values(allTokens !== null && allTokens !== void 0 ? allTokens : {}); }, [allTokens]);
    var balances = useTokenBalances(account !== null && account !== void 0 ? account : undefined, allTokensArray);
    return balances !== null && balances !== void 0 ? balances : {};
}
exports.useAllTokenBalances = useAllTokenBalances;
