"use strict";
exports.__esModule = true;
exports.useMintActionHandlers = exports.useDerivedMintInfo = exports.useMintState = void 0;
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
var ZERO = sdk_1.JSBI.BigInt(0);
function useMintState() {
    return react_redux_1.useSelector(function (state) { return state.mint; });
}
exports.useMintState = useMintState;
function useDerivedMintInfo(currencyA, currencyB) {
    var _a, _b;
    var _c, _d, _e, _f;
    var _g = hooks_1.useActiveWeb3React(), account = _g.account, chainId = _g.chainId;
    var _h = useMintState(), independentField = _h.independentField, typedValue = _h.typedValue, otherTypedValue = _h.otherTypedValue;
    var dependentField = independentField === actions_1.Field.CURRENCY_A ? actions_1.Field.CURRENCY_B : actions_1.Field.CURRENCY_A;
    // tokens
    var currencies = react_1.useMemo(function () {
        var _a;
        return (_a = {},
            _a[actions_1.Field.CURRENCY_A] = currencyA !== null && currencyA !== void 0 ? currencyA : undefined,
            _a[actions_1.Field.CURRENCY_B] = currencyB !== null && currencyB !== void 0 ? currencyB : undefined,
            _a);
    }, [currencyA, currencyB]);
    // pair
    var _j = Reserves_1.usePair(currencies[actions_1.Field.CURRENCY_A], currencies[actions_1.Field.CURRENCY_B]), pairState = _j[0], pair = _j[1];
    var totalSupply = TotalSupply_1.useTotalSupply(pair === null || pair === void 0 ? void 0 : pair.liquidityToken);
    var noLiquidity = pairState === Reserves_1.PairState.NOT_EXISTS || Boolean(totalSupply && sdk_1.JSBI.equal(totalSupply.raw, ZERO));
    // balances
    var balances = hooks_3.useCurrencyBalances(account !== null && account !== void 0 ? account : undefined, [
        currencies[actions_1.Field.CURRENCY_A],
        currencies[actions_1.Field.CURRENCY_B]
    ]);
    var currencyBalances = (_a = {},
        _a[actions_1.Field.CURRENCY_A] = balances[0],
        _a[actions_1.Field.CURRENCY_B] = balances[1],
        _a);
    // amounts
    var independentAmount = hooks_2.tryParseAmount(typedValue, currencies[independentField]);
    var dependentAmount = react_1.useMemo(function () {
        if (noLiquidity) {
            if (otherTypedValue && currencies[dependentField]) {
                return hooks_2.tryParseAmount(otherTypedValue, currencies[dependentField]);
            }
            return undefined;
        }
        else if (independentAmount) {
            // we wrap the currencies just to get the price in terms of the other token
            var wrappedIndependentAmount = wrappedCurrency_1.wrappedCurrencyAmount(independentAmount, chainId);
            var _a = [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)], tokenA = _a[0], tokenB = _a[1];
            if (tokenA && tokenB && wrappedIndependentAmount && pair) {
                var dependentCurrency = dependentField === actions_1.Field.CURRENCY_B ? currencyB : currencyA;
                var dependentTokenAmount = dependentField === actions_1.Field.CURRENCY_B
                    ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
                    : pair.priceOf(tokenB).quote(wrappedIndependentAmount);
                return dependentCurrency === sdk_1.ETHER ? sdk_1.CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount;
            }
            return undefined;
        }
        else {
            return undefined;
        }
    }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, chainId, currencyB, pair]);
    var parsedAmounts = (_b = {},
        _b[actions_1.Field.CURRENCY_A] = independentField === actions_1.Field.CURRENCY_A ? independentAmount : dependentAmount,
        _b[actions_1.Field.CURRENCY_B] = independentField === actions_1.Field.CURRENCY_A ? dependentAmount : independentAmount,
        _b);
    var price = react_1.useMemo(function () {
        if (noLiquidity) {
            var _a = parsedAmounts, _b = actions_1.Field.CURRENCY_A, currencyAAmount_1 = _a[_b], _c = actions_1.Field.CURRENCY_B, currencyBAmount_1 = _a[_c];
            if (currencyAAmount_1 && currencyBAmount_1) {
                return new sdk_1.Price(currencyAAmount_1.currency, currencyBAmount_1.currency, currencyAAmount_1.raw, currencyBAmount_1.raw);
            }
            return undefined;
        }
        else {
            var wrappedCurrencyA = wrappedCurrency_1.wrappedCurrency(currencyA, chainId);
            return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined;
        }
    }, [chainId, currencyA, noLiquidity, pair, parsedAmounts]);
    // liquidity minted
    var liquidityMinted = react_1.useMemo(function () {
        var _a = parsedAmounts, _b = actions_1.Field.CURRENCY_A, currencyAAmount = _a[_b], _c = actions_1.Field.CURRENCY_B, currencyBAmount = _a[_c];
        var _d = [
            wrappedCurrency_1.wrappedCurrencyAmount(currencyAAmount, chainId),
            wrappedCurrency_1.wrappedCurrencyAmount(currencyBAmount, chainId)
        ], tokenAmountA = _d[0], tokenAmountB = _d[1];
        if (pair && totalSupply && tokenAmountA && tokenAmountB) {
            return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
        }
        else {
            return undefined;
        }
    }, [parsedAmounts, chainId, pair, totalSupply]);
    var poolTokenPercentage = react_1.useMemo(function () {
        if (liquidityMinted && totalSupply) {
            return new sdk_1.Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw);
        }
        else {
            return undefined;
        }
    }, [liquidityMinted, totalSupply]);
    var error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (pairState === Reserves_1.PairState.INVALID) {
        error = error !== null && error !== void 0 ? error : 'Invalid pair';
    }
    if (!parsedAmounts[actions_1.Field.CURRENCY_A] || !parsedAmounts[actions_1.Field.CURRENCY_B]) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    var _k = parsedAmounts, _l = actions_1.Field.CURRENCY_A, currencyAAmount = _k[_l], _m = actions_1.Field.CURRENCY_B, currencyBAmount = _k[_m];
    if (currencyAAmount && ((_c = currencyBalances === null || currencyBalances === void 0 ? void 0 : currencyBalances[actions_1.Field.CURRENCY_A]) === null || _c === void 0 ? void 0 : _c.lessThan(currencyAAmount))) {
        error = 'Insufficient ' + ((_d = currencies[actions_1.Field.CURRENCY_A]) === null || _d === void 0 ? void 0 : _d.symbol) + ' balance';
    }
    if (currencyBAmount && ((_e = currencyBalances === null || currencyBalances === void 0 ? void 0 : currencyBalances[actions_1.Field.CURRENCY_B]) === null || _e === void 0 ? void 0 : _e.lessThan(currencyBAmount))) {
        error = 'Insufficient ' + ((_f = currencies[actions_1.Field.CURRENCY_B]) === null || _f === void 0 ? void 0 : _f.symbol) + ' balance';
    }
    return {
        dependentField: dependentField,
        currencies: currencies,
        pair: pair,
        pairState: pairState,
        currencyBalances: currencyBalances,
        parsedAmounts: parsedAmounts,
        price: price,
        noLiquidity: noLiquidity,
        liquidityMinted: liquidityMinted,
        poolTokenPercentage: poolTokenPercentage,
        error: error
    };
}
exports.useDerivedMintInfo = useDerivedMintInfo;
function useMintActionHandlers(noLiquidity) {
    var dispatch = react_redux_1.useDispatch();
    var onFieldAInput = react_1.useCallback(function (typedValue) {
        dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_A, typedValue: typedValue, noLiquidity: noLiquidity === true }));
    }, [dispatch, noLiquidity]);
    var onFieldBInput = react_1.useCallback(function (typedValue) {
        dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_B, typedValue: typedValue, noLiquidity: noLiquidity === true }));
    }, [dispatch, noLiquidity]);
    return {
        onFieldAInput: onFieldAInput,
        onFieldBInput: onFieldBInput
    };
}
exports.useMintActionHandlers = useMintActionHandlers;
