const ConfigState = require('./config');
const QueryState = require('./query');

/**
 * Basic UI Manager
 */
const UITargets = {
  ResultsContainer: document.getElementById('search-form-results-container'),
  SearchResultsTarget: document.getElementById('search-results'),
  InstructionBox: document.getElementById('instruction-box'),
  Keyboard: document.getElementById('keyboard'),
  CommandValueInput: document.getElementById('search-form-value-container'),
  SearchSubmitContainer: document.getElementById('search-form-submit-container'),
  ContentBlocker: document.getElementById('content-blocker'),
  DeleteButton: document.getElementById('search-results-submit-delete'),
  Popup: document.getElementById('popup')
}

const UIManagementTools = {}

UIManagementTools.closeTray = () => {
  UITargets.ResultsContainer.classList.add('hidden');
  UITargets.CommandValueInput.classList.add('hidden');
  UITargets.ResultsContainer.blur();
  UITargets.CommandValueInput.blur();
  UITargets.SearchSubmitContainer.classList.add('hidden');
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
}

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
  let binds = ConfigState.getBind(bind);

  if (binds) {
    const bindCount = binds.length;
    const selector = `.key[data-bindcode="${bind}"]`;
    const keyElement = document.querySelector(selector);
    if (bindCount > 0) {
      keyElement.setAttribute('data-bindcount', bindCount);
    } else {
      keyElement.removeAttribute('data-bindcount');
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

module.exports = UIManagementTools;
