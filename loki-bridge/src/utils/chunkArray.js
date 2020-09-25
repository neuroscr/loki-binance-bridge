"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
// chunks array into chunks of maximum size
// evenly distributes items among the chunks
function chunkArray(items, maxChunkSize) {
    if (maxChunkSize < 1)
        throw new Error('maxChunkSize must be gte 1');
    if (items.length <= maxChunkSize)
        return [items];
    var numChunks = Math.ceil(items.length / maxChunkSize);
    var chunkSize = Math.ceil(items.length / numChunks);
    return __spreadArrays(Array(numChunks).keys()).map(function (ix) { return items.slice(ix * chunkSize, ix * chunkSize + chunkSize); });
}
exports["default"] = chunkArray;
