"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var token_lists_1 = require("@uniswap/token-lists");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("../../hooks");
var useFetchListCallback_1 = require("../../hooks/useFetchListCallback");
var useInterval_1 = __importDefault(require("../../hooks/useInterval"));
var useIsWindowVisible_1 = __importDefault(require("../../hooks/useIsWindowVisible"));
var actions_1 = require("../application/actions");
var actions_2 = require("./actions");
function Updater() {
    var library = hooks_1.useActiveWeb3React().library;
    var dispatch = react_redux_1.useDispatch();
    var lists = react_redux_1.useSelector(function (state) { return state.lists.byUrl; });
    var isWindowVisible = useIsWindowVisible_1["default"]();
    var fetchList = useFetchListCallback_1.useFetchListCallback();
    var fetchAllListsCallback = react_1.useCallback(function () {
        if (!isWindowVisible)
            return;
        Object.keys(lists).forEach(function (url) {
            return fetchList(url)["catch"](function (error) { return console.debug('interval list fetching error', error); });
        });
    }, [fetchList, isWindowVisible, lists]);
    // fetch all lists every 10 minutes, but only after we initialize library
    useInterval_1["default"](fetchAllListsCallback, library ? 1000 * 60 * 10 : null);
    // whenever a list is not loaded and not loading, try again to load it
    react_1.useEffect(function () {
        Object.keys(lists).forEach(function (listUrl) {
            var list = lists[listUrl];
            if (!list.current && !list.loadingRequestId && !list.error) {
                fetchList(listUrl)["catch"](function (error) { return console.debug('list added fetching error', error); });
            }
        });
    }, [dispatch, fetchList, library, lists]);
    // automatically update lists if versions are minor/patch
    react_1.useEffect(function () {
        Object.keys(lists).forEach(function (listUrl) {
            var list = lists[listUrl];
            if (list.current && list.pendingUpdate) {
                var bump = token_lists_1.getVersionUpgrade(list.current.version, list.pendingUpdate.version);
                switch (bump) {
                    case token_lists_1.VersionUpgrade.NONE:
                        throw new Error('unexpected no version bump');
                    case token_lists_1.VersionUpgrade.PATCH:
                    case token_lists_1.VersionUpgrade.MINOR:
                        var min = token_lists_1.minVersionBump(list.current.tokens, list.pendingUpdate.tokens);
                        // automatically update minor/patch as long as bump matches the min update
                        if (bump >= min) {
                            dispatch(actions_2.acceptListUpdate(listUrl));
                            dispatch(actions_1.addPopup({
                                key: listUrl,
                                content: {
                                    listUpdate: {
                                        listUrl: listUrl,
                                        oldList: list.current,
                                        newList: list.pendingUpdate,
                                        auto: true
                                    }
                                }
                            }));
                        }
                        else {
                            console.error("List at url " + listUrl + " could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR");
                        }
                        break;
                    case token_lists_1.VersionUpgrade.MAJOR:
                        dispatch(actions_1.addPopup({
                            key: listUrl,
                            content: {
                                listUpdate: {
                                    listUrl: listUrl,
                                    auto: false,
                                    oldList: list.current,
                                    newList: list.pendingUpdate
                                }
                            },
                            removeAfterMs: null
                        }));
                }
            }
        });
    }, [dispatch, lists]);
    return null;
}
exports["default"] = Updater;
