"use strict";
exports.__esModule = true;
var parseENSAddress_1 = require("./parseENSAddress");
describe('parseENSAddress', function () {
    it('test cases', function () {
        expect(parseENSAddress_1.parseENSAddress('hello.eth')).toEqual({ ensName: 'hello.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('hello.eth/')).toEqual({ ensName: 'hello.eth', ensPath: '/' });
        expect(parseENSAddress_1.parseENSAddress('hello.world.eth/')).toEqual({ ensName: 'hello.world.eth', ensPath: '/' });
        expect(parseENSAddress_1.parseENSAddress('hello.world.eth/abcdef')).toEqual({ ensName: 'hello.world.eth', ensPath: '/abcdef' });
        expect(parseENSAddress_1.parseENSAddress('abso.lutely')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('abso.lutely.eth')).toEqual({ ensName: 'abso.lutely.eth', ensPath: undefined });
        expect(parseENSAddress_1.parseENSAddress('eth')).toEqual(undefined);
        expect(parseENSAddress_1.parseENSAddress('eth/hello-world')).toEqual(undefined);
    });
});
