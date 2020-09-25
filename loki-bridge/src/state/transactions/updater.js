"use strict";
exports.__esModule = true;
exports.shouldCheck = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("../../hooks");
var hooks_2 = require("../application/hooks");
var actions_1 = require("./actions");
function shouldCheck(lastBlockNumber, tx) {
    if (tx.receipt)
        return false;
    if (!tx.lastCheckedBlockNumber)
        return true;
    var blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
    if (blocksSinceCheck < 1)
        return false;
    var minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return blocksSinceCheck > 9;
    }
    else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2;
    }
    else {
        // otherwise every block
        return true;
    }
}
exports.shouldCheck = shouldCheck;
function Updater() {
    var _a;
    var _b = hooks_1.useActiveWeb3React(), chainId = _b.chainId, library = _b.library;
    var lastBlockNumber = hooks_2.useBlockNumber();
    var dispatch = react_redux_1.useDispatch();
    var state = react_redux_1.useSelector(function (state) { return state.transactions; });
    var transactions = chainId ? (_a = state[chainId]) !== null && _a !== void 0 ? _a : {} : {};
    // show popup on confirm
    var addPopup = hooks_2.useAddPopup();
    react_1.useEffect(function () {
        if (!chainId || !library || !lastBlockNumber)
            return;
        Object.keys(transactions)
            .filter(function (hash) { return shouldCheck(lastBlockNumber, transactions[hash]); })
            .forEach(function (hash) {
            library
                .getTransactionReceipt(hash)
                .then(function (receipt) {
                var _a;
                if (receipt) {
                    dispatch(actions_1.finalizeTransaction({
                        chainId: chainId,
                        hash: hash,
                        receipt: {
                            blockHash: receipt.blockHash,
                            blockNumber: receipt.blockNumber,
                            contractAddress: receipt.contractAddress,
                            from: receipt.from,
                            status: receipt.status,
                            to: receipt.to,
                            transactionHash: receipt.transactionHash,
                            transactionIndex: receipt.transactionIndex
                        }
                    }));
                    addPopup({
                        txn: {
                            hash: hash,
                            success: receipt.status === 1,
                            summary: (_a = transactions[hash]) === null || _a === void 0 ? void 0 : _a.summary
                        }
                    }, hash);
                }
                else {
                    dispatch(actions_1.checkedTransaction({ chainId: chainId, hash: hash, blockNumber: lastBlockNumber }));
                }
            })["catch"](function (error) {
                console.error("failed to check transaction hash: " + hash, error);
            });
        });
    }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup]);
    return null;
}
exports["default"] = Updater;
