"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var hooks_1 = require("../../hooks");
var jazzicon_1 = __importDefault(require("jazzicon"));
var StyledIdenticonContainer = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 1rem;\n  width: 1rem;\n  border-radius: 1.125rem;\n  background-color: ", ";\n"], ["\n  height: 1rem;\n  width: 1rem;\n  border-radius: 1.125rem;\n  background-color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.bg4;
});
function Identicon() {
    var ref = react_1.useRef();
    var account = hooks_1.useActiveWeb3React().account;
    react_1.useEffect(function () {
        if (account && ref.current) {
            ref.current.innerHTML = '';
            ref.current.appendChild(jazzicon_1["default"](16, parseInt(account.slice(2, 10), 16)));
        }
    }, [account]);
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    return react_1["default"].createElement(StyledIdenticonContainer, { ref: ref });
}
exports["default"] = Identicon;
var templateObject_1;
