"use strict";
exports.__esModule = true;
exports.useBurnActionHandlers = exports.useDerivedBurnInfo = exports.useBurnState = void 0;
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var Reserves_1 = require("../../data/Reserves");
var TotalSupply_1 = require("../../data/TotalSupply");
var hooks_1 = require("../../hooks");
var wrappedCurrency_1 = require("../../utils/wrappedCurrency");
var hooks_2 = require("../swap/hooks");
var hooks_3 = require("../wallet/hooks");
var actions_1 = require("./actions");
function useBurnState() {
    return react_redux_1.useSelector(function (state) { return state.burn; });
}
exports.useBurnState = useBurnState;
function useDerivedBurnInfo(currencyA, currencyB) {
    var _a, _b, _c;
    var _d, _e;
    var _f = hooks_1.useActiveWeb3React(), account = _f.account, chainId = _f.chainId;
    var _g = useBurnState(), independentField = _g.independentField, typedValue = _g.typedValue;
    // pair + totalsupply
    var _h = Reserves_1.usePair(currencyA, currencyB), pair = _h[1];
    // balances
    var relevantTokenBalances = hooks_3.useTokenBalances(account !== null && account !== void 0 ? account : undefined, [pair === null || pair === void 0 ? void 0 : pair.liquidityToken]);
    var userLiquidity = relevantTokenBalances === null || relevantTokenBalances === void 0 ? void 0 : relevantTokenBalances[(_e = (_d = pair === null || pair === void 0 ? void 0 : pair.liquidityToken) === null || _d === void 0 ? void 0 : _d.address) !== null && _e !== void 0 ? _e : ''];
    var _j = [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)], tokenA = _j[0], tokenB = _j[1];
    var tokens = (_a = {},
        _a[actions_1.Field.CURRENCY_A] = tokenA,
        _a[actions_1.Field.CURRENCY_B] = tokenB,
        _a[actions_1.Field.LIQUIDITY] = pair === null || pair === void 0 ? void 0 : pair.liquidityToken,
        _a);
    // liquidity values
    var totalSupply = TotalSupply_1.useTotalSupply(pair === null || pair === void 0 ? void 0 : pair.liquidityToken);
    var liquidityValueA = pair &&
        totalSupply &&
        userLiquidity &&
        tokenA &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
        ? new sdk_1.TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
        : undefined;
    var liquidityValueB = pair &&
        totalSupply &&
        userLiquidity &&
        tokenB &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
        ? new sdk_1.TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
        : undefined;
    var liquidityValues = (_b = {},
        _b[actions_1.Field.CURRENCY_A] = liquidityValueA,
        _b[actions_1.Field.CURRENCY_B] = liquidityValueB,
        _b);
    var percentToRemove = new sdk_1.Percent('0', '100');
    // user specified a %
    if (independentField === actions_1.Field.LIQUIDITY_PERCENT) {
        percentToRemove = new sdk_1.Percent(typedValue, '100');
    }
    // user specified a specific amount of liquidity tokens
    else if (independentField === actions_1.Field.LIQUIDITY) {
        if (pair === null || pair === void 0 ? void 0 : pair.liquidityToken) {
            var independentAmount = hooks_2.tryParseAmount(typedValue, pair.liquidityToken);
            if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
                percentToRemove = new sdk_1.Percent(independentAmount.raw, userLiquidity.raw);
            }
        }
    }
    // user specified a specific amount of token a or b
    else {
        if (tokens[independentField]) {
            var independentAmount = hooks_2.tryParseAmount(typedValue, tokens[independentField]);
            var liquidityValue = liquidityValues[independentField];
            if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
                percentToRemove = new sdk_1.Percent(independentAmount.raw, liquidityValue.raw);
            }
        }
    }
    var parsedAmounts = (_c = {},
        _c[actions_1.Field.LIQUIDITY_PERCENT] = percentToRemove,
        _c[actions_1.Field.LIQUIDITY] = userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
            ? new sdk_1.TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
            : undefined,
        _c[actions_1.Field.CURRENCY_A] = tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
            ? new sdk_1.TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
            : undefined,
        _c[actions_1.Field.CURRENCY_B] = tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
            ? new sdk_1.TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
            : undefined,
        _c);
    var error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (!parsedAmounts[actions_1.Field.LIQUIDITY] || !parsedAmounts[actions_1.Field.CURRENCY_A] || !parsedAmounts[actions_1.Field.CURRENCY_B]) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    return { pair: pair, parsedAmounts: parsedAmounts, error: error };
}
exports.useDerivedBurnInfo = useDerivedBurnInfo;
function useBurnActionHandlers() {
    var dispatch = react_redux_1.useDispatch();
    var onUserInput = react_1.useCallback(function (field, typedValue) {
        dispatch(actions_1.typeInput({ field: field, typedValue: typedValue }));
    }, [dispatch]);
    return {
        onUserInput: onUserInput
    };
}
exports.useBurnActionHandlers = useBurnActionHandlers;
