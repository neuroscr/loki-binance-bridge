"use strict";
exports.__esModule = true;
var react_1 = require("react");
// modified from https://usehooks.com/usePrevious/
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    var ref = react_1.useRef();
    // Store current value in ref
    react_1.useEffect(function () {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}
exports["default"] = usePrevious;
