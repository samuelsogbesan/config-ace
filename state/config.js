const ls = require('local-storage');
const IState = require('./IState');

const state = ls.bind(this, 'config');

if (!state()) {
  state({});
}

const setState = newState => state(newState);

const ConfigState = {};
ConfigState.prototype = Object.create(IState);

ConfigState.getState = () => state();

ConfigState.toString = () => JSON.stringify(state());

/**
 * The binds returned as an array of bind strings.
 */
ConfigState.export = () => {
  let s = state();

  const binds = [];
  Object.keys(s).forEach(key => {
    let bindString = `bind "${key}" "`;
    s[key].forEach(({command, value}) => { 
      bindString = bindString.concat(`${command} ${value};`);
    });
    bindString = bindString.concat(`"\n`);
    binds.push(bindString);
  });
  return binds;
}

ConfigState.getBind = (bindCode) => ConfigState.getState()[bindCode];

ConfigState.removeBindAll = (bindCode) => {
  let s = ConfigState.getState();
  delete s[bindCode];

  setState(s);
}

ConfigState.removeBind = (bindCode, commandToRemove) => {
  let s = ConfigState.getState();
  if (s[bindCode]) {
    const index = s[bindCode].findIndex(value => value.command === commandToRemove);
    if (index >= 0) {
      s[bindCode] = s[bindCode].splice(0, index).concat(s[bindCode].splice(index+1, s[bindCode].length));
      setState(s);
    }
  } else {
    throw new Error(`${bindCode} is not a valid bind code.`);
  }
}

ConfigState.clear = () => setState({});

/**
 * 
 * @param {*} bindCode
 * @param {*} newBinding on object {commandName, commandValue}
 * TODO make it update binds
 */
ConfigState.addBind = (bindCode, newBinding) => { 
  let s = ConfigState.getState();
  if (!s[bindCode]) {
    s[bindCode] = [];
  }

  let index = s[bindCode].findIndex(binding => binding.command === newBinding.command);
  if (index >= 0) {
    s[bindCode][index].value = newBinding.value;
  } else {
    s[bindCode].push(newBinding);
  }

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
