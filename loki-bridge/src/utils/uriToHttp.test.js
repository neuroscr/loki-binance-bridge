"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var uriToHttp_1 = __importDefault(require("./uriToHttp"));
describe('uriToHttp', function () {
    it('returns .eth.link for ens names', function () {
        expect(uriToHttp_1["default"]('t2crtokens.eth')).toEqual([]);
    });
    it('returns https first for http', function () {
        expect(uriToHttp_1["default"]('http://test.com')).toEqual(['https://test.com', 'http://test.com']);
    });
    it('returns https for https', function () {
        expect(uriToHttp_1["default"]('https://test.com')).toEqual(['https://test.com']);
    });
    it('returns ipfs gateways for ipfs:// urls', function () {
        expect(uriToHttp_1["default"]('ipfs://QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ')).toEqual([
            'https://cloudflare-ipfs.com/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/',
            'https://ipfs.io/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/'
        ]);
    });
    it('returns ipns gateways for ipns:// urls', function () {
        expect(uriToHttp_1["default"]('ipns://app.uniswap.org')).toEqual([
            'https://cloudflare-ipfs.com/ipns/app.uniswap.org/',
            'https://ipfs.io/ipns/app.uniswap.org/'
        ]);
    });
    it('returns empty array for invalid scheme', function () {
        expect(uriToHttp_1["default"]('blah:test')).toEqual([]);
    });
});
