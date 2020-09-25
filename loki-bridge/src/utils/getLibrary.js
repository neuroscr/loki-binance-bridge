"use strict";
exports.__esModule = true;
var providers_1 = require("@ethersproject/providers");
function getLibrary(provider) {
    var library = new providers_1.Web3Provider(provider);
    library.pollingInterval = 15000;
    return library;
}
exports["default"] = getLibrary;
