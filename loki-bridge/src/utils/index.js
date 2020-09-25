"use strict";
exports.__esModule = true;
exports.isTokenOnList = exports.escapeRegExp = exports.getRouterContract = exports.getContract = exports.getProviderOrSigner = exports.getSigner = exports.calculateSlippageAmount = exports.basisPointsToPercent = exports.calculateGasMargin = exports.shortenAddress = exports.getEtherscanLink = exports.isAddress = void 0;
var contracts_1 = require("@ethersproject/contracts");
var address_1 = require("@ethersproject/address");
var constants_1 = require("@ethersproject/constants");
var bignumber_1 = require("@ethersproject/bignumber");
var IUniswapV2Router02_json_1 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
var constants_2 = require("../constants");
var sdk_1 = require("@uniswap/sdk");
// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value) {
    try {
        return address_1.getAddress(value);
    }
    catch (_a) {
        return false;
    }
}
exports.isAddress = isAddress;
var ETHERSCAN_PREFIXES = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    5: 'goerli.',
    42: 'kovan.'
};
function getEtherscanLink(chainId, data, type) {
    var prefix = "https://" + (ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]) + "etherscan.io";
    switch (type) {
        case 'transaction': {
            return prefix + "/tx/" + data;
        }
        case 'token': {
            return prefix + "/token/" + data;
        }
        case 'address':
        default: {
            return prefix + "/address/" + data;
        }
    }
}
exports.getEtherscanLink = getEtherscanLink;
// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
function shortenAddress(address, chars) {
    if (chars === void 0) { chars = 4; }
    var parsed = isAddress(address);
    if (!parsed) {
        throw Error("Invalid 'address' parameter '" + address + "'.");
    }
    return parsed.substring(0, chars + 2) + "..." + parsed.substring(42 - chars);
}
exports.shortenAddress = shortenAddress;
// add 10%
function calculateGasMargin(value) {
    return value.mul(bignumber_1.BigNumber.from(10000).add(bignumber_1.BigNumber.from(1000))).div(bignumber_1.BigNumber.from(10000));
}
exports.calculateGasMargin = calculateGasMargin;
// converts a basis points value to a sdk percent
function basisPointsToPercent(num) {
    return new sdk_1.Percent(sdk_1.JSBI.BigInt(num), sdk_1.JSBI.BigInt(10000));
}
exports.basisPointsToPercent = basisPointsToPercent;
function calculateSlippageAmount(value, slippage) {
    if (slippage < 0 || slippage > 10000) {
        throw Error("Unexpected slippage value: " + slippage);
    }
    return [
        sdk_1.JSBI.divide(sdk_1.JSBI.multiply(value.raw, sdk_1.JSBI.BigInt(10000 - slippage)), sdk_1.JSBI.BigInt(10000)),
        sdk_1.JSBI.divide(sdk_1.JSBI.multiply(value.raw, sdk_1.JSBI.BigInt(10000 + slippage)), sdk_1.JSBI.BigInt(10000))
    ];
}
exports.calculateSlippageAmount = calculateSlippageAmount;
// account is not optional
function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked();
}
exports.getSigner = getSigner;
// account is optional
function getProviderOrSigner(library, account) {
    return account ? getSigner(library, account) : library;
}
exports.getProviderOrSigner = getProviderOrSigner;
// account is optional
function getContract(address, ABI, library, account) {
    if (!isAddress(address) || address === constants_1.AddressZero) {
        throw Error("Invalid 'address' parameter '" + address + "'.");
    }
    return new contracts_1.Contract(address, ABI, getProviderOrSigner(library, account));
}
exports.getContract = getContract;
// account is optional
function getRouterContract(_, library, account) {
    return getContract(constants_2.ROUTER_ADDRESS, IUniswapV2Router02_json_1.abi, library, account);
}
exports.getRouterContract = getRouterContract;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function isTokenOnList(defaultTokens, currency) {
    var _a;
    if (currency === sdk_1.ETHER)
        return true;
    return Boolean(currency instanceof sdk_1.Token && ((_a = defaultTokens[currency.chainId]) === null || _a === void 0 ? void 0 : _a[currency.address]));
}
exports.isTokenOnList = isTokenOnList;
