"use strict";
exports.__esModule = true;
exports.parseENSAddress = void 0;
var ENS_NAME_REGEX = /^(([a-zA-Z0-9]+\.)+)eth(\/.*)?$/;
function parseENSAddress(ensAddress) {
    var match = ensAddress.match(ENS_NAME_REGEX);
    if (!match)
        return undefined;
    return { ensName: match[1].toLowerCase() + "eth", ensPath: match[3] };
}
exports.parseENSAddress = parseENSAddress;
