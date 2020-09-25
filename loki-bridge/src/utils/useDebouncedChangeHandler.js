"use strict";
exports.__esModule = true;
var react_1 = require("react");
/**
 * Easy way to debounce the handling of a rapidly changing value, e.g. a changing slider input
 * @param value value that is rapidly changing
 * @param onChange change handler that should receive the debounced updates to the value
 * @param debouncedMs how long we should wait for changes to be applied
 */
function useDebouncedChangeHandler(value, onChange, debouncedMs) {
    if (debouncedMs === void 0) { debouncedMs = 100; }
    var _a = react_1.useState(function () { return value; }), inner = _a[0], setInner = _a[1];
    var timer = react_1.useRef();
    var onChangeInner = react_1.useCallback(function (newValue) {
        setInner(newValue);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(function () {
            onChange(newValue);
            timer.current = undefined;
        }, debouncedMs);
    }, [debouncedMs, onChange]);
    react_1.useEffect(function () {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
        setInner(value);
    }, [value]);
    return [inner, onChangeInner];
}
exports["default"] = useDebouncedChangeHandler;
