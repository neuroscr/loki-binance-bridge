"use strict";
exports.__esModule = true;
exports.checkedTransaction = exports.finalizeTransaction = exports.clearAllTransactions = exports.addTransaction = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
exports.addTransaction = toolkit_1.createAction('transactions/addTransaction');
exports.clearAllTransactions = toolkit_1.createAction('transactions/clearAllTransactions');
exports.finalizeTransaction = toolkit_1.createAction('transactions/finalizeTransaction');
exports.checkedTransaction = toolkit_1.createAction('transactions/checkedTransaction');
