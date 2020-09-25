"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = require("react");
var hooks_1 = require("../../hooks");
var useDebounce_1 = __importDefault(require("../../hooks/useDebounce"));
var useIsWindowVisible_1 = __importDefault(require("../../hooks/useIsWindowVisible"));
var actions_1 = require("./actions");
var react_redux_1 = require("react-redux");
function Updater() {
    var _a = hooks_1.useActiveWeb3React(), library = _a.library, chainId = _a.chainId;
    var dispatch = react_redux_1.useDispatch();
    var windowVisible = useIsWindowVisible_1["default"]();
    var _b = react_1.useState({
        chainId: chainId,
        blockNumber: null
    }), state = _b[0], setState = _b[1];
    var blockNumberCallback = react_1.useCallback(function (blockNumber) {
        setState(function (state) {
            if (chainId === state.chainId) {
                if (typeof state.blockNumber !== 'number')
                    return { chainId: chainId, blockNumber: blockNumber };
                return { chainId: chainId, blockNumber: Math.max(blockNumber, state.blockNumber) };
            }
            return state;
        });
    }, [chainId, setState]);
    // attach/detach listeners
    react_1.useEffect(function () {
        if (!library || !chainId || !windowVisible)
            return undefined;
        setState({ chainId: chainId, blockNumber: null });
        library
            .getBlockNumber()
            .then(blockNumberCallback)["catch"](function (error) { return console.error("Failed to get block number for chainId: " + chainId, error); });
        library.on('block', blockNumberCallback);
        return function () {
            library.removeListener('block', blockNumberCallback);
        };
    }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);
    var debouncedState = useDebounce_1["default"](state, 100);
    react_1.useEffect(function () {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible)
            return;
        dispatch(actions_1.updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);
    return null;
}
exports["default"] = Updater;
