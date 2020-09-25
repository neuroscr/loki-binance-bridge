"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
exports.useAllLists = exports.useSelectedListInfo = exports.useSelectedTokenList = exports.useSelectedListUrl = exports.useTokenList = exports.listToTokenMap = exports.WrappedTokenInfo = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
/**
 * Token instances created from token info.
 */
var WrappedTokenInfo = /** @class */ (function (_super) {
    __extends(WrappedTokenInfo, _super);
    function WrappedTokenInfo(tokenInfo, tags) {
        var _this = _super.call(this, tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name) || this;
        _this.tokenInfo = tokenInfo;
        _this.tags = tags;
        return _this;
    }
    Object.defineProperty(WrappedTokenInfo.prototype, "logoURI", {
        get: function () {
            return this.tokenInfo.logoURI;
        },
        enumerable: false,
        configurable: true
    });
    return WrappedTokenInfo;
}(sdk_1.Token));
exports.WrappedTokenInfo = WrappedTokenInfo;
/**
 * An empty result, useful as a default.
 */
var EMPTY_LIST = (_a = {},
    _a[sdk_1.ChainId.KOVAN] = {},
    _a[sdk_1.ChainId.RINKEBY] = {},
    _a[sdk_1.ChainId.ROPSTEN] = {},
    _a[sdk_1.ChainId.GÖRLI] = {},
    _a[sdk_1.ChainId.MAINNET] = {},
    _a);
var listCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function listToTokenMap(list) {
    var result = listCache === null || listCache === void 0 ? void 0 : listCache.get(list);
    if (result)
        return result;
    var map = list.tokens.reduce(function (tokenMap, tokenInfo) {
        var _a, _b;
        var _c, _d, _e;
        var tags = (_e = (_d = (_c = tokenInfo.tags) === null || _c === void 0 ? void 0 : _c.map(function (tagId) {
            var _a;
            if (!((_a = list.tags) === null || _a === void 0 ? void 0 : _a[tagId]))
                return undefined;
            return __assign(__assign({}, list.tags[tagId]), { id: tagId });
        })) === null || _d === void 0 ? void 0 : _d.filter(function (x) { return Boolean(x); })) !== null && _e !== void 0 ? _e : [];
        var token = new WrappedTokenInfo(tokenInfo, tags);
        if (tokenMap[token.chainId][token.address] !== undefined)
            throw Error('Duplicate tokens.');
        return __assign(__assign({}, tokenMap), (_a = {}, _a[token.chainId] = __assign(__assign({}, tokenMap[token.chainId]), (_b = {}, _b[token.address] = token, _b)), _a));
    }, __assign({}, EMPTY_LIST));
    listCache === null || listCache === void 0 ? void 0 : listCache.set(list, map);
    return map;
}
exports.listToTokenMap = listToTokenMap;
function useTokenList(url) {
    var lists = react_redux_1.useSelector(function (state) { return state.lists.byUrl; });
    return react_1.useMemo(function () {
        var _a;
        if (!url)
            return EMPTY_LIST;
        var current = (_a = lists[url]) === null || _a === void 0 ? void 0 : _a.current;
        if (!current)
            return EMPTY_LIST;
        try {
            return listToTokenMap(current);
        }
        catch (error) {
            console.error('Could not show token list due to error', error);
            return EMPTY_LIST;
        }
    }, [lists, url]);
}
exports.useTokenList = useTokenList;
function useSelectedListUrl() {
    return react_redux_1.useSelector(function (state) { return state.lists.selectedListUrl; });
}
exports.useSelectedListUrl = useSelectedListUrl;
function useSelectedTokenList() {
    return useTokenList(useSelectedListUrl());
}
exports.useSelectedTokenList = useSelectedTokenList;
function useSelectedListInfo() {
    var _a, _b;
    var selectedUrl = useSelectedListUrl();
    var listsByUrl = react_redux_1.useSelector(function (state) { return state.lists.byUrl; });
    var list = selectedUrl ? listsByUrl[selectedUrl] : undefined;
    return {
        current: (_a = list === null || list === void 0 ? void 0 : list.current) !== null && _a !== void 0 ? _a : null,
        pending: (_b = list === null || list === void 0 ? void 0 : list.pendingUpdate) !== null && _b !== void 0 ? _b : null,
        loading: (list === null || list === void 0 ? void 0 : list.loadingRequestId) !== null
    };
}
exports.useSelectedListInfo = useSelectedListInfo;
// returns all downloaded current lists
function useAllLists() {
    var lists = react_redux_1.useSelector(function (state) { return state.lists.byUrl; });
    return react_1.useMemo(function () {
        return Object.keys(lists)
            .map(function (url) { return lists[url].current; })
            .filter(function (l) { return Boolean(l); });
    }, [lists]);
}
exports.useAllLists = useAllLists;
