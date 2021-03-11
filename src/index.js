const Keyboard = require('./components/Keyboard.js');
const keyToBind = require('./utils/keyToBind.js');
const layouts = require('./constants/LAYOUTS.js');
const search = require('./utils/command-search');
const QueryState = require('./state/query');
const ConfigState = require('./state/config.js');
const UIManagementTools = require('./state/ui.js');
const { getKey } = require('./utils/getKey.js');

document.body.onload = event => {
  // Generate keyboard
  Keyboard(layouts.QWERTY, document.getElementById('keyboard'));

  // Listen for key inputs
  document.body.addEventListener('keydown', ({code}) => {
    let bindCode;
    try {
      bindCode = keyToBind(code);
      const keyElement = getKey(bindCode);
      keyElement.click();
    } catch (err) {
      throw err;
    }
  });

  const resultsContainer = document.getElementById('search-results');
  resultsContainer.addEventListener('click', event => {
    document.getElementById('search-results-submit').click();
    UIManagementTools.closeTray();
  });

  // When People Click a Search Result
  const resultsForm = document.getElementById('search-form');
  resultsForm.addEventListener('submit', event => {
    event.preventDefault();
    const bindCode = QueryState.getState();
    const command = new FormData(event.target).get('result');

    if (bindCode !== "unbindable") {
      ConfigState.addBind(bindCode, {command: command, value: 'placeholder'});
      UIManagementTools.refreshBindCounter(bindCode);
      UIManagementTools.flashToast(`${command} Has been bound to ${bindCode}`);
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
  searchInput.addEventListener('input', searchHandle);
  searchInput.addEventListener('focusin', searchHandle);
  searchInput.addEventListener('focusout', event => {
    if (event.explicitOriginalTarget === body) {
      UIManagementTools.closeTray();
    }

    UIManagementTools.hintToast(`Hit any key on your keyboard!`);
  });
};
