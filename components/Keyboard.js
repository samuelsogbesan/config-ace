const QueryState = require('../state/query');
const Key = require('./Key');
const fs = require('fs');
const ConfigState = require('../state/config');
const UIManagementTools = require('../state/ui');
const { save } = require('../utils/save');

/**
 * Creates a DOMElement that represents a keyboard.
 * @param {*} layout QWERTY
 */
const Keyboard = (layout, element = document.createElement('form')) => {
  element.classList.add('keyboard');

  for (var i = 0; i < layout.length; i++) {
    Key(layout[i], element);
  }

  element.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const keyElement = event.submitter;

    const currentKeyDisplay = document.getElementById('current-key');

    if (keyElement.value === '!💾') {
      save();
      UIManagementTools.toast(`We've generated your config file, check your downloads folder!`, 'success');
      return;
    } else if (keyElement.value === '!❌') {
      if(confirm("Are you sure you want to clear all your binds? Your changes will be lost!")) {
        UIManagementTools.clearBindCounters();
        UIManagementTools.toast(`Config Cleared!`, 'warn');
        UIManagementTools.closeTray();
        ConfigState.clear();
        UIManagementTools.refreshPanel('');
        currentKeyDisplay.innerHTML = '&ltkey&gt';
      }
    }

    const searchInput = document.getElementById('main-search');

    if (document.activeElement !== searchInput) {
      const bindCode = keyElement.getAttribute('data-bindcode');
      QueryState.setQuery(bindCode);

      if (bindCode !== 'unbindable') {
        searchInput.focus();
        currentKeyDisplay.innerHTML = bindCode;
        currentKeyDisplay.classList.remove('hidden');
        UIManagementTools.toast(`Select a command from the drop down menu.`, 'hint');

        let binds = ConfigState.getBind(QueryState.getState());
        if (binds && binds._meta.bindType === 'BindToggle') {
          document.getElementById('bindtoggle-option').click();
        }
      }
    }

    /**
     * Perform click animation.
     */
    keyElement.classList.add('clicked');
    setTimeout(() => keyElement.classList.remove('clicked'), 300);
  });

  return element;
}

module.exports = Keyboard;
