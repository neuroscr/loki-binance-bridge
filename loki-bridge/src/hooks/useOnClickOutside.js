"use strict";
exports.__esModule = true;
exports.useOnClickOutside = void 0;
var react_1 = require("react");
function useOnClickOutside(node, handler) {
    var handlerRef = react_1.useRef(handler);
    react_1.useEffect(function () {
        handlerRef.current = handler;
    }, [handler]);
    react_1.useEffect(function () {
        var handleClickOutside = function (e) {
            var _a, _b;
            if ((_b = (_a = node.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) !== null && _b !== void 0 ? _b : false) {
                return;
            }
            if (handlerRef.current)
                handlerRef.current();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [node]);
}
exports.useOnClickOutside = useOnClickOutside;
