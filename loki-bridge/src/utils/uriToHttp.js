"use strict";
exports.__esModule = true;
/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
function uriToHttp(uri) {
    var _a, _b;
    var protocol = uri.split(':')[0].toLowerCase();
    switch (protocol) {
        case 'https':
            return [uri];
        case 'http':
            return ['https' + uri.substr(4), uri];
        case 'ipfs':
            var hash = (_a = uri.match(/^ipfs:(\/\/)?(.*)$/i)) === null || _a === void 0 ? void 0 : _a[2];
            return ["https://cloudflare-ipfs.com/ipfs/" + hash + "/", "https://ipfs.io/ipfs/" + hash + "/"];
        case 'ipns':
            var name_1 = (_b = uri.match(/^ipns:(\/\/)?(.*)$/i)) === null || _b === void 0 ? void 0 : _b[2];
            return ["https://cloudflare-ipfs.com/ipns/" + name_1 + "/", "https://ipfs.io/ipns/" + name_1 + "/"];
        default:
            return [];
    }
}
exports["default"] = uriToHttp;
