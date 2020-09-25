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
var react_feather_1 = require("react-feather");
var hooks_1 = require("../../hooks");
var utils_1 = require("../../utils");
var theme_1 = require("../../theme");
var hooks_2 = require("../../state/transactions/hooks");
var Row_1 = require("../Row");
var Loader_1 = __importDefault(require("../Loader"));
var TransactionWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
var TransactionStatusText = styled_components_1["default"].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 0.5rem;\n  display: flex;\n  align-items: center;\n  :hover {\n    text-decoration: underline;\n  }\n"], ["\n  margin-right: 0.5rem;\n  display: flex;\n  align-items: center;\n  :hover {\n    text-decoration: underline;\n  }\n"])));
var TransactionState = styled_components_1["default"](theme_1.ExternalLink)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  text-decoration: none !important;\n  border-radius: 0.5rem;\n  padding: 0.25rem 0rem;\n  font-weight: 500;\n  font-size: 0.825rem;\n  color: ", ";\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  text-decoration: none !important;\n  border-radius: 0.5rem;\n  padding: 0.25rem 0rem;\n  font-weight: 500;\n  font-size: 0.825rem;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.primary1;
});
var IconWrapper = styled_components_1["default"].div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (_a) {
    var pending = _a.pending, success = _a.success, theme = _a.theme;
    return (pending ? theme.primary1 : success ? theme.green1 : theme.red1);
});
function Transaction(_a) {
    var _b, _c;
    var hash = _a.hash;
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var allTransactions = hooks_2.useAllTransactions();
    var tx = allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions[hash];
    var summary = tx === null || tx === void 0 ? void 0 : tx.summary;
    var pending = !(tx === null || tx === void 0 ? void 0 : tx.receipt);
    var success = !pending && tx && (((_b = tx.receipt) === null || _b === void 0 ? void 0 : _b.status) === 1 || typeof ((_c = tx.receipt) === null || _c === void 0 ? void 0 : _c.status) === 'undefined');
    if (!chainId)
        return null;
    return (react_1["default"].createElement(TransactionWrapper, null,
        react_1["default"].createElement(TransactionState, { href: utils_1.getEtherscanLink(chainId, hash, 'transaction'), pending: pending, success: success },
            react_1["default"].createElement(Row_1.RowFixed, null,
                react_1["default"].createElement(TransactionStatusText, null, summary !== null && summary !== void 0 ? summary : hash,
                    " \u2197")),
            react_1["default"].createElement(IconWrapper, { pending: pending, success: success }, pending ? react_1["default"].createElement(Loader_1["default"], null) : success ? react_1["default"].createElement(react_feather_1.CheckCircle, { size: "16" }) : react_1["default"].createElement(react_feather_1.Triangle, { size: "16" })))));
}
exports["default"] = Transaction;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
