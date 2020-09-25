"use strict";
exports.__esModule = true;
exports.useSingleCallResult = exports.useMultipleContractSingleData = exports.useSingleContractMultipleData = exports.NEVER_RELOAD = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("../../hooks");
var hooks_2 = require("../application/hooks");
var actions_1 = require("./actions");
function isMethodArg(x) {
    return ['string', 'number'].indexOf(typeof x) !== -1;
}
function isValidMethodArgs(x) {
    return (x === undefined ||
        (Array.isArray(x) && x.every(function (xi) { return isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg)); })));
}
var INVALID_RESULT = { valid: false, blockNumber: undefined, data: undefined };
// use this options object
exports.NEVER_RELOAD = {
    blocksPerFetch: Infinity
};
// the lowest level call for subscribing to contract data
function useCallsData(calls, options) {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var callResults = react_redux_1.useSelector(function (state) { return state.multicall.callResults; });
    var dispatch = react_redux_1.useDispatch();
    var serializedCallKeys = react_1.useMemo(function () {
        var _a, _b, _c;
        return JSON.stringify((_c = (_b = (_a = calls === null || calls === void 0 ? void 0 : calls.filter(function (c) { return Boolean(c); })) === null || _a === void 0 ? void 0 : _a.map(actions_1.toCallKey)) === null || _b === void 0 ? void 0 : _b.sort()) !== null && _c !== void 0 ? _c : []);
    }, [calls]);
    // update listeners when there is an actual change that persists for at least 100ms
    react_1.useEffect(function () {
        var callKeys = JSON.parse(serializedCallKeys);
        if (!chainId || callKeys.length === 0)
            return undefined;
        var calls = callKeys.map(function (key) { return actions_1.parseCallKey(key); });
        dispatch(actions_1.addMulticallListeners({
            chainId: chainId,
            calls: calls,
            options: options
        }));
        return function () {
            dispatch(actions_1.removeMulticallListeners({
                chainId: chainId,
                calls: calls,
                options: options
            }));
        };
    }, [chainId, dispatch, options, serializedCallKeys]);
    return react_1.useMemo(function () {
        return calls.map(function (call) {
            var _a;
            if (!chainId || !call)
                return INVALID_RESULT;
            var result = (_a = callResults[chainId]) === null || _a === void 0 ? void 0 : _a[actions_1.toCallKey(call)];
            var data;
            if ((result === null || result === void 0 ? void 0 : result.data) && (result === null || result === void 0 ? void 0 : result.data) !== '0x') {
                data = result.data;
            }
            return { valid: true, data: data, blockNumber: result === null || result === void 0 ? void 0 : result.blockNumber };
        });
    }, [callResults, calls, chainId]);
}
var INVALID_CALL_STATE = { valid: false, result: undefined, loading: false, syncing: false, error: false };
var LOADING_CALL_STATE = { valid: true, result: undefined, loading: true, syncing: true, error: false };
function toCallState(callResult, contractInterface, fragment, latestBlockNumber) {
    if (!callResult)
        return INVALID_CALL_STATE;
    var valid = callResult.valid, data = callResult.data, blockNumber = callResult.blockNumber;
    if (!valid)
        return INVALID_CALL_STATE;
    if (valid && !blockNumber)
        return LOADING_CALL_STATE;
    if (!contractInterface || !fragment || !latestBlockNumber)
        return LOADING_CALL_STATE;
    var success = data && data.length > 2;
    var syncing = (blockNumber !== null && blockNumber !== void 0 ? blockNumber : 0) < latestBlockNumber;
    var result = undefined;
    if (success && data) {
        try {
            result = contractInterface.decodeFunctionResult(fragment, data);
        }
        catch (error) {
            console.debug('Result data parsing failed', fragment, data);
            return {
                valid: true,
                loading: false,
                error: true,
                syncing: syncing,
                result: result
            };
        }
    }
    return {
        valid: true,
        loading: false,
        syncing: syncing,
        result: result,
        error: !success
    };
}
function useSingleContractMultipleData(contract, methodName, callInputs, options) {
    var fragment = react_1.useMemo(function () { var _a; return (_a = contract === null || contract === void 0 ? void 0 : contract.interface) === null || _a === void 0 ? void 0 : _a.getFunction(methodName); }, [contract, methodName]);
    var calls = react_1.useMemo(function () {
        return contract && fragment && callInputs && callInputs.length > 0
            ? callInputs.map(function (inputs) {
                return {
                    address: contract.address,
                    callData: contract.interface.encodeFunctionData(fragment, inputs)
                };
            })
            : [];
    }, [callInputs, contract, fragment]);
    var results = useCallsData(calls, options);
    var latestBlockNumber = hooks_2.useBlockNumber();
    return react_1.useMemo(function () {
        return results.map(function (result) { return toCallState(result, contract === null || contract === void 0 ? void 0 : contract.interface, fragment, latestBlockNumber); });
    }, [fragment, contract, results, latestBlockNumber]);
}
exports.useSingleContractMultipleData = useSingleContractMultipleData;
function useMultipleContractSingleData(addresses, contractInterface, methodName, callInputs, options) {
    var fragment = react_1.useMemo(function () { return contractInterface.getFunction(methodName); }, [contractInterface, methodName]);
    var callData = react_1.useMemo(function () {
        return fragment && isValidMethodArgs(callInputs)
            ? contractInterface.encodeFunctionData(fragment, callInputs)
            : undefined;
    }, [callInputs, contractInterface, fragment]);
    var calls = react_1.useMemo(function () {
        return fragment && addresses && addresses.length > 0 && callData
            ? addresses.map(function (address) {
                return address && callData
                    ? {
                        address: address,
                        callData: callData
                    }
                    : undefined;
            })
            : [];
    }, [addresses, callData, fragment]);
    var results = useCallsData(calls, options);
    var latestBlockNumber = hooks_2.useBlockNumber();
    return react_1.useMemo(function () {
        return results.map(function (result) { return toCallState(result, contractInterface, fragment, latestBlockNumber); });
    }, [fragment, results, contractInterface, latestBlockNumber]);
}
exports.useMultipleContractSingleData = useMultipleContractSingleData;
function useSingleCallResult(contract, methodName, inputs, options) {
    var fragment = react_1.useMemo(function () { var _a; return (_a = contract === null || contract === void 0 ? void 0 : contract.interface) === null || _a === void 0 ? void 0 : _a.getFunction(methodName); }, [contract, methodName]);
    var calls = react_1.useMemo(function () {
        return contract && fragment && isValidMethodArgs(inputs)
            ? [
                {
                    address: contract.address,
                    callData: contract.interface.encodeFunctionData(fragment, inputs)
                }
            ]
            : [];
    }, [contract, fragment, inputs]);
    var result = useCallsData(calls, options)[0];
    var latestBlockNumber = hooks_2.useBlockNumber();
    return react_1.useMemo(function () {
        return toCallState(result, contract === null || contract === void 0 ? void 0 : contract.interface, fragment, latestBlockNumber);
    }, [result, contract, fragment, latestBlockNumber]);
}
exports.useSingleCallResult = useSingleCallResult;
