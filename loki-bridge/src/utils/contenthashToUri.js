"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.hexToUint8Array = void 0;
var cids_1 = __importDefault(require("cids"));
var multicodec_1 = require("multicodec");
var multihashes_1 = require("multihashes");
function hexToUint8Array(hex) {
    hex = hex.startsWith('0x') ? hex.substr(2) : hex;
    if (hex.length % 2 !== 0)
        throw new Error('hex must have length that is multiple of 2');
    var arr = new Uint8Array(hex.length / 2);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return arr;
}
exports.hexToUint8Array = hexToUint8Array;
var UTF_8_DECODER = new TextDecoder();
/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
function contenthashToUri(contenthash) {
    var buff = hexToUint8Array(contenthash);
    var codec = multicodec_1.getCodec(buff); // the typing is wrong for @types/multicodec
    switch (codec) {
        case 'ipfs-ns': {
            var data = multicodec_1.rmPrefix(buff);
            var cid = new cids_1["default"](data);
            return "ipfs://" + multihashes_1.toB58String(cid.multihash);
        }
        case 'ipns-ns': {
            var data = multicodec_1.rmPrefix(buff);
            var cid = new cids_1["default"](data);
            var multihash = multihashes_1.decode(cid.multihash);
            if (multihash.name === 'identity') {
                return "ipns://" + UTF_8_DECODER.decode(multihash.digest).trim();
            }
            else {
                return "ipns://" + multihashes_1.toB58String(cid.multihash);
            }
        }
        default:
            throw new Error("Unrecognized codec: " + codec);
    }
}
exports["default"] = contenthashToUri;
