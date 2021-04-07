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

    if (keyElement.value === '!💾') {
      save();
      return;
    } else if (keyElement.value === '!❌') {
      if(confirm("Are you sure you want to clear all your binds? Your changes will be lost!")) {
        UIManagementTools.clearBindCounters();
        UIManagementTools.warnToast('Config Cleared!');
        UIManagementTools.closeTray();
        ConfigState.clear();
      }
    }

    const searchInput = document.getElementById('main-search');

    if (document.activeElement !== searchInput) {
      const bindCode = keyElement.getAttribute('data-bindcode');

      const currentKeyDisplay = document.getElementById('current-key');
      QueryState.setQuery(bindCode);

      if (bindCode !== 'unbindable') {
        searchInput.focus();
        currentKeyDisplay.innerHTML = bindCode;
        currentKeyDisplay.classList.remove('hidden');
        UIManagementTools.hintToast('Select a command from the drop down menu.');
      } else {
        currentKeyDisplay.classList.add('hidden');
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
