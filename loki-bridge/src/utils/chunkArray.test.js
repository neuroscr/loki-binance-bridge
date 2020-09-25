"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var chunkArray_1 = __importDefault(require("./chunkArray"));
describe('#chunkArray', function () {
    it('size 1', function () {
        expect(chunkArray_1["default"]([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
    it('size 0 throws', function () {
        expect(function () { return chunkArray_1["default"]([1, 2, 3], 0); }).toThrow('maxChunkSize must be gte 1');
    });
    it('size gte items', function () {
        expect(chunkArray_1["default"]([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
        expect(chunkArray_1["default"]([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
    });
    it('size exact half', function () {
        expect(chunkArray_1["default"]([1, 2, 3, 4], 2)).toEqual([
            [1, 2],
            [3, 4]
        ]);
    });
    it('evenly distributes', function () {
        var chunked = chunkArray_1["default"](__spreadArrays(Array(100).keys()), 40);
        expect(chunked).toEqual([
            __spreadArrays(Array(34).keys()),
            __spreadArrays(Array(34).keys()).map(function (i) { return i + 34; }),
            __spreadArrays(Array(32).keys()).map(function (i) { return i + 68; })
        ]);
        expect(chunked[0][0]).toEqual(0);
        expect(chunked[2][31]).toEqual(99);
    });
});
