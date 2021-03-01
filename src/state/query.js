const ls = require('local-storage');
const IState = require('./IState');

const state = ls.bind(this, 'config');

const setState = newState => state(newState);

const QueryState = {};
QueryState.prototype = Object.create(IState);

QueryState.getState = () => state();

QueryState.export = () => JSON.stringify(state());

QueryState.setQuery = (newQuery) => setState(newQuery);

module.exports = query;
