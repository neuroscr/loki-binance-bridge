"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useTrackedTokenPairs = exports.toV2LiquidityToken = exports.usePairAdder = exports.useUserAddedTokens = exports.useRemoveUserAddedToken = exports.useAddUserToken = exports.useUserDeadline = exports.useUserSlippageTolerance = exports.useExpertModeManager = exports.useIsExpertMode = exports.useDarkModeManager = exports.useIsDarkMode = void 0;
var sdk_1 = require("@uniswap/sdk");
var lodash_flatmap_1 = __importDefault(require("lodash.flatmap"));
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var constants_1 = require("../../constants");
var hooks_1 = require("../../hooks");
var Tokens_1 = require("../../hooks/Tokens");
var actions_1 = require("./actions");
function serializeToken(token) {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name
    };
}
function deserializeToken(serializedToken) {
    return new sdk_1.Token(serializedToken.chainId, serializedToken.address, serializedToken.decimals, serializedToken.symbol, serializedToken.name);
}
function useIsDarkMode() {
    var _a = react_redux_1.useSelector(function (_a) {
        var _b = _a.user, matchesDarkMode = _b.matchesDarkMode, userDarkMode = _b.userDarkMode;
        return ({
            userDarkMode: userDarkMode,
            matchesDarkMode: matchesDarkMode
        });
    }, react_redux_1.shallowEqual), userDarkMode = _a.userDarkMode, matchesDarkMode = _a.matchesDarkMode;
    return userDarkMode === null ? matchesDarkMode : userDarkMode;
}
exports.useIsDarkMode = useIsDarkMode;
function useDarkModeManager() {
    var dispatch = react_redux_1.useDispatch();
    var darkMode = useIsDarkMode();
    var toggleSetDarkMode = react_1.useCallback(function () {
        dispatch(actions_1.updateUserDarkMode({ userDarkMode: !darkMode }));
    }, [darkMode, dispatch]);
    return [darkMode, toggleSetDarkMode];
}
exports.useDarkModeManager = useDarkModeManager;
function useIsExpertMode() {
    return react_redux_1.useSelector(function (state) { return state.user.userExpertMode; });
}
exports.useIsExpertMode = useIsExpertMode;
function useExpertModeManager() {
    var dispatch = react_redux_1.useDispatch();
    var expertMode = useIsExpertMode();
    var toggleSetExpertMode = react_1.useCallback(function () {
        dispatch(actions_1.updateUserExpertMode({ userExpertMode: !expertMode }));
    }, [expertMode, dispatch]);
    return [expertMode, toggleSetExpertMode];
}
exports.useExpertModeManager = useExpertModeManager;
function useUserSlippageTolerance() {
    var dispatch = react_redux_1.useDispatch();
    var userSlippageTolerance = react_redux_1.useSelector(function (state) {
        return state.user.userSlippageTolerance;
    });
    var setUserSlippageTolerance = react_1.useCallback(function (userSlippageTolerance) {
        dispatch(actions_1.updateUserSlippageTolerance({ userSlippageTolerance: userSlippageTolerance }));
    }, [dispatch]);
    return [userSlippageTolerance, setUserSlippageTolerance];
}
exports.useUserSlippageTolerance = useUserSlippageTolerance;
function useUserDeadline() {
    var dispatch = react_redux_1.useDispatch();
    var userDeadline = react_redux_1.useSelector(function (state) {
        return state.user.userDeadline;
    });
    var setUserDeadline = react_1.useCallback(function (userDeadline) {
        dispatch(actions_1.updateUserDeadline({ userDeadline: userDeadline }));
    }, [dispatch]);
    return [userDeadline, setUserDeadline];
}
exports.useUserDeadline = useUserDeadline;
function useAddUserToken() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (token) {
        dispatch(actions_1.addSerializedToken({ serializedToken: serializeToken(token) }));
    }, [dispatch]);
}
exports.useAddUserToken = useAddUserToken;
function useRemoveUserAddedToken() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (chainId, address) {
        dispatch(actions_1.removeSerializedToken({ chainId: chainId, address: address }));
    }, [dispatch]);
}
exports.useRemoveUserAddedToken = useRemoveUserAddedToken;
function useUserAddedTokens() {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var serializedTokensMap = react_redux_1.useSelector(function (_a) {
        var tokens = _a.user.tokens;
        return tokens;
    });
    return react_1.useMemo(function () {
        var _a;
        if (!chainId)
            return [];
        return Object.values((_a = serializedTokensMap[chainId]) !== null && _a !== void 0 ? _a : {}).map(deserializeToken);
    }, [serializedTokensMap, chainId]);
}
exports.useUserAddedTokens = useUserAddedTokens;
function serializePair(pair) {
    return {
        token0: serializeToken(pair.token0),
        token1: serializeToken(pair.token1)
    };
}
function usePairAdder() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (pair) {
        dispatch(actions_1.addSerializedPair({ serializedPair: serializePair(pair) }));
    }, [dispatch]);
}
exports.usePairAdder = usePairAdder;
/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
function toV2LiquidityToken(_a) {
    var tokenA = _a[0], tokenB = _a[1];
    return new sdk_1.Token(tokenA.chainId, sdk_1.Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2');
}
exports.toV2LiquidityToken = toV2LiquidityToken;
/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
function useTrackedTokenPairs() {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var tokens = Tokens_1.useAllTokens();
    // pinned pairs
    var pinnedPairs = react_1.useMemo(function () { var _a; return (chainId ? (_a = constants_1.PINNED_PAIRS[chainId]) !== null && _a !== void 0 ? _a : [] : []); }, [chainId]);
    // pairs for every token against every base
    var generatedPairs = react_1.useMemo(function () {
        return chainId
            ? lodash_flatmap_1["default"](Object.keys(tokens), function (tokenAddress) {
                var _a;
                var token = tokens[tokenAddress];
                // for each token on the current chain,
                return (
                // loop though all bases on the current chain
                ((_a = constants_1.BASES_TO_TRACK_LIQUIDITY_FOR[chainId]) !== null && _a !== void 0 ? _a : [])
                    // to construct pairs of the given token with each base
                    .map(function (base) {
                    if (base.address === token.address) {
                        return null;
                    }
                    else {
                        return [base, token];
                    }
                })
                    .filter(function (p) { return p !== null; }));
            })
            : [];
    }, [tokens, chainId]);
    // pairs saved by users
    var savedSerializedPairs = react_redux_1.useSelector(function (_a) {
        var pairs = _a.user.pairs;
        return pairs;
    });
    var userPairs = react_1.useMemo(function () {
        if (!chainId || !savedSerializedPairs)
            return [];
        var forChain = savedSerializedPairs[chainId];
        if (!forChain)
            return [];
        return Object.keys(forChain).map(function (pairId) {
            return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)];
        });
    }, [savedSerializedPairs, chainId]);
    var combinedList = react_1.useMemo(function () { return userPairs.concat(generatedPairs).concat(pinnedPairs); }, [
        generatedPairs,
        pinnedPairs,
        userPairs
    ]);
    return react_1.useMemo(function () {
        // dedupes pairs of tokens in the combined list
        var keyed = combinedList.reduce(function (memo, _a) {
            var tokenA = _a[0], tokenB = _a[1];
            var sorted = tokenA.sortsBefore(tokenB);
            var key = sorted ? tokenA.address + ":" + tokenB.address : tokenB.address + ":" + tokenA.address;
            if (memo[key])
                return memo;
            memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
            return memo;
        }, {});
        return Object.keys(keyed).map(function (key) { return keyed[key]; });
    }, [combinedList]);
}
exports.useTrackedTokenPairs = useTrackedTokenPairs;
