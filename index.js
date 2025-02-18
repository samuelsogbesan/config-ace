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
const Toast = require('./components/Toast');

document.body.onload = event => {
  // Generate keyboard
  Keyboard(layouts.QWERTY, document.getElementById('keyboard'));

  // Listen for key inputs
  /*
  document.body.addEventListener('keydown', ({code}) => {
    if (!document.getElementById('popup').classList.contains('hidden')) return;

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
  */

  const resultsContainer = document.getElementById('search-results');
  resultsContainer.addEventListener('click', event => {
    UIManagementTools.showElement('#search-form-value-container', true);
    UIManagementTools.showElement('#search-form-bindtype-container');
    
    // Lil bit hackky since it uses the CSS to correlate state.
    let isBoundOption = event.target.classList.contains("bound");
    if (isBoundOption) {
      let binds = ConfigState.getBind(QueryState.getState());
      document.getElementById('search-results-submit-delete').disabled = false;
      let commandValue = binds[event.target.value];
      UIManagementTools.updateCommandValueInputPrompt(commandValue.trim());
    } else if (document.getElementById('search-results-submit-delete').disabled === false) {
      document.getElementById('search-results-submit-delete').disabled = true;
      UIManagementTools.updateCommandValueInputPrompt('');
    }

    if (!QueryState.getState()) {
      UIManagementTools.toast(`Don't forget to select a key to bind to. Use the onscreen keyboard to select one.`, 'hint');
    } else if (isBoundOption) {
      UIManagementTools.toast(`You can update your bind with a new value, or you can go ahead and delete it.`, 'hint');
    } else {
      UIManagementTools.toast(`Choose a value for the command, otherwise go ahead and click create!`, 'hint');
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
    let bindType = formData.get('bindtype');

    let submitter = event.submitter;

    if (!bindCode) {
      let delimiter = (value === '' ? '' : ': ');
      UIManagementTools.toast(`You must select a key to bind '${command}${delimiter}${value}' to.`, 'warn');
    }
    else if (bindCode !== "unbindable") {
      switch(submitter.getAttribute('name')) {
        case 'delete':
          ConfigState.removeBind(bindCode, command);
          UIManagementTools.toast(`${command} Has been unbound from ${bindCode}`, 'warn', 3000);
          break;
        case 'create':
          ConfigState.addBind(bindCode, {command: command, value: value});
          ConfigState.setBindType(bindCode, bindType);
          UIManagementTools.toast(`${command} Has been bound to ${bindCode}`, 'success', 3000);
          break;
        default:
          throw new Error('Unknown Submitter');
      }

      UIManagementTools.refreshBindCounter(bindCode);
      UIManagementTools.refreshPanel(ConfigState.export().join('\n'));
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
      if (BoundCommandSet.has(result)) {
        element.classList.add('bound');

        element.draggable = true;

        element.addEventListener('dragstart', event => {
          event.dataTransfer.setData("text/plain", element.name);
        });

        element.addEventListener('dragover', event => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        });
    
        element.addEventListener('drop', event => {
          event.preventDefault();
          // TODO: Swap
        });
      }
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
    if (event.relatedTarget === null) {
      UIManagementTools.closeTray();
      UIManagementTools.toast('Select a key to bind a command to by using the on-screen keyboard.', 'hint');
    }
  });

  document.getElementById('help-form').addEventListener('submit', event => {
    event.preventDefault();
    UIManagementTools.showPopup({stubborn: true});
  });

  document.getElementById('popup-closer').addEventListener('submit', event => {
    event.preventDefault();
    UIManagementTools.hidePopup();
  });

  document.getElementById('popup-closer-2').addEventListener('submit', event => {
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

      UIManagementTools.refreshPanel(ConfigState.export().join('\n'));
      UIManagementTools.toast('Your Config File was Loaded Successfully.', 'success');
    }
  }

  let fileForm = document.getElementById('file-form');
  let fileUpload = document.getElementById('file-upload');

  document.getElementById('default-file-form').addEventListener('submit', e => {
    e.preventDefault();

    if (confirm("Are you sure you'd like to reset to CSGOs default bindings? Your binds will be lost!")) {
      ConfigState.loadStateDangerously(defaultBindings);
      Object.keys(defaultBindings).forEach(bindCode => UIManagementTools.refreshBindCounter(bindCode));
      UIManagementTools.refreshPanel(ConfigState.export().join('\n'));
      UIManagementTools.toast('Loaded the default CSGO Config Bindings!', 'success');
    }
  });

  fileUpload.addEventListener('change', (e)=> {
    document.getElementById('file-form-submit').click();
  });

  fileForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    fileLoadHandler(event);
    return false;
  });

  document.getElementById('bindtoggle-option').addEventListener('input', event => {
    UIManagementTools.showElement('#bindtoggle-warning');
    document.querySelectorAll('.bound').forEach((element, idx) => { if (idx > 0) element.classList.add('but-ignored'); });
  });

  document.getElementById('bind-option').addEventListener('input', event => {
    UIManagementTools.hideElement('#bindtoggle-warning');
    document.querySelectorAll('.bound').forEach((element, idx) => { if (idx > 0) element.classList.remove('but-ignored'); });
  });

  // Sets up a trigger for when the toast is updated.
  Toast(document.getElementById('instruction-box'));

  QueryState.setQuery(null);

  UIManagementTools.refreshPanel(ConfigState.export().join('\n'));

  UIManagementTools.showPopup({stubborn: true});

  document.getElementById('slide-menu-button').addEventListener('', () => {
    // slide out the slide menu
  });
};
