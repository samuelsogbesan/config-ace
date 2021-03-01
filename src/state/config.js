const ls = require('local-storage');
const IState = require('./IState');

const state = ls.bind(this, 'config');

const setState = newState => state(newState);

const ConfigState = {};
ConfigState.prototype = Object.create(IState);

ConfigState.getState = () => state();

ConfigState.export = () => JSON.stringify(state());

ConfigState.getBind = (bindCode) => ConfigState.getState()[bindCode];

ConfigState.removeBindAll = (bindCode) => {
  let s = ConfigState.getState();
  delete s[bindCode];

  setState(s);
}

ConfigState.removeBind = (bindCode, commandToRemove) => {
  let s = ConfigState.getState();
  if (s[bindCode]) {
    const index = s[bindCode].findIndex(value => s[bindCode].command === commandToRemove.command);
    if (index >= 0) {
      s[bindCode] = s[bindCode].splice(index, 1);
      setState(s);
    } 
  } else {
    throw new Error(`${bindCode} is not a valid bind code.`);
  }
}

/**
 * 
 * @param {*} bindCode
 * @param {*} command on object {commandName, commandValue}
 * TODO make it update binds
 */
ConfigState.addBind = (bindCode, command) => {
  let s = ConfigState.getState();
  if (!s[bindCode]) {
    s[bindCode] = [];
  }

  // doesnt account for commands that already exist
  s[bindCode].push(command);
  setState(s);
}

ConfigState.swapBind = (bindCode, oldOrder, newOrder) => {
  let s = ConfigState.getState();
  if (!s[bindCode]) throw new Error(`No bind ${bindCode}.`);

  let binds = s[bindCode];

  let temp = binds[oldOrder];
  binds[oldOrder] = binds[newOrder];
  binds[newOrder] = temp;

  setState(s);
}

module.exports = ConfigState;
