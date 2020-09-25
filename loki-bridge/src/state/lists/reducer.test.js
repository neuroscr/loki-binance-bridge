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
exports.__esModule = true;
var redux_1 = require("redux");
var lists_1 = require("../../constants/lists");
var actions_1 = require("../global/actions");
var actions_2 = require("./actions");
var reducer_1 = __importDefault(require("./reducer"));
var default_token_list_1 = __importDefault(require("@uniswap/default-token-list"));
var STUB_TOKEN_LIST = {
    name: '',
    timestamp: '',
    version: { major: 1, minor: 1, patch: 1 },
    tokens: []
};
var PATCHED_STUB_LIST = __assign(__assign({}, STUB_TOKEN_LIST), { version: __assign(__assign({}, STUB_TOKEN_LIST.version), { patch: STUB_TOKEN_LIST.version.patch + 1 }) });
var MINOR_UPDATED_STUB_LIST = __assign(__assign({}, STUB_TOKEN_LIST), { version: __assign(__assign({}, STUB_TOKEN_LIST.version), { minor: STUB_TOKEN_LIST.version.minor + 1 }) });
var MAJOR_UPDATED_STUB_LIST = __assign(__assign({}, STUB_TOKEN_LIST), { version: __assign(__assign({}, STUB_TOKEN_LIST.version), { major: STUB_TOKEN_LIST.version.major + 1 }) });
describe('list reducer', function () {
    var store;
    beforeEach(function () {
        store = redux_1.createStore(reducer_1["default"], {
            byUrl: {},
            selectedListUrl: undefined
        });
    });
    describe('fetchTokenList', function () {
        describe('pending', function () {
            it('sets pending', function () {
                store.dispatch(actions_2.fetchTokenList.pending({ requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            loadingRequestId: 'request-id',
                            current: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
            });
            it('does not clear current list', function () {
                store = redux_1.createStore(reducer_1["default"], {
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            pendingUpdate: null,
                            loadingRequestId: null
                        }
                    },
                    selectedListUrl: undefined
                });
                store.dispatch(actions_2.fetchTokenList.pending({ requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: 'request-id',
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
            });
        });
        describe('fulfilled', function () {
            it('saves the list', function () {
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
            });
            it('does not save the list in pending if current is same', function () {
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
            });
            it('does not save to current if list is newer patch version', function () {
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: PATCHED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: PATCHED_STUB_LIST
                        }
                    },
                    selectedListUrl: undefined
                });
            });
            it('does not save to current if list is newer minor version', function () {
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: MINOR_UPDATED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: MINOR_UPDATED_STUB_LIST
                        }
                    },
                    selectedListUrl: undefined
                });
            });
            it('does not save to pending if list is newer major version', function () {
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }));
                store.dispatch(actions_2.fetchTokenList.fulfilled({ tokenList: MAJOR_UPDATED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: MAJOR_UPDATED_STUB_LIST
                        }
                    },
                    selectedListUrl: undefined
                });
            });
        });
        describe('rejected', function () {
            it('no-op if not loading', function () {
                store.dispatch(actions_2.fetchTokenList.rejected({ requestId: 'request-id', errorMessage: 'abcd', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {},
                    selectedListUrl: undefined
                });
            });
            it('sets the error if loading', function () {
                store = redux_1.createStore(reducer_1["default"], {
                    byUrl: {
                        'fake-url': {
                            error: null,
                            current: null,
                            loadingRequestId: 'request-id',
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
                store.dispatch(actions_2.fetchTokenList.rejected({ requestId: 'request-id', errorMessage: 'abcd', url: 'fake-url' }));
                expect(store.getState()).toEqual({
                    byUrl: {
                        'fake-url': {
                            error: 'abcd',
                            current: null,
                            loadingRequestId: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
            });
        });
    });
    describe('addList', function () {
        it('adds the list key to byUrl', function () {
            store.dispatch(actions_2.addList('list-id'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'list-id': {
                        error: null,
                        current: null,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: undefined
            });
        });
        it('no op for existing list', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.addList('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: undefined
            });
        });
    });
    describe('acceptListUpdate', function () {
        it('swaps pending update into current', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.acceptListUpdate('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: PATCHED_STUB_LIST,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: undefined
            });
        });
    });
    describe('removeList', function () {
        it('deletes the list key', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.removeList('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {},
                selectedListUrl: undefined
            });
        });
        it('unselects the list if selected', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: 'fake-url'
            });
            store.dispatch(actions_2.removeList('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {},
                selectedListUrl: undefined
            });
        });
    });
    describe('selectList', function () {
        it('sets the selected list url', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.selectList('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: 'fake-url'
            });
        });
        it('selects if not present already', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.selectList('fake-url-invalid'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: STUB_TOKEN_LIST,
                        loadingRequestId: null,
                        pendingUpdate: PATCHED_STUB_LIST
                    },
                    'fake-url-invalid': {
                        error: null,
                        current: null,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: 'fake-url-invalid'
            });
        });
        it('works if list already added', function () {
            store = redux_1.createStore(reducer_1["default"], {
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: null,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: undefined
            });
            store.dispatch(actions_2.selectList('fake-url'));
            expect(store.getState()).toEqual({
                byUrl: {
                    'fake-url': {
                        error: null,
                        current: null,
                        loadingRequestId: null,
                        pendingUpdate: null
                    }
                },
                selectedListUrl: 'fake-url'
            });
        });
    });
    describe('updateVersion', function () {
        describe('never initialized', function () {
            beforeEach(function () {
                store = redux_1.createStore(reducer_1["default"], {
                    byUrl: {
                        'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        },
                        'https://unpkg.com/@uniswap/default-token-list@latest': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined
                });
                store.dispatch(actions_1.updateVersion());
            });
            it('clears the current lists', function () {
                expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json']).toBeUndefined();
                expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest']).toBeUndefined();
            });
            it('puts in all the new lists', function () {
                expect(Object.keys(store.getState().byUrl)).toEqual(lists_1.DEFAULT_LIST_OF_LISTS);
            });
            it('all lists are empty', function () {
                var s = store.getState();
                Object.keys(s.byUrl).forEach(function (url) {
                    if (url === lists_1.DEFAULT_TOKEN_LIST_URL) {
                        expect(s.byUrl[url]).toEqual({
                            error: null,
                            current: default_token_list_1["default"],
                            loadingRequestId: null,
                            pendingUpdate: null
                        });
                    }
                    else {
                        expect(s.byUrl[url]).toEqual({
                            error: null,
                            current: null,
                            loadingRequestId: null,
                            pendingUpdate: null
                        });
                    }
                });
            });
            it('sets initialized lists', function () {
                expect(store.getState().lastInitializedDefaultListOfLists).toEqual(lists_1.DEFAULT_LIST_OF_LISTS);
            });
        });
        describe('initialized with a different set of lists', function () {
            beforeEach(function () {
                store = redux_1.createStore(reducer_1["default"], {
                    byUrl: {
                        'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        },
                        'https://unpkg.com/@uniswap/default-token-list@latest': {
                            error: null,
                            current: STUB_TOKEN_LIST,
                            loadingRequestId: null,
                            pendingUpdate: null
                        }
                    },
                    selectedListUrl: undefined,
                    lastInitializedDefaultListOfLists: ['https://unpkg.com/@uniswap/default-token-list@latest']
                });
                store.dispatch(actions_1.updateVersion());
            });
            it('does not remove lists not in last initialized list of lists', function () {
                expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json']).toEqual({
                    error: null,
                    current: STUB_TOKEN_LIST,
                    loadingRequestId: null,
                    pendingUpdate: null
                });
            });
            it('removes lists in the last initialized list of lists', function () {
                expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest']).toBeUndefined();
            });
            it('adds all the lists in the default list of lists', function () {
                expect(Object.keys(store.getState().byUrl)).toContain(lists_1.DEFAULT_TOKEN_LIST_URL);
            });
            it('each of those initialized lists is empty', function () {
                var byUrl = store.getState().byUrl;
                // note we don't expect the uniswap default list to be prepopulated
                // this is ok.
                Object.keys(byUrl).forEach(function (url) {
                    if (url !== 'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json') {
                        expect(byUrl[url]).toEqual({
                            error: null,
                            current: null,
                            loadingRequestId: null,
                            pendingUpdate: null
                        });
                    }
                });
            });
            it('sets initialized lists', function () {
                expect(store.getState().lastInitializedDefaultListOfLists).toEqual(lists_1.DEFAULT_LIST_OF_LISTS);
            });
        });
    });
});
