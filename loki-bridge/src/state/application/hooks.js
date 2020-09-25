"use strict";
exports.__esModule = true;
exports.useActivePopups = exports.useRemovePopup = exports.useAddPopup = exports.useToggleSettingsMenu = exports.useSettingsMenuOpen = exports.useWalletModalToggle = exports.useWalletModalOpen = exports.useBlockNumber = void 0;
var react_1 = require("react");
var hooks_1 = require("../../hooks");
var actions_1 = require("./actions");
var react_redux_1 = require("react-redux");
function useBlockNumber() {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    return react_redux_1.useSelector(function (state) { return state.application.blockNumber[chainId !== null && chainId !== void 0 ? chainId : -1]; });
}
exports.useBlockNumber = useBlockNumber;
function useWalletModalOpen() {
    return react_redux_1.useSelector(function (state) { return state.application.walletModalOpen; });
}
exports.useWalletModalOpen = useWalletModalOpen;
function useWalletModalToggle() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function () { return dispatch(actions_1.toggleWalletModal()); }, [dispatch]);
}
exports.useWalletModalToggle = useWalletModalToggle;
function useSettingsMenuOpen() {
    return react_redux_1.useSelector(function (state) { return state.application.settingsMenuOpen; });
}
exports.useSettingsMenuOpen = useSettingsMenuOpen;
function useToggleSettingsMenu() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function () { return dispatch(actions_1.toggleSettingsMenu()); }, [dispatch]);
}
exports.useToggleSettingsMenu = useToggleSettingsMenu;
// returns a function that allows adding a popup
function useAddPopup() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (content, key) {
        dispatch(actions_1.addPopup({ content: content, key: key }));
    }, [dispatch]);
}
exports.useAddPopup = useAddPopup;
// returns a function that allows removing a popup via its key
function useRemovePopup() {
    var dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(function (key) {
        dispatch(actions_1.removePopup({ key: key }));
    }, [dispatch]);
}
exports.useRemovePopup = useRemovePopup;
// get the list of active popups
function useActivePopups() {
    var list = react_redux_1.useSelector(function (state) { return state.application.popupList; });
    return react_1.useMemo(function () { return list.filter(function (item) { return item.show; }); }, [list]);
}
exports.useActivePopups = useActivePopups;
