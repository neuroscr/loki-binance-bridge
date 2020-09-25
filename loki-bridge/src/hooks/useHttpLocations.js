"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var contenthashToUri_1 = __importDefault(require("../utils/contenthashToUri"));
var parseENSAddress_1 = require("../utils/parseENSAddress");
var uriToHttp_1 = __importDefault(require("../utils/uriToHttp"));
var useENSContentHash_1 = __importDefault(require("./useENSContentHash"));
function useHttpLocations(uri) {
    var ens = react_1.useMemo(function () { return (uri ? parseENSAddress_1.parseENSAddress(uri) : undefined); }, [uri]);
    var resolvedContentHash = useENSContentHash_1["default"](ens === null || ens === void 0 ? void 0 : ens.ensName);
    return react_1.useMemo(function () {
        if (ens) {
            return resolvedContentHash.contenthash ? uriToHttp_1["default"](contenthashToUri_1["default"](resolvedContentHash.contenthash)) : [];
        }
        else {
            return uri ? uriToHttp_1["default"](uri) : [];
        }
    }, [ens, resolvedContentHash.contenthash, uri]);
}
exports["default"] = useHttpLocations;
