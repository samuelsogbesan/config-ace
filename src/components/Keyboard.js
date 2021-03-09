const QueryState = require('../state/query');
const Key = require('./Key');
const fs = require('fs');
const ConfigState = require('../state/config');

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
      const file = new Blob(blobParts, {endings: 'native'});
      const a = document.createElement('a');
      a.download='config.cfg'
      a.href = URL.createObjectURL(file);
      a.click();
      return;
    } else if (keyElement.value === '!❌') {
      ConfigState.clear();
    }

    const searchInput = document.getElementById('main-search');

    if (document.activeElement !== searchInput) {
      const bindCode = keyElement.getAttribute('data-bindcode');

      const currentKeyDisplay = document.getElementById('current-key');
      QueryState.setQuery(bindCode);

      searchInput.focus();

      if (bindCode !== 'unbindable') {
        currentKeyDisplay.innerHTML = bindCode;
        currentKeyDisplay.classList.remove('hidden');
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
