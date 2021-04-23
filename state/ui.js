const ConfigState = require('./config');
const QueryState = require('./query');

/**
 * Basic UI Manager
 */
const UITargets = {
  ResultsContainer: document.getElementById('search-form-results-container'),
  SearchResultsTarget: document.getElementById('search-results'),
  InstructionBox: document.getElementById('instruction-box'),
  ToastContainer: document.getElementById('toast'),
  Keyboard: document.getElementById('keyboard'),
  CommandValueInputContainer: document.getElementById('search-form-value-container'),
  CommandValueInput: document.getElementById('command-value-input'),
  SearchSubmitContainer: document.getElementById('search-form-submit-container'),
  BindTypeInputContainer: document.getElementById('search-form-bindtype-container'),
  ContentBlocker: document.getElementById('content-blocker'),
  DeleteButton: document.getElementById('search-results-submit-delete'),
  Popup: document.getElementById('popup-container'),
  ConfigPanel: document.getElementById('config-panel'),
  Tray: document.getElementById('search-tray')
}

const UIManagementTools = {}

UIManagementTools.updateCommandValueInputPrompt = prompt => {
  UITargets.CommandValueInput.value = prompt;
}

UIManagementTools.closeTray = () => {
  UITargets.ResultsContainer.classList.add('hidden');
  UITargets.CommandValueInputContainer.classList.add('hidden');
  UITargets.ResultsContainer.blur();
  UITargets.CommandValueInputContainer.blur();
  UITargets.BindTypeInputContainer.children[0].children[0].click();
  UITargets.SearchSubmitContainer.classList.add('hidden');
  UITargets.BindTypeInputContainer.classList.add('hidden');
  UITargets.Tray.classList.add('hidden');
}

UIManagementTools.showElement = (selector, focus=false) => {
  let e = document.querySelector(selector)
  e.classList.remove('hidden');
  if (focus) e.focus();
}

UIManagementTools.hideElement = selector => {
  document.querySelector(selector).classList.add('hidden');
}

UIManagementTools.openTray = () => {
  UITargets.ResultsContainer.classList.remove('hidden');
  UITargets.SearchSubmitContainer.classList.remove('hidden');
  UITargets.SearchResultsTarget.blur();
  UITargets.DeleteButton.disabled = true;
  UITargets.Tray.classList.remove('hidden');
}

UIManagementTools.submitSearch = () => document.getElementById('main-submit').click();

/**
 * 
 * @param {*} instruction the message to popup
 * @param {*} style the style of message. Either 'warn', 'success', 'hint' or empty string.
 * @param {*} duration 
 */
UIManagementTools.toast = (instruction, style = '', duration = -1) => {
  if (style !== '') {
    UITargets.ToastContainer.classList.remove(...['warn', 'success', 'hint']);
    UITargets.ToastContainer.classList.add(style);
  }

  UITargets.InstructionBox.textContent = instruction;
}

UIManagementTools.refreshBindCounter = (bind) => {
  let binds = ConfigState.getBind(bind);

  if (binds) {
    const bindCount = Object.keys(binds).length-1;
    const selector = `.key[data-bindcode="${bind}"]`;
    const keyElement = document.querySelector(selector);

    // It is possible that the keybinds rely on characters we do not check for yet.
    if (keyElement) {
      if (bindCount > 0) {
        keyElement.setAttribute('data-bindcount', bindCount);
      } else {
        keyElement.removeAttribute('data-bindcount');
      }
    } else {
      console.warn(`We don't currently support viewing binds to "${bind}". UI update coming soon!`);
    }
  }
}

UIManagementTools.showPopup = ({stubborn}) => {
  UITargets.Popup.classList.remove('hidden');

  if (stubborn) {
    UITargets.ContentBlocker.classList.remove('hidden');
  }
}

UIManagementTools.hidePopup = () => {
  UITargets.Popup.classList.add('hidden');
  UITargets.ContentBlocker.classList.add('hidden');
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
  let resultsContainer = UITargets.SearchResultsTarget;
  resultsContainer.innerHTML = '';

  for (var i = 0; i < results.length; i++) {
    let result = results[i];
    const option = document.createElement('option');
    option.value = result;
    option.name = result;
    option.innerHTML = result;

    effect(results[i], option);
    //if (BoundCommandSet.size > 0 && BoundCommandSet.has(results[i])) option.classList.add('bound');
    resultsContainer.appendChild(option);
  }

  let pageSize = results.length < 10 ? results.length : 10;
  resultsContainer.setAttribute('size', pageSize);
}

UIManagementTools.refreshPanel = content => {
  UITargets.ConfigPanel.textContent = content;
}

module.exports = UIManagementTools;
