"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utils_1 = require("ethers/lib/utils");
var react_1 = require("react");
var hooks_1 = require("../state/multicall/hooks");
var utils_2 = require("../utils");
var isZero_1 = __importDefault(require("../utils/isZero"));
var useContract_1 = require("./useContract");
var useDebounce_1 = __importDefault(require("./useDebounce"));
/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
function useENSName(address) {
    var _a, _b, _c;
    var debouncedAddress = useDebounce_1["default"](address, 200);
    var ensNodeArgument = react_1.useMemo(function () {
        if (!debouncedAddress || !utils_2.isAddress(debouncedAddress))
            return [undefined];
        try {
            return debouncedAddress ? [utils_1.namehash(debouncedAddress.toLowerCase().substr(2) + ".addr.reverse")] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [debouncedAddress]);
    var registrarContract = useContract_1.useENSRegistrarContract(false);
    var resolverAddress = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    var resolverAddressResult = (_a = resolverAddress.result) === null || _a === void 0 ? void 0 : _a[0];
    var resolverContract = useContract_1.useENSResolverContract(resolverAddressResult && !isZero_1["default"](resolverAddressResult) ? resolverAddressResult : undefined, false);
    var name = hooks_1.useSingleCallResult(resolverContract, 'name', ensNodeArgument);
    var changed = debouncedAddress !== address;
    return {
        ENSName: changed ? null : (_c = (_b = name.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: changed || resolverAddress.loading || name.loading
    };
}
exports["default"] = useENSName;
