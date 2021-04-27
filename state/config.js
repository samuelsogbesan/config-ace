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
  let allBinds = state();
  const binds = [];
  Object.keys(allBinds).forEach(bindCode => {
    let concatinatedCommands = `"`;
    let bindType = allBinds[bindCode]._meta.bindType;

    if (bindType === 'BindToggle') {
      let firstCommand = Object.keys(allBinds[bindCode])[1];
      concatinatedCommands = `${firstCommand};`;
    } else {
      Object.keys(allBinds[bindCode]).forEach(command => {
        let delimiter = allBinds[bindCode][command] === "" ? "" : " ";
        if(command === '_meta') return;
        else concatinatedCommands = concatinatedCommands.concat(`${command}${delimiter}${allBinds[bindCode][command]};`);
      });
    }

    concatinatedCommands = concatinatedCommands.concat(`"`);
    let bindString = `${bindType} "${bindCode}" ${concatinatedCommands}\n`;
    binds.push(bindString);
  });
  return binds;
}

ConfigState.getBind = (bindCode) => ConfigState.getState()[bindCode];

ConfigState.getIndividualBind = (bindCode, command) => ConfigState.getState()[bindCode][command];

ConfigState.removeBindAll = (bindCode) => {
  let s = ConfigState.getState();
  delete s[bindCode];

  setState(s);
}

ConfigState.removeBind = (bindCode, commandToRemove) => {
  let s = ConfigState.getState();
  if (s[bindCode]) {
    if (s[bindCode][commandToRemove] !== undefined) {
      delete s[bindCode][commandToRemove];
    }

    if (Object.keys(s[bindCode]).length === 1) delete s[bindCode];

    setState(s);
  } else {
    throw new Error(`No binds connected to ${bindCode}.`);
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
    s[bindCode] = {
      _meta: {
        bindType: 'bind',
        order: Object.keys(state()).length,
      }
    };
  }

  let command = newBinding.command;
  s[bindCode][command] = newBinding.value;

  setState(s);
}

ConfigState.setBindType = (bindCode, bindType) => {
  let s = ConfigState.getState();
  if (s[bindCode]) {
    if (!s[bindCode]._meta) {
      s[bindCode]._meta = {};
    }
    s[bindCode]._meta.bindType = bindType;
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

/**
 * Only to be used to completely override state with a new valid object.
 * @param {*} newState 
 */
ConfigState.loadStateDangerously = (newState) => {
  setState(newState);
}

module.exports = ConfigState;
