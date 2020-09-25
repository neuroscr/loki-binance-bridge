"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var actions_1 = require("./actions");
function Updater() {
    var dispatch = react_redux_1.useDispatch();
    // keep dark mode in sync with the system
    react_1.useEffect(function () {
        var darkHandler = function (match) {
            dispatch(actions_1.updateMatchesDarkMode({ matchesDarkMode: match.matches }));
        };
        var match = window === null || window === void 0 ? void 0 : window.matchMedia('(prefers-color-scheme: dark)');
        dispatch(actions_1.updateMatchesDarkMode({ matchesDarkMode: match.matches }));
        if (match === null || match === void 0 ? void 0 : match.addListener) {
            match === null || match === void 0 ? void 0 : match.addListener(darkHandler);
        }
        else if (match === null || match === void 0 ? void 0 : match.addEventListener) {
            match === null || match === void 0 ? void 0 : match.addEventListener('change', darkHandler);
        }
        return function () {
            if (match === null || match === void 0 ? void 0 : match.removeListener) {
                match === null || match === void 0 ? void 0 : match.removeListener(darkHandler);
            }
            else if (match === null || match === void 0 ? void 0 : match.removeEventListener) {
                match === null || match === void 0 ? void 0 : match.removeEventListener('change', darkHandler);
            }
        };
    }, [dispatch]);
    return null;
}
exports["default"] = Updater;
