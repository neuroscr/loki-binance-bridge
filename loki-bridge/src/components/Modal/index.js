"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var react_spring_1 = require("react-spring");
var dialog_1 = require("@reach/dialog");
var react_device_detect_1 = require("react-device-detect");
require("@reach/dialog/styles.css");
var polished_1 = require("polished");
var react_use_gesture_1 = require("react-use-gesture");
var AnimatedDialogOverlay = react_spring_1.animated(dialog_1.DialogOverlay);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var StyledDialogOverlay = styled_components_1["default"](AnimatedDialogOverlay)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &[data-reach-dialog-overlay] {\n    z-index: 2;\n    background-color: transparent;\n    overflow: hidden;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    background-color: ", ";\n  }\n"], ["\n  &[data-reach-dialog-overlay] {\n    z-index: 2;\n    background-color: transparent;\n    overflow: hidden;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    background-color: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.modalBG;
});
var AnimatedDialogContent = react_spring_1.animated(dialog_1.DialogContent);
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var StyledDialogContent = styled_components_1["default"](function (_a) {
    var minHeight = _a.minHeight, maxHeight = _a.maxHeight, mobile = _a.mobile, isOpen = _a.isOpen, rest = __rest(_a, ["minHeight", "maxHeight", "mobile", "isOpen"]);
    return (react_1["default"].createElement(AnimatedDialogContent, __assign({}, rest)));
}).attrs({
    'aria-label': 'dialog'
})(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  &[data-reach-dialog-content] {\n    margin: 0 0 2rem 0;\n    border: 1px solid ", ";\n    background-color: ", ";\n    box-shadow: 0 4px 8px 0 ", ";\n    padding: 0px;\n    width: 50vw;\n    overflow: hidden;\n\n    align-self: ", ";\n\n    max-width: 420px;\n    ", "\n    ", "\n    display: flex;\n    border-radius: 20px;\n    ", "\n    ", "\n  }\n"], ["\n  &[data-reach-dialog-content] {\n    margin: 0 0 2rem 0;\n    border: 1px solid ", ";\n    background-color: ", ";\n    box-shadow: 0 4px 8px 0 ", ";\n    padding: 0px;\n    width: 50vw;\n    overflow: hidden;\n\n    align-self: ", ";\n\n    max-width: 420px;\n    ",
    "\n    ",
    "\n    display: flex;\n    border-radius: 20px;\n    ",
    "\n    ",
    "\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.bg1;
}, function (_a) {
    var theme = _a.theme;
    return theme.bg1;
}, function (_a) {
    var theme = _a.theme;
    return polished_1.transparentize(0.95, theme.shadow1);
}, function (_a) {
    var mobile = _a.mobile;
    return (mobile ? 'flex-end' : 'center');
}, function (_a) {
    var maxHeight = _a.maxHeight;
    return maxHeight && styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        max-height: ", "vh;\n      "], ["\n        max-height: ", "vh;\n      "])), maxHeight);
}, function (_a) {
    var minHeight = _a.minHeight;
    return minHeight && styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        min-height: ", "vh;\n      "], ["\n        min-height: ", "vh;\n      "])), minHeight);
}, function (_a) {
    var theme = _a.theme;
    return theme.mediaWidth.upToMedium(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      width: 65vw;\n      margin: 0;\n    "], ["\n      width: 65vw;\n      margin: 0;\n    "])));
}, function (_a) {
    var theme = _a.theme, mobile = _a.mobile;
    return theme.mediaWidth.upToSmall(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      width:  85vw;\n      ", "\n    "], ["\n      width:  85vw;\n      ",
        "\n    "])), mobile && styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n          width: 100vw;\n          border-radius: 20px;\n          border-bottom-left-radius: 0;\n          border-bottom-right-radius: 0;\n        "], ["\n          width: 100vw;\n          border-radius: 20px;\n          border-bottom-left-radius: 0;\n          border-bottom-right-radius: 0;\n        "]))));
});
function Modal(_a) {
    var isOpen = _a.isOpen, onDismiss = _a.onDismiss, _b = _a.minHeight, minHeight = _b === void 0 ? false : _b, _c = _a.maxHeight, maxHeight = _c === void 0 ? 50 : _c, initialFocusRef = _a.initialFocusRef, children = _a.children;
    var fadeTransition = react_spring_1.useTransition(isOpen, null, {
        config: { duration: 200 },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    });
    var _d = react_spring_1.useSpring(function () { return ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }); }), y = _d[0].y, set = _d[1];
    var bind = react_use_gesture_1.useGesture({
        onDrag: function (state) {
            set({
                y: state.down ? state.movement[1] : 0
            });
            if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
                onDismiss();
            }
        }
    });
    return (react_1["default"].createElement(react_1["default"].Fragment, null, fadeTransition.map(function (_a) {
        var item = _a.item, key = _a.key, props = _a.props;
        return item && (react_1["default"].createElement(StyledDialogOverlay, { key: key, style: props, onDismiss: onDismiss, initialFocusRef: initialFocusRef },
            react_1["default"].createElement(StyledDialogContent, __assign({}, (react_device_detect_1.isMobile
                ? __assign(__assign({}, bind()), { style: { transform: y.interpolate(function (y) { return "translateY(" + (y > 0 ? y : 0) + "px)"; }) } }) : {}), { "aria-label": "dialog content", minHeight: minHeight, maxHeight: maxHeight, mobile: react_device_detect_1.isMobile }),
                !initialFocusRef && react_device_detect_1.isMobile ? react_1["default"].createElement("div", { tabIndex: 1 }) : null,
                children)));
    })));
}
exports["default"] = Modal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
