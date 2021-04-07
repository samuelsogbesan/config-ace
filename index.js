const Keyboard = require('./components/Keyboard.js');
const keyToBind = require('./utils/keyToBind.js');
const layouts = require('./constants/LAYOUTS.js');
const search = require('./utils/command-search');
const QueryState = require('./state/query');
const ConfigState = require('./state/config.js');
const UIManagementTools = require('./state/ui.js');
const { getKey } = require('./utils/getKey.js');
const { save } = require('./utils/save.js');

document.body.onload = event => {
  // Generate keyboard
  Keyboard(layouts.QWERTY, document.getElementById('keyboard'));

  // Listen for key inputs
  document.body.addEventListener('keydown', ({code}) => {
    let focusedElement = document.activeElement;
    if (focusedElement.id !== 'command-value-input') {
      let bindCode;
      try {
        bindCode = keyToBind(code);
        const keyElement = getKey(bindCode);
        keyElement.click();
      } catch (err) {
        throw err;
      }
    }
  });

  const resultsContainer = document.getElementById('search-results');
  resultsContainer.addEventListener('click', event => {
    document.getElementById('command-value-input').classList.remove('hidden');
    document.getElementById('command-value-input').focus();
  });

  // When A User Submits a Binding.
  const resultsForm = document.getElementById('search-form');
  resultsForm.addEventListener('submit', event => {
    event.preventDefault();
    const bindCode = QueryState.getState();
    let formData = new FormData(event.target);
    let command = formData.get('result');
    let value = formData.get('value');

    if (!bindCode) {
      UIManagementTools.warnToast(`You must select a key to bind '${command}: ${value}' to.`);
    }
    else if (bindCode !== "unbindable") {
      ConfigState.addBind(bindCode, {command: command, value: value});
      UIManagementTools.refreshBindCounter(bindCode);
      UIManagementTools.flashToast(`${command} Has been bound to ${bindCode}`);
      UIManagementTools.closeTray();
    }
  });

  /**
   * Event Handler for Search Activity.
   * @param {*} event 
   * @returns 
   */
  const searchHandle = (event) => {
    const query = new FormData(resultsForm).get('search');
    const results = search(query);

    const q = QueryState.getState();

    // The idea is to track what commands have already been bound, so that we can highlight these binds in the menu later.
    let BoundCommandSet = new Set();

    let binds = ConfigState.getBind(q);
    if (binds) {
      results.sort((a, b) => {
        let aBindExists = binds.some(value => value.command === a)//.some(key => binds[key].command === a);
        let bBindExists = binds.some(value => value.command === b);
        
        if (aBindExists) BoundCommandSet.add(a);
        if (bBindExists) BoundCommandSet.add(b);

        if (aBindExists && bBindExists) return a.localeCompare(b);
        else if (aBindExists) return -1;
        else if (bBindExists) return 1;
        else return 0;
       });
    }

    UIManagementTools.refreshSearchResults(results, (result, element) => {
      if (BoundCommandSet.has(result)) element.classList.add('bound');
    });

    if (results.length === 0) {
      UIManagementTools.closeTray();
    } else {
      UIManagementTools.openTray();
    }

    return false;
  }

  const searchInput = document.getElementById('main-search');
  const valueInput = document.getElementById('command-value-input');
  searchInput.addEventListener('input', searchHandle);
  searchInput.addEventListener('focusin', searchHandle);
  searchInput.addEventListener('focusout', event => {
    if (event.explicitOriginalTarget === body) {
      UIManagementTools.closeTray();
    }

    UIManagementTools.hintToast(`Hit any key on your keyboard!`);
  });

  resultsForm.addEventListener('focusout', event => {
    /*
    if (event.explicitOriginalTarget === body) {
      UIManagementTools.closeTray();
    }*/

    UIManagementTools.hintToast(`Hit any key on your keyboard!`);
  });

  document.getElementById('footer-save-submit').addEventListener('submit', event => {
    event.preventDefault();
    save();
  });

  QueryState.setQuery(null);
};
