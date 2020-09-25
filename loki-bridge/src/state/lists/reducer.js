"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var toolkit_1 = require("@reduxjs/toolkit");
var token_lists_1 = require("@uniswap/token-lists");
var lists_1 = require("../../constants/lists");
var actions_1 = require("../global/actions");
var actions_2 = require("./actions");
var default_token_list_1 = __importDefault(require("@uniswap/default-token-list"));
var NEW_LIST_STATE = {
    error: null,
    current: null,
    loadingRequestId: null,
    pendingUpdate: null
};
var initialState = {
    lastInitializedDefaultListOfLists: lists_1.DEFAULT_LIST_OF_LISTS,
    byUrl: __assign(__assign({}, lists_1.DEFAULT_LIST_OF_LISTS.reduce(function (memo, listUrl) {
        memo[listUrl] = NEW_LIST_STATE;
        return memo;
    }, {})), (_a = {}, _a[lists_1.DEFAULT_TOKEN_LIST_URL] = {
        error: null,
        current: default_token_list_1["default"],
        loadingRequestId: null,
        pendingUpdate: null
    }, _a)),
    selectedListUrl: undefined
};
exports["default"] = toolkit_1.createReducer(initialState, function (builder) {
    return builder
        .addCase(actions_2.fetchTokenList.pending, function (state, _a) {
        var _b = _a.payload, requestId = _b.requestId, url = _b.url;
        state.byUrl[url] = __assign(__assign({ current: null, pendingUpdate: null }, state.byUrl[url]), { loadingRequestId: requestId, error: null });
    })
        .addCase(actions_2.fetchTokenList.fulfilled, function (state, _a) {
        var _b, _c;
        var _d = _a.payload, requestId = _d.requestId, tokenList = _d.tokenList, url = _d.url;
        var current = (_b = state.byUrl[url]) === null || _b === void 0 ? void 0 : _b.current;
        var loadingRequestId = (_c = state.byUrl[url]) === null || _c === void 0 ? void 0 : _c.loadingRequestId;
        // no-op if update does nothing
        if (current) {
            var upgradeType = token_lists_1.getVersionUpgrade(current.version, tokenList.version);
            if (upgradeType === token_lists_1.VersionUpgrade.NONE)
                return;
            if (loadingRequestId === null || loadingRequestId === requestId) {
                state.byUrl[url] = __assign(__assign({}, state.byUrl[url]), { loadingRequestId: null, error: null, current: current, pendingUpdate: tokenList });
            }
        }
        else {
            state.byUrl[url] = __assign(__assign({}, state.byUrl[url]), { loadingRequestId: null, error: null, current: tokenList, pendingUpdate: null });
        }
    })
        .addCase(actions_2.fetchTokenList.rejected, function (state, _a) {
        var _b;
        var _c = _a.payload, url = _c.url, requestId = _c.requestId, errorMessage = _c.errorMessage;
        if (((_b = state.byUrl[url]) === null || _b === void 0 ? void 0 : _b.loadingRequestId) !== requestId) {
            // no-op since it's not the latest request
            return;
        }
        state.byUrl[url] = __assign(__assign({}, state.byUrl[url]), { loadingRequestId: null, error: errorMessage, current: null, pendingUpdate: null });
    })
        .addCase(actions_2.selectList, function (state, _a) {
        var url = _a.payload;
        state.selectedListUrl = url;
        // automatically adds list
        if (!state.byUrl[url]) {
            state.byUrl[url] = NEW_LIST_STATE;
        }
    })
        .addCase(actions_2.addList, function (state, _a) {
        var url = _a.payload;
        if (!state.byUrl[url]) {
            state.byUrl[url] = NEW_LIST_STATE;
        }
    })
        .addCase(actions_2.removeList, function (state, _a) {
        var url = _a.payload;
        if (state.byUrl[url]) {
            delete state.byUrl[url];
        }
        if (state.selectedListUrl === url) {
            state.selectedListUrl = Object.keys(state.byUrl)[0];
        }
    })
        .addCase(actions_2.acceptListUpdate, function (state, _a) {
        var _b;
        var url = _a.payload;
        if (!((_b = state.byUrl[url]) === null || _b === void 0 ? void 0 : _b.pendingUpdate)) {
            throw new Error('accept list update called without pending update');
        }
        state.byUrl[url] = __assign(__assign({}, state.byUrl[url]), { pendingUpdate: null, current: state.byUrl[url].pendingUpdate });
    })
        .addCase(actions_1.updateVersion, function (state) {
        // state loaded from localStorage, but new lists have never been initialized
        if (!state.lastInitializedDefaultListOfLists) {
            state.byUrl = initialState.byUrl;
            state.selectedListUrl = undefined;
        }
        else if (state.lastInitializedDefaultListOfLists) {
            var lastInitializedSet_1 = state.lastInitializedDefaultListOfLists.reduce(function (s, l) { return s.add(l); }, new Set());
            var newListOfListsSet_1 = lists_1.DEFAULT_LIST_OF_LISTS.reduce(function (s, l) { return s.add(l); }, new Set());
            lists_1.DEFAULT_LIST_OF_LISTS.forEach(function (listUrl) {
                if (!lastInitializedSet_1.has(listUrl)) {
                    state.byUrl[listUrl] = NEW_LIST_STATE;
                }
            });
            state.lastInitializedDefaultListOfLists.forEach(function (listUrl) {
                if (!newListOfListsSet_1.has(listUrl)) {
                    delete state.byUrl[listUrl];
                }
            });
        }
        state.lastInitializedDefaultListOfLists = lists_1.DEFAULT_LIST_OF_LISTS;
    });
});
