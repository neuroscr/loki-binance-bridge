"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MIGRATOR_ABI = exports.MIGRATOR_ADDRESS = void 0;
var migrator_json_1 = __importDefault(require("./migrator.json"));
exports.MIGRATOR_ABI = migrator_json_1["default"];
var MIGRATOR_ADDRESS = '0x16D4F26C15f3658ec65B1126ff27DD3dF2a2996b';
exports.MIGRATOR_ADDRESS = MIGRATOR_ADDRESS;
