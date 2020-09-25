"use strict";
exports.__esModule = true;
exports.useLastTruthy = void 0;
var react_1 = require("react");
/**
 * Returns the last value of type T that passes a filter function
 * @param value changing value
 * @param filterFn function that determines whether a given value should be considered for the last value
 */
function useLast(value, filterFn) {
    var _a = react_1.useState(filterFn && filterFn(value) ? value : undefined), last = _a[0], setLast = _a[1];
    react_1.useEffect(function () {
        setLast(function (last) {
            var shouldUse = filterFn ? filterFn(value) : true;
            if (shouldUse)
                return value;
            return last;
        });
    }, [filterFn, value]);
    return last;
}
exports["default"] = useLast;
function isDefined(x) {
    return x !== null && x !== undefined;
}
/**
 * Returns the last truthy value of type T
 * @param value changing value
 */
function useLastTruthy(value) {
    return useLast(value, isDefined);
}
exports.useLastTruthy = useLastTruthy;
