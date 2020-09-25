"use strict";
exports.__esModule = true;
var react_1 = require("react");
var VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document;
function isWindowVisible() {
    return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden';
}
/**
 * Returns whether the window is currently visible to the user.
 */
function useIsWindowVisible() {
    var _a = react_1.useState(isWindowVisible()), focused = _a[0], setFocused = _a[1];
    var listener = react_1.useCallback(function () {
        setFocused(isWindowVisible());
    }, [setFocused]);
    react_1.useEffect(function () {
        if (!VISIBILITY_STATE_SUPPORTED)
            return undefined;
        document.addEventListener('visibilitychange', listener);
        return function () {
            document.removeEventListener('visibilitychange', listener);
        };
    }, [listener]);
    return focused;
}
exports["default"] = useIsWindowVisible;
