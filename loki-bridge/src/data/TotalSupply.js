"use strict";
exports.__esModule = true;
exports.useTotalSupply = void 0;
var sdk_1 = require("@uniswap/sdk");
var useContract_1 = require("../hooks/useContract");
var hooks_1 = require("../state/multicall/hooks");
// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token) {
    var _a, _b;
    var contract = useContract_1.useTokenContract(token === null || token === void 0 ? void 0 : token.address, false);
    var totalSupply = (_b = (_a = hooks_1.useSingleCallResult(contract, 'totalSupply')) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
    return token && totalSupply ? new sdk_1.TokenAmount(token, totalSupply.toString()) : undefined;
}
exports.useTotalSupply = useTotalSupply;
