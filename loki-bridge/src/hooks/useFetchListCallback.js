"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useFetchListCallback = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var connectors_1 = require("../connectors");
var actions_1 = require("../state/lists/actions");
var getTokenList_1 = __importDefault(require("../utils/getTokenList"));
var resolveENSContentHash_1 = __importDefault(require("../utils/resolveENSContentHash"));
var index_1 = require("./index");
function useFetchListCallback() {
    var _this = this;
    var _a = index_1.useActiveWeb3React(), chainId = _a.chainId, library = _a.library;
    var dispatch = react_redux_1.useDispatch();
    var ensResolver = react_1.useCallback(function (ensName) {
        if (!library || chainId !== sdk_1.ChainId.MAINNET) {
            if (connectors_1.NETWORK_CHAIN_ID === sdk_1.ChainId.MAINNET) {
                var networkLibrary = connectors_1.getNetworkLibrary();
                if (networkLibrary) {
                    return resolveENSContentHash_1["default"](ensName, networkLibrary);
                }
            }
            throw new Error('Could not construct mainnet ENS resolver');
        }
        return resolveENSContentHash_1["default"](ensName, library);
    }, [chainId, library]);
    return react_1.useCallback(function (listUrl) { return __awaiter(_this, void 0, void 0, function () {
        var requestId;
        return __generator(this, function (_a) {
            requestId = toolkit_1.nanoid();
            dispatch(actions_1.fetchTokenList.pending({ requestId: requestId, url: listUrl }));
            return [2 /*return*/, getTokenList_1["default"](listUrl, ensResolver)
                    .then(function (tokenList) {
                    dispatch(actions_1.fetchTokenList.fulfilled({ url: listUrl, tokenList: tokenList, requestId: requestId }));
                    return tokenList;
                })["catch"](function (error) {
                    console.debug("Failed to get list at url " + listUrl, error);
                    dispatch(actions_1.fetchTokenList.rejected({ url: listUrl, requestId: requestId, errorMessage: error.message }));
                    throw error;
                })];
        });
    }); }, [dispatch, ensResolver]);
}
exports.useFetchListCallback = useFetchListCallback;
