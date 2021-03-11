const QueryState = require('../state/query');
const Key = require('./Key');
const fs = require('fs');
const ConfigState = require('../state/config');
const UIManagementTools = require('../state/ui');

/**
 * Creates a DOMElement that represents a keyboard.
 * @param {*} layout QWERTY
 */
const Keyboard = (layout, element = document.createElement('form')) => {
  element.classList.add('keyboard');

  for (var i = 0; i < layout.length; i++) {
    const key = Key(layout[i]);
    element.appendChild(key);
  }

  element.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const keyElement = event.submitter;

    if (keyElement.value === '!💾') {
      const blobParts = ConfigState.export();
      blobParts.unshift('// Config Courtesy of "Easy Config", a CSGO Config Generator by @sam.sog 🥳\n');
      const file = new Blob(blobParts, {endings: 'native'});
      const a = document.createElement('a');
      a.download='config.cfg'
      a.href = URL.createObjectURL(file);
      a.click();
      return;
    } else if (keyElement.value === '!❌') {
      UIManagementTools.clearBindCounters();
      UIManagementTools.closeTray();
      ConfigState.clear();
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
      } else {
        currentKeyDisplay.classList.add('hidden');
      }
    }

    UIManagementTools.hintToast('Select a command from the drop down menu.');

    /**
     * Perform click animation.
     */
    keyElement.classList.add('clicked');
    setTimeout(() => keyElement.classList.remove('clicked'), 300);
  });

  return element;
}

module.exports = Keyboard;
