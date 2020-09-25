"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utils_1 = require("ethers/lib/utils");
var react_1 = require("react");
var hooks_1 = require("../state/multicall/hooks");
var isZero_1 = __importDefault(require("../utils/isZero"));
var useContract_1 = require("./useContract");
/**
 * Does a lookup for an ENS name to find its contenthash.
 */
function useENSContentHash(ensName) {
    var _a, _b, _c;
    var ensNodeArgument = react_1.useMemo(function () {
        if (!ensName)
            return [undefined];
        try {
            return ensName ? [utils_1.namehash(ensName)] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [ensName]);
    var registrarContract = useContract_1.useENSRegistrarContract(false);
    var resolverAddressResult = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    var resolverAddress = (_a = resolverAddressResult.result) === null || _a === void 0 ? void 0 : _a[0];
    var resolverContract = useContract_1.useENSResolverContract(resolverAddress && isZero_1["default"](resolverAddress) ? undefined : resolverAddress, false);
    var contenthash = hooks_1.useSingleCallResult(resolverContract, 'contenthash', ensNodeArgument);
    return {
        contenthash: (_c = (_b = contenthash.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: resolverAddressResult.loading || contenthash.loading
    };
}
exports["default"] = useENSContentHash;
