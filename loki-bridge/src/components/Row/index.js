"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.RowFixed = exports.AutoRow = exports.RowFlat = exports.RowBetween = void 0;
var styled_components_1 = __importDefault(require("styled-components"));
var styled_components_2 = require("rebass/styled-components");
var Row = styled_components_1["default"](styled_components_2.Box)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  display: flex;\n  padding: 0;\n  align-items: ", ";\n  padding: ", ";\n  border: ", ";\n  border-radius: ", ";\n"], ["\n  width: 100%;\n  display: flex;\n  padding: 0;\n  align-items: ", ";\n  padding: ", ";\n  border: ", ";\n  border-radius: ", ";\n"])), function (_a) {
    var align = _a.align;
    return (align ? align : 'center');
}, function (_a) {
    var padding = _a.padding;
    return padding;
}, function (_a) {
    var border = _a.border;
    return border;
}, function (_a) {
    var borderRadius = _a.borderRadius;
    return borderRadius;
});
exports.RowBetween = styled_components_1["default"](Row)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  justify-content: space-between;\n"], ["\n  justify-content: space-between;\n"])));
exports.RowFlat = styled_components_1["default"].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: flex-end;\n"], ["\n  display: flex;\n  align-items: flex-end;\n"])));
exports.AutoRow = styled_components_1["default"](Row)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex-wrap: wrap;\n  margin: ", ";\n  justify-content: ", ";\n\n  & > * {\n    margin: ", " !important;\n  }\n"], ["\n  flex-wrap: wrap;\n  margin: ", ";\n  justify-content: ", ";\n\n  & > * {\n    margin: ", " !important;\n  }\n"])), function (_a) {
    var gap = _a.gap;
    return gap && "-" + gap;
}, function (_a) {
    var justify = _a.justify;
    return justify && justify;
}, function (_a) {
    var gap = _a.gap;
    return gap;
});
exports.RowFixed = styled_components_1["default"](Row)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: fit-content;\n  margin: ", ";\n"], ["\n  width: fit-content;\n  margin: ", ";\n"])), function (_a) {
    var gap = _a.gap;
    return gap && "-" + gap;
});
exports["default"] = Row;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
