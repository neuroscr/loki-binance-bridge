"use strict";
exports.__esModule = true;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var constants_1 = require("../constants");
var Reserves_1 = require("../data/Reserves");
var hooks_1 = require("../hooks");
var wrappedCurrency_1 = require("./wrappedCurrency");
/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
function useUSDCPrice(currency) {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var wrapped = wrappedCurrency_1.wrappedCurrency(currency, chainId);
    var tokenPairs = react_1.useMemo(function () { return [
        [
            chainId && wrapped && sdk_1.currencyEquals(sdk_1.WETH[chainId], wrapped) ? undefined : currency,
            chainId ? sdk_1.WETH[chainId] : undefined
        ],
        [(wrapped === null || wrapped === void 0 ? void 0 : wrapped.equals(constants_1.USDC)) ? undefined : wrapped, chainId === sdk_1.ChainId.MAINNET ? constants_1.USDC : undefined],
        [chainId ? sdk_1.WETH[chainId] : undefined, chainId === sdk_1.ChainId.MAINNET ? constants_1.USDC : undefined]
    ]; }, [chainId, currency, wrapped]);
    var _a = Reserves_1.usePairs(tokenPairs), _b = _a[0], ethPairState = _b[0], ethPair = _b[1], _c = _a[1], usdcPairState = _c[0], usdcPair = _c[1], _d = _a[2], usdcEthPairState = _d[0], usdcEthPair = _d[1];
    return react_1.useMemo(function () {
        if (!currency || !wrapped || !chainId) {
            return undefined;
        }
        // handle weth/eth
        if (wrapped.equals(sdk_1.WETH[chainId])) {
            if (usdcPair) {
                var price = usdcPair.priceOf(sdk_1.WETH[chainId]);
                return new sdk_1.Price(currency, constants_1.USDC, price.denominator, price.numerator);
            }
            else {
                return undefined;
            }
        }
        // handle usdc
        if (wrapped.equals(constants_1.USDC)) {
            return new sdk_1.Price(constants_1.USDC, constants_1.USDC, '1', '1');
        }
        var ethPairETHAmount = ethPair === null || ethPair === void 0 ? void 0 : ethPair.reserveOf(sdk_1.WETH[chainId]);
        var ethPairETHUSDCValue = ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(sdk_1.WETH[chainId]).quote(ethPairETHAmount).raw : sdk_1.JSBI.BigInt(0);
        // all other tokens
        // first try the usdc pair
        if (usdcPairState === Reserves_1.PairState.EXISTS && usdcPair && usdcPair.reserveOf(constants_1.USDC).greaterThan(ethPairETHUSDCValue)) {
            var price = usdcPair.priceOf(wrapped);
            return new sdk_1.Price(currency, constants_1.USDC, price.denominator, price.numerator);
        }
        if (ethPairState === Reserves_1.PairState.EXISTS && ethPair && usdcEthPairState === Reserves_1.PairState.EXISTS && usdcEthPair) {
            if (usdcEthPair.reserveOf(constants_1.USDC).greaterThan('0') && ethPair.reserveOf(sdk_1.WETH[chainId]).greaterThan('0')) {
                var ethUsdcPrice = usdcEthPair.priceOf(constants_1.USDC);
                var currencyEthPrice = ethPair.priceOf(sdk_1.WETH[chainId]);
                var usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert();
                return new sdk_1.Price(currency, constants_1.USDC, usdcPrice.denominator, usdcPrice.numerator);
            }
        }
        return undefined;
    }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped]);
}
exports["default"] = useUSDCPrice;
