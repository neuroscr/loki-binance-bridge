"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var useCopyClipboard_1 = __importDefault(require("../../hooks/useCopyClipboard"));
var theme_1 = require("../../theme");
var react_feather_1 = require("react-feather");
var CopyIcon = styled_components_1["default"](theme_1.LinkStyledButton)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  flex-shrink: 0;\n  display: flex;\n  text-decoration: none;\n  font-size: 0.825rem;\n  :hover,\n  :active,\n  :focus {\n    text-decoration: none;\n    color: ", ";\n  }\n"], ["\n  color: ", ";\n  flex-shrink: 0;\n  display: flex;\n  text-decoration: none;\n  font-size: 0.825rem;\n  :hover,\n  :active,\n  :focus {\n    text-decoration: none;\n    color: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.text3;
}, function (_a) {
    var theme = _a.theme;
    return theme.text2;
});
var TransactionStatusText = styled_components_1["default"].span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-left: 0.25rem;\n  font-size: 0.825rem;\n  ", ";\n  align-items: center;\n"], ["\n  margin-left: 0.25rem;\n  font-size: 0.825rem;\n  ", ";\n  align-items: center;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.flexRowNoWrap;
});
function CopyHelper(props) {
    var _a = useCopyClipboard_1["default"](), isCopied = _a[0], setCopied = _a[1];
    return (react_1["default"].createElement(CopyIcon, { onClick: function () { return setCopied(props.toCopy); } },
        isCopied ? (react_1["default"].createElement(TransactionStatusText, null,
            react_1["default"].createElement(react_feather_1.CheckCircle, { size: '16' }),
            react_1["default"].createElement(TransactionStatusText, null, "Copied"))) : (react_1["default"].createElement(TransactionStatusText, null,
            react_1["default"].createElement(react_feather_1.Copy, { size: '16' }))),
        isCopied ? '' : props.children));
}
exports["default"] = CopyHelper;
var templateObject_1, templateObject_2;
