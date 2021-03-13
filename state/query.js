const ls = require('local-storage');
const IState = require('./IState');

const state = ls.bind(this, 'query');

const setState = newState => state(newState);

/**
 * Holds the value of the current key being pressed.
 */
const QueryState = {};
QueryState.prototype = Object.create(IState);

QueryState.getState = () => state();

QueryState.export = () => JSON.stringify(state());

QueryState.setQuery = (newQuery) => setState(newQuery);

module.exports = QueryState;
