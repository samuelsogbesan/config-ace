const Keyboard = require('./components/Keyboard.js');
const keyToBind = require('./utils/keyToBind.js');
const layouts = require('./constants/LAYOUTS.js');
const search = require('./utils/command-search');
const QueryState = require('./state/query');
const ConfigState = require('./state/config.js');
const UIManagementTools = require('./state/ui.js');
const { getKey } = require('./utils/getKey.js');
const { save } = require('./utils/save.js');
const { convert, parse } = require('./utils/parse.js');
const defaultBindings = require('./constants/defaultBindings.js');

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
    UIManagementTools.showElement('#search-form-value-container', true);
    UIManagementTools.showElement('#search-form-bindtype-container');
    
    // Lil bit hackky since it uses the CSS to correlate state.
    let isBoundOption = event.target.classList.contains("bound");
    if (isBoundOption) {
      document.getElementById('search-results-submit-delete').disabled = false;
      let commandValue = ConfigState.getBind(QueryState.getState())[event.target.value];
      UIManagementTools.updateCommandValueInputPrompt(commandValue.trim());
    } else if (document.getElementById('search-results-submit-delete').disabled === false) {
      document.getElementById('search-results-submit-delete').disabled = true;
      UIManagementTools.updateCommandValueInputPrompt('');
    }

    if (!QueryState.getState()) {
      UIManagementTools.hintToast(`Don't forget to select a key to bind to. Use your keyboard or the onscreen keyboard to select one.`);
    } else if (isBoundOption) {
      UIManagementTools.hintToast(`You can update your bind with a new value, or you can go ahead and delete it.`);
    } else {
      UIManagementTools.hintToast(`Choose a value for the command, otherwise go ahead and click create!`);
    }
  });

  // When A User Submits a Binding.
  const resultsForm = document.getElementById('search-form');
  resultsForm.addEventListener('submit', event => {
    event.preventDefault();
    const bindCode = QueryState.getState();
    let formData = new FormData(event.target);
    let command = formData.get('result');
    let value = formData.get('value');
    let bindtype = formData.get('bindtype');

    let submitter = event.submitter;

    if (!bindCode) {
      UIManagementTools.warnToast(`You must select a key to bind '${command}: ${value}' to.`);
    }
    else if (bindCode !== "unbindable") {
      switch(submitter.getAttribute('name')) {
        case 'delete':
          ConfigState.removeBind(bindCode, command);
          UIManagementTools.flashToast(`${command} Has been unbound from ${bindCode}`);
          break;
        case 'create':
          ConfigState.addBind(bindCode, {command: command, value: value});
          UIManagementTools.flashToast(`${command} Has been bound to ${bindCode}`);
          break;
        default:
          throw new Error('Unknown Submitter');
      }

      UIManagementTools.refreshBindCounter(bindCode);
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
      console.log(binds)
      console.log(binds["_autosave"]);
      results.sort((a, b) => {
        let aBindExists = binds[a] !== undefined ? true : false; //binds.some(value => value.command === a)//.some(key => binds[key].command === a);
        let bBindExists = binds[b] !== undefined ? true : false; //binds.some(value => value.command === b);
        
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

    UIManagementTools.openTray();

    if (results.length === 0) {
      UIManagementTools.hideElement('#search-form-value-container');
    }

    return false;
  }

  const searchInput = document.getElementById('main-search');
  searchInput.addEventListener('input', searchHandle);
  searchInput.addEventListener('focusin', searchHandle);

  let header = document.querySelector('.search-nav');
  header.addEventListener('focusout', event => {
    console.log(event.relatedTarget);
    if (event.relatedTarget === null) {
      UIManagementTools.closeTray();
    }

    UIManagementTools.hintToast(`Hit any key on your keyboard!`);
  });

  document.getElementById('footer-save-submit').addEventListener('submit', event => {
    event.preventDefault();
    save();
  });

  document.getElementById('help-form').addEventListener('submit', event => {
    event.preventDefault();
    UIManagementTools.showPopup({stubborn: true});
  });

  document.getElementById('popup-closer').addEventListener('submit', event => {
    event.preventDefault();
    UIManagementTools.hidePopup();
  });

  const fileLoadHandler = event => {
    let formdata = new FormData(event.target);
    let file = formdata.get("file");
    let filereader = new FileReader();
    filereader.readAsText(file);
    filereader.onloadend = () => {
      // read and process file
      let res = filereader.result;
      let rawBinds = parse(res);
      let binds = convert(rawBinds);

      // cache file parts.
      Object.keys(binds).forEach(bindCode => {
        binds[bindCode].forEach(bind => ConfigState.addBind(bindCode, bind));
        UIManagementTools.refreshBindCounter(bindCode);
      });
    }
  }

  let fileForm = document.getElementById('file-form');
  let fileUpload = document.getElementById('file-upload');

  document.getElementById('default-file-form').addEventListener('submit', e => {
    e.preventDefault();
    ConfigState.loadStateDangerously(defaultBindings);
    Object.keys(defaultBindings).forEach(bindCode => UIManagementTools.refreshBindCounter(bindCode));
    UIManagementTools.hintToast('Config File Loaded!');
  });

  fileUpload.addEventListener('change', (e)=> {
    document.getElementById('file-form-submit').click();
  });

  fileForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    fileLoadHandler(event);
    UIManagementTools.hintToast('Config File Loaded!');
    return false;
  });

  document.getElementById('bindtoggle-option').addEventListener('input', event => {
    UIManagementTools.showElement('#bindtoggle-warning');
  });

  document.getElementById('bind-option').addEventListener('input', event => {
    UIManagementTools.hideElement('#bindtoggle-warning');
  })

  QueryState.setQuery(null);

  UIManagementTools.showPopup({stubborn: true});
};
