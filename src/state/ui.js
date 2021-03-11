const ConfigState = require('./config');

/**
 * Basic UI Manager
 */
const UITargets = {
  Tray: document.getElementById('search-results'),
  InstructionBox: document.getElementById('instruction-box'),
  Keyboard: document.getElementById('keyboard')
}

const UIManagementTools = {}

UIManagementTools.closeTray = () => UITargets.Tray.classList.add('hidden');

UIManagementTools.openTray = () => UITargets.Tray.classList.remove('hidden');

UIManagementTools.submitSearch = () => document.getElementById('main-submit').click();

UIManagementTools.warnToast = (instruction) => {
  UITargets.InstructionBox.classList.remove('hint');
  UITargets.InstructionBox.classList.add('warm');
  UITargets.InstructionBox.innerHTML = instruction;
}

UIManagementTools.hintToast = (instruction) => {
  UITargets.InstructionBox.classList.remove('warn');
  UITargets.InstructionBox.classList.add('hint');
  UITargets.InstructionBox.innerHTML = instruction;
}

UIManagementTools.flashToast = (message, oldMessage = UITargets.InstructionBox.innerHTML) => {
  UITargets.InstructionBox.textContent = message;
  setTimeout(() => {
    UITargets.InstructionBox.textContent = oldMessage;
  }, 600);
}

UIManagementTools.refreshBindCounter = (bind) => {
  const bindCount = ConfigState.getBind(bind).length;
  const selector = `.key[data-bindcode="${bind}"]`;
  const keyElement = document.querySelector(selector);
  keyElement.setAttribute('data-bindcount', bindCount);
}

UIManagementTools.clearBindCounters = () => {
  let keys = UITargets.Keyboard.children;

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    key.removeAttribute('data-bindcount');
  }
}

/**
 * 
 * @param {*} results an array of results
 * @param {*} effect a side effect to call on each result on creation. Useful for modifying results against some criteria.
 */
UIManagementTools.refreshSearchResults = (results, effect = (result, option = document.createElement('option')) => {}) => {
  let resultsContainer = UITargets.Tray;

  for (var i = 0; i < results.length; i++) {
    const option = document.createElement('option');
    option.value = results[i];
    option.name = results[i];
    option.innerHTML = results[i];

    effect(results[i], option);
    //if (BoundCommandSet.size > 0 && BoundCommandSet.has(results[i])) option.classList.add('bound');
    resultsContainer.appendChild(option);
  }

  let pageSize = results.length < 10 ? results.length : 10;
  resultsContainer.setAttribute('size', pageSize);
}

module.exports = UIManagementTools;
