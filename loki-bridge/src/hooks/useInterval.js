"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useInterval(callback, delay, leading) {
    if (leading === void 0) { leading = true; }
    var savedCallback = react_1.useRef();
    // Remember the latest callback.
    react_1.useEffect(function () {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    react_1.useEffect(function () {
        function tick() {
            var current = savedCallback.current;
            current && current();
        }
        if (delay !== null) {
            if (leading)
                tick();
            var id_1 = setInterval(tick, delay);
            return function () { return clearInterval(id_1); };
        }
        return undefined;
    }, [delay, leading]);
}
exports["default"] = useInterval;
