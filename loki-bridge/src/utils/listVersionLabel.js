"use strict";
exports.__esModule = true;
function listVersionLabel(version) {
    return "v" + version.major + "." + version.minor + "." + version.patch;
}
exports["default"] = listVersionLabel;
