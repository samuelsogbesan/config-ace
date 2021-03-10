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
    UIManagementTools.flashToast(`${'A'} Has been bound to ${'B'}`);
    UIManagementTools.closeTray();
  });

  // When People Click a Search Result
  const resultsForm = document.getElementById('search-results-form');
  resultsForm.addEventListener('submit', event => {
    event.preventDefault();
    const bindCode = QueryState.getState();
    const command = new FormData(event.target);

    if (bindCode !== "unbindable") {
      ConfigState.addBind(bindCode, {command: command.get('result'), value: 'placeholder'});
      UIManagementTools.refreshBindCounter(bindCode);
    }
  });

  // Hook Search
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    resultsContainer.innerHTML = '';

    const formData = new FormData(event.target);
    const query = formData.get('search');
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

    for (var i = 0; i < results.length; i++) {
      const option = document.createElement('option');
      option.value = results[i];
      option.name = results[i];

      if (BoundCommandSet.size > 0 && BoundCommandSet.has(results[i])) option.classList.add('bound');

      option.innerHTML = results[i];

      const pageSize = results.length < 10 ? results.length : 10;
      resultsContainer.setAttribute('size', pageSize);
      resultsContainer.appendChild(option);
    }

    if (results.length === 0) {
      UIManagementTools.closeTray();
    } else {
      UIManagementTools.openTray();
    }

    return false;
  });

  const searchInput = document.getElementById('main-search');
  searchInput.addEventListener('input', (event) => {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('main-submit').click();
    return false;
  });

  searchInput.addEventListener('focusin', () => {
    document.getElementById('main-submit').click();
  });
};
