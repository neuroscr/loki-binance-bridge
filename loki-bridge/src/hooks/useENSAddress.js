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
var useDebounce_1 = __importDefault(require("./useDebounce"));
/**
 * Does a lookup for an ENS name to find its address.
 */
function useENSAddress(ensName) {
    var _a, _b, _c;
    var debouncedName = useDebounce_1["default"](ensName, 200);
    var ensNodeArgument = react_1.useMemo(function () {
        if (!debouncedName)
            return [undefined];
        try {
            return debouncedName ? [utils_1.namehash(debouncedName)] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [debouncedName]);
    var registrarContract = useContract_1.useENSRegistrarContract(false);
    var resolverAddress = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    var resolverAddressResult = (_a = resolverAddress.result) === null || _a === void 0 ? void 0 : _a[0];
    var resolverContract = useContract_1.useENSResolverContract(resolverAddressResult && !isZero_1["default"](resolverAddressResult) ? resolverAddressResult : undefined, false);
    var addr = hooks_1.useSingleCallResult(resolverContract, 'addr', ensNodeArgument);
    var changed = debouncedName !== ensName;
    return {
        address: changed ? null : (_c = (_b = addr.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: changed || resolverAddress.loading || addr.loading
    };
}
exports["default"] = useENSAddress;
