"use strict";
exports.__esModule = true;
exports.rejectVersionUpdate = exports.selectList = exports.removeList = exports.addList = exports.acceptListUpdate = exports.fetchTokenList = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
exports.fetchTokenList = {
    pending: toolkit_1.createAction('lists/fetchTokenList/pending'),
    fulfilled: toolkit_1.createAction('lists/fetchTokenList/fulfilled'),
    rejected: toolkit_1.createAction('lists/fetchTokenList/rejected')
};
exports.acceptListUpdate = toolkit_1.createAction('lists/acceptListUpdate');
exports.addList = toolkit_1.createAction('lists/addList');
exports.removeList = toolkit_1.createAction('lists/removeList');
exports.selectList = toolkit_1.createAction('lists/selectList');
exports.rejectVersionUpdate = toolkit_1.createAction('lists/rejectVersionUpdate');
