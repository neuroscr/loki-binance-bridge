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
exports.outdatedListeningKeys = exports.activeListeningKeys = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("../../hooks");
var useContract_1 = require("../../hooks/useContract");
var useDebounce_1 = __importDefault(require("../../hooks/useDebounce"));
var chunkArray_1 = __importDefault(require("../../utils/chunkArray"));
var retry_1 = require("../../utils/retry");
var hooks_2 = require("../application/hooks");
var actions_1 = require("./actions");
// chunk calls so we do not exceed the gas limit
var CALL_CHUNK_SIZE = 500;
/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
function fetchChunk(multicallContract, chunk, minBlockNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var resultsBlockNumber, returnData, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.debug('Fetching chunk', multicallContract, chunk, minBlockNumber);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    ;
                    return [4 /*yield*/, multicallContract.aggregate(chunk.map(function (obj) { return [obj.address, obj.callData]; }))];
                case 2:
                    _a = _b.sent(), resultsBlockNumber = _a[0], returnData = _a[1];
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.debug('Failed to fetch chunk inside retry', error_1);
                    throw error_1;
                case 4:
                    if (resultsBlockNumber.toNumber() < minBlockNumber) {
                        console.debug("Fetched results for old block number: " + resultsBlockNumber.toString() + " vs. " + minBlockNumber);
                        throw new retry_1.RetryableError('Fetched for old block number');
                    }
                    return [2 /*return*/, { results: returnData, blockNumber: resultsBlockNumber.toNumber() }];
            }
        });
    });
}
/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
function activeListeningKeys(allListeners, chainId) {
    if (!allListeners || !chainId)
        return {};
    var listeners = allListeners[chainId];
    if (!listeners)
        return {};
    return Object.keys(listeners).reduce(function (memo, callKey) {
        var keyListeners = listeners[callKey];
        memo[callKey] = Object.keys(keyListeners)
            .filter(function (key) {
            var blocksPerFetch = parseInt(key);
            if (blocksPerFetch <= 0)
                return false;
            return keyListeners[blocksPerFetch] > 0;
        })
            .reduce(function (previousMin, current) {
            return Math.min(previousMin, parseInt(current));
        }, Infinity);
        return memo;
    }, {});
}
exports.activeListeningKeys = activeListeningKeys;
/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
function outdatedListeningKeys(callResults, listeningKeys, chainId, latestBlockNumber) {
    if (!chainId || !latestBlockNumber)
        return [];
    var results = callResults[chainId];
    // no results at all, load everything
    if (!results)
        return Object.keys(listeningKeys);
    return Object.keys(listeningKeys).filter(function (callKey) {
        var blocksPerFetch = listeningKeys[callKey];
        var data = callResults[chainId][callKey];
        // no data, must fetch
        if (!data)
            return true;
        var minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1);
        // already fetching it for a recent enough block, don't refetch it
        if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber)
            return false;
        // if data is older than minDataBlockNumber, fetch it
        return !data.blockNumber || data.blockNumber < minDataBlockNumber;
    });
}
exports.outdatedListeningKeys = outdatedListeningKeys;
function Updater() {
    var dispatch = react_redux_1.useDispatch();
    var state = react_redux_1.useSelector(function (state) { return state.multicall; });
    // wait for listeners to settle before triggering updates
    var debouncedListeners = useDebounce_1["default"](state.callListeners, 100);
    var latestBlockNumber = hooks_2.useBlockNumber();
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var multicallContract = useContract_1.useMulticallContract();
    var cancellations = react_1.useRef();
    var listeningKeys = react_1.useMemo(function () {
        return activeListeningKeys(debouncedListeners, chainId);
    }, [debouncedListeners, chainId]);
    var unserializedOutdatedCallKeys = react_1.useMemo(function () {
        return outdatedListeningKeys(state.callResults, listeningKeys, chainId, latestBlockNumber);
    }, [chainId, state.callResults, listeningKeys, latestBlockNumber]);
    var serializedOutdatedCallKeys = react_1.useMemo(function () { return JSON.stringify(unserializedOutdatedCallKeys.sort()); }, [
        unserializedOutdatedCallKeys
    ]);
    react_1.useEffect(function () {
        var _a, _b, _c;
        if (!latestBlockNumber || !chainId || !multicallContract)
            return;
        var outdatedCallKeys = JSON.parse(serializedOutdatedCallKeys);
        if (outdatedCallKeys.length === 0)
            return;
        var calls = outdatedCallKeys.map(function (key) { return actions_1.parseCallKey(key); });
        var chunkedCalls = chunkArray_1["default"](calls, CALL_CHUNK_SIZE);
        if (((_a = cancellations.current) === null || _a === void 0 ? void 0 : _a.blockNumber) !== latestBlockNumber) {
            (_c = (_b = cancellations.current) === null || _b === void 0 ? void 0 : _b.cancellations) === null || _c === void 0 ? void 0 : _c.forEach(function (c) { return c(); });
        }
        dispatch(actions_1.fetchingMulticallResults({
            calls: calls,
            chainId: chainId,
            fetchingBlockNumber: latestBlockNumber
        }));
        cancellations.current = {
            blockNumber: latestBlockNumber,
            cancellations: chunkedCalls.map(function (chunk, index) {
                var _a = retry_1.retry(function () { return fetchChunk(multicallContract, chunk, latestBlockNumber); }, {
                    n: Infinity,
                    minWait: 2500,
                    maxWait: 3500
                }), cancel = _a.cancel, promise = _a.promise;
                promise
                    .then(function (_a) {
                    var returnData = _a.results, fetchBlockNumber = _a.blockNumber;
                    cancellations.current = { cancellations: [], blockNumber: latestBlockNumber };
                    // accumulates the length of all previous indices
                    var firstCallKeyIndex = chunkedCalls.slice(0, index).reduce(function (memo, curr) { return memo + curr.length; }, 0);
                    var lastCallKeyIndex = firstCallKeyIndex + returnData.length;
                    dispatch(actions_1.updateMulticallResults({
                        chainId: chainId,
                        results: outdatedCallKeys
                            .slice(firstCallKeyIndex, lastCallKeyIndex)
                            .reduce(function (memo, callKey, i) {
                            var _a;
                            memo[callKey] = (_a = returnData[i]) !== null && _a !== void 0 ? _a : null;
                            return memo;
                        }, {}),
                        blockNumber: fetchBlockNumber
                    }));
                })["catch"](function (error) {
                    if (error instanceof retry_1.CancelledError) {
                        console.debug('Cancelled fetch for blockNumber', latestBlockNumber);
                        return;
                    }
                    console.error('Failed to fetch multicall chunk', chunk, chainId, error);
                    dispatch(actions_1.errorFetchingMulticallResults({
                        calls: chunk,
                        chainId: chainId,
                        fetchingBlockNumber: latestBlockNumber
                    }));
                });
                return cancel;
            })
        };
    }, [chainId, multicallContract, dispatch, serializedOutdatedCallKeys, latestBlockNumber]);
    return null;
}
exports["default"] = Updater;
