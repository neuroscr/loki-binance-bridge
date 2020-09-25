"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useDefaultsFromURLSearch = exports.queryParametersToSwapState = exports.useDerivedSwapInfo = exports.tryParseAmount = exports.useSwapActionHandlers = exports.useSwapState = void 0;
var useENS_1 = __importDefault(require("../../hooks/useENS"));
var useToggledVersion_1 = require("../../hooks/useToggledVersion");
var units_1 = require("@ethersproject/units");
var sdk_1 = require("@uniswap/sdk");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var V1_1 = require("../../data/V1");
var hooks_1 = require("../../hooks");
var Tokens_1 = require("../../hooks/Tokens");
var Trades_1 = require("../../hooks/Trades");
var useParsedQueryString_1 = __importDefault(require("../../hooks/useParsedQueryString"));
var utils_1 = require("../../utils");
var hooks_2 = require("../wallet/hooks");
var actions_1 = require("./actions");
var useToggledVersion_2 = __importDefault(require("../../hooks/useToggledVersion"));
var hooks_3 = require("../user/hooks");
var prices_1 = require("../../utils/prices");
function useSwapState() {
    return react_redux_1.useSelector(function (state) { return state.swap; });
}
exports.useSwapState = useSwapState;
function useSwapActionHandlers() {
    var dispatch = react_redux_1.useDispatch();
    var onCurrencySelection = react_1.useCallback(function (field, currency) {
        dispatch(actions_1.selectCurrency({
            field: field,
            currencyId: currency instanceof sdk_1.Token ? currency.address : currency === sdk_1.ETHER ? 'ETH' : ''
        }));
    }, [dispatch]);
    var onSwitchTokens = react_1.useCallback(function () {
        dispatch(actions_1.switchCurrencies());
    }, [dispatch]);
    var onUserInput = react_1.useCallback(function (field, typedValue) {
        dispatch(actions_1.typeInput({ field: field, typedValue: typedValue }));
    }, [dispatch]);
    var onChangeRecipient = react_1.useCallback(function (recipient) {
        dispatch(actions_1.setRecipient({ recipient: recipient }));
    }, [dispatch]);
    return {
        onSwitchTokens: onSwitchTokens,
        onCurrencySelection: onCurrencySelection,
        onUserInput: onUserInput,
        onChangeRecipient: onChangeRecipient
    };
}
exports.useSwapActionHandlers = useSwapActionHandlers;
// try to parse a user entered amount for a given token
function tryParseAmount(value, currency) {
    if (!value || !currency) {
        return undefined;
    }
    try {
        var typedValueParsed = units_1.parseUnits(value, currency.decimals).toString();
        if (typedValueParsed !== '0') {
            return currency instanceof sdk_1.Token
                ? new sdk_1.TokenAmount(currency, sdk_1.JSBI.BigInt(typedValueParsed))
                : sdk_1.CurrencyAmount.ether(sdk_1.JSBI.BigInt(typedValueParsed));
        }
    }
    catch (error) {
        // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
        console.debug("Failed to parse input amount: \"" + value + "\"", error);
    }
    // necessary for all paths to return a value
    return undefined;
}
exports.tryParseAmount = tryParseAmount;
var BAD_RECIPIENT_ADDRESSES = [
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' // v2 router 02
];
/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade, checksummedAddress) {
    return (trade.route.path.some(function (token) { return token.address === checksummedAddress; }) ||
        trade.route.pairs.some(function (pair) { return pair.liquidityToken.address === checksummedAddress; }));
}
// from the current swap inputs, compute the best trade and return it.
function useDerivedSwapInfo() {
    var _a, _b;
    var _c, _d;
    var account = hooks_1.useActiveWeb3React().account;
    var toggledVersion = useToggledVersion_2["default"]();
    var _e = useSwapState(), independentField = _e.independentField, typedValue = _e.typedValue, _f = actions_1.Field.INPUT, inputCurrencyId = _e[_f].currencyId, _g = actions_1.Field.OUTPUT, outputCurrencyId = _e[_g].currencyId, recipient = _e.recipient;
    var inputCurrency = Tokens_1.useCurrency(inputCurrencyId);
    var outputCurrency = Tokens_1.useCurrency(outputCurrencyId);
    var recipientLookup = useENS_1["default"](recipient !== null && recipient !== void 0 ? recipient : undefined);
    var to = (_c = (recipient === null ? account : recipientLookup.address)) !== null && _c !== void 0 ? _c : null;
    var relevantTokenBalances = hooks_2.useCurrencyBalances(account !== null && account !== void 0 ? account : undefined, [
        inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined,
        outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined
    ]);
    var isExactIn = independentField === actions_1.Field.INPUT;
    var parsedAmount = tryParseAmount(typedValue, (_d = (isExactIn ? inputCurrency : outputCurrency)) !== null && _d !== void 0 ? _d : undefined);
    var bestTradeExactIn = Trades_1.useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined);
    var bestTradeExactOut = Trades_1.useTradeExactOut(inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined, !isExactIn ? parsedAmount : undefined);
    var v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;
    var currencyBalances = (_a = {},
        _a[actions_1.Field.INPUT] = relevantTokenBalances[0],
        _a[actions_1.Field.OUTPUT] = relevantTokenBalances[1],
        _a);
    var currencies = (_b = {},
        _b[actions_1.Field.INPUT] = inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined,
        _b[actions_1.Field.OUTPUT] = outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined,
        _b);
    // get link to trade on v1, if a better rate exists
    var v1Trade = V1_1.useV1Trade(isExactIn, currencies[actions_1.Field.INPUT], currencies[actions_1.Field.OUTPUT], parsedAmount);
    var inputError;
    if (!account) {
        inputError = 'Connect Wallet';
    }
    if (!parsedAmount) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Enter an amount';
    }
    if (!currencies[actions_1.Field.INPUT] || !currencies[actions_1.Field.OUTPUT]) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Select a token';
    }
    var formattedTo = utils_1.isAddress(to);
    if (!to || !formattedTo) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Enter a recipient';
    }
    else {
        if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
            (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
            (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))) {
            inputError = inputError !== null && inputError !== void 0 ? inputError : 'Invalid recipient';
        }
    }
    var allowedSlippage = hooks_3.useUserSlippageTolerance()[0];
    var slippageAdjustedAmounts = v2Trade && allowedSlippage && prices_1.computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);
    var slippageAdjustedAmountsV1 = v1Trade && allowedSlippage && prices_1.computeSlippageAdjustedAmounts(v1Trade, allowedSlippage);
    // compare input balance to max input based on version
    var _h = [
        currencyBalances[actions_1.Field.INPUT],
        toggledVersion === useToggledVersion_1.Version.v1
            ? slippageAdjustedAmountsV1
                ? slippageAdjustedAmountsV1[actions_1.Field.INPUT]
                : null
            : slippageAdjustedAmounts
                ? slippageAdjustedAmounts[actions_1.Field.INPUT]
                : null
    ], balanceIn = _h[0], amountIn = _h[1];
    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
        inputError = 'Insufficient ' + amountIn.currency.symbol + ' balance';
    }
    return {
        currencies: currencies,
        currencyBalances: currencyBalances,
        parsedAmount: parsedAmount,
        v2Trade: v2Trade !== null && v2Trade !== void 0 ? v2Trade : undefined,
        inputError: inputError,
        v1Trade: v1Trade
    };
}
exports.useDerivedSwapInfo = useDerivedSwapInfo;
function parseCurrencyFromURLParameter(urlParam) {
    if (typeof urlParam === 'string') {
        var valid = utils_1.isAddress(urlParam);
        if (valid)
            return valid;
        if (urlParam.toUpperCase() === 'ETH')
            return 'ETH';
        if (valid === false)
            return 'ETH';
    }
    return 'ETH' !== null && 'ETH' !== void 0 ? 'ETH' : '';
}
function parseTokenAmountURLParameter(urlParam) {
    return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : '';
}
function parseIndependentFieldURLParameter(urlParam) {
    return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? actions_1.Field.OUTPUT : actions_1.Field.INPUT;
}
var ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
var ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient) {
    if (typeof recipient !== 'string')
        return null;
    var address = utils_1.isAddress(recipient);
    if (address)
        return address;
    if (ENS_NAME_REGEX.test(recipient))
        return recipient;
    if (ADDRESS_REGEX.test(recipient))
        return recipient;
    return null;
}
function queryParametersToSwapState(parsedQs) {
    var _a;
    var inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
    var outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
    if (inputCurrency === outputCurrency) {
        if (typeof parsedQs.outputCurrency === 'string') {
            inputCurrency = '';
        }
        else {
            outputCurrency = '';
        }
    }
    var recipient = validatedRecipient(parsedQs.recipient);
    return _a = {},
        _a[actions_1.Field.INPUT] = {
            currencyId: inputCurrency
        },
        _a[actions_1.Field.OUTPUT] = {
            currencyId: outputCurrency
        },
        _a.typedValue = parseTokenAmountURLParameter(parsedQs.exactAmount),
        _a.independentField = parseIndependentFieldURLParameter(parsedQs.exactField),
        _a.recipient = recipient,
        _a;
}
exports.queryParametersToSwapState = queryParametersToSwapState;
// updates the swap state to use the defaults for a given network
function useDefaultsFromURLSearch() {
    var chainId = hooks_1.useActiveWeb3React().chainId;
    var dispatch = react_redux_1.useDispatch();
    var parsedQs = useParsedQueryString_1["default"]();
    var _a = react_1.useState(), result = _a[0], setResult = _a[1];
    react_1.useEffect(function () {
        if (!chainId)
            return;
        var parsed = queryParametersToSwapState(parsedQs);
        dispatch(actions_1.replaceSwapState({
            typedValue: parsed.typedValue,
            field: parsed.independentField,
            inputCurrencyId: parsed[actions_1.Field.INPUT].currencyId,
            outputCurrencyId: parsed[actions_1.Field.OUTPUT].currencyId,
            recipient: parsed.recipient
        }));
        setResult({ inputCurrencyId: parsed[actions_1.Field.INPUT].currencyId, outputCurrencyId: parsed[actions_1.Field.OUTPUT].currencyId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, chainId]);
    return result;
}
exports.useDefaultsFromURLSearch = useDefaultsFromURLSearch;
