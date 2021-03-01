const QueryState = require('../state/query');
const Key = require('./Key');

/**
 * Creates a DOMElement that represents a keyboard.
 * @param {*} layout QWERTY
 */
const Keyboard = (layout) => {
  const element = document.createElement('form');
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
    const searchInput = document.getElementById('main-search');

    if (document.activeElement !== searchInput) {
      searchInput.focus();
      setTimeout(() => searchInput.value = '', 1);
      
      const bindCode = keyElement.getAttribute('data-bindcode');

      const currentKeyDisplay = document.getElementById('current-key');
      QueryState.setQuery(bindCode);

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
