"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
var react_1 = require("react");
function useCopyClipboard(timeout) {
    if (timeout === void 0) { timeout = 500; }
    var _a = react_1.useState(false), isCopied = _a[0], setIsCopied = _a[1];
    var staticCopy = react_1.useCallback(function (text) {
        var didCopy = copy_to_clipboard_1["default"](text);
        setIsCopied(didCopy);
    }, []);
    react_1.useEffect(function () {
        if (isCopied) {
            var hide_1 = setTimeout(function () {
                setIsCopied(false);
            }, timeout);
            return function () {
                clearTimeout(hide_1);
            };
        }
        return undefined;
    }, [isCopied, setIsCopied, timeout]);
    return [isCopied, staticCopy];
}
exports["default"] = useCopyClipboard;
