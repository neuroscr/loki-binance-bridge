"use strict";
exports.__esModule = true;
exports.useHasSocks = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var hooks_1 = require("../state/multicall/hooks");
var index_1 = require("./index");
var useContract_1 = require("./useContract");
function useSocksBalance() {
    var account = index_1.useActiveWeb3React().account;
    var socksContract = useContract_1.useSocksController();
    var result = hooks_1.useSingleCallResult(socksContract, 'balanceOf', [account !== null && account !== void 0 ? account : undefined], hooks_1.NEVER_RELOAD).result;
    var data = result === null || result === void 0 ? void 0 : result[0];
    return data ? sdk_1.JSBI.BigInt(data.toString()) : undefined;
}
exports["default"] = useSocksBalance;
function useHasSocks() {
    var balance = useSocksBalance();
    return react_1.useMemo(function () { return balance && sdk_1.JSBI.greaterThan(balance, sdk_1.JSBI.BigInt(0)); }, [balance]);
}
exports.useHasSocks = useHasSocks;
