"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useToggle(initialState) {
    if (initialState === void 0) { initialState = false; }
    var _a = react_1.useState(initialState), state = _a[0], setState = _a[1];
    var toggle = react_1.useCallback(function () { return setState(function (state) { return !state; }); }, []);
    return [state, toggle];
}
exports["default"] = useToggle;
