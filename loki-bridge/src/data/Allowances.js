"use strict";
exports.__esModule = true;
exports.useTokenAllowance = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var useContract_1 = require("../hooks/useContract");
var hooks_1 = require("../state/multicall/hooks");
function useTokenAllowance(token, owner, spender) {
    var contract = useContract_1.useTokenContract(token === null || token === void 0 ? void 0 : token.address, false);
    var inputs = react_1.useMemo(function () { return [owner, spender]; }, [owner, spender]);
    var allowance = hooks_1.useSingleCallResult(contract, 'allowance', inputs).result;
    return react_1.useMemo(function () { return (token && allowance ? new sdk_1.TokenAmount(token, allowance.toString()) : undefined); }, [
        token,
        allowance
    ]);
}
exports.useTokenAllowance = useTokenAllowance;
