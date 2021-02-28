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

    const keyElement = event.submitter;
  
    /**
     * Perform click animation.
     */
    keyElement.classList.add('clicked');
    setTimeout(() => keyElement.classList.remove('clicked'), 300);
  });

  return element;
}

module.exports = Keyboard;
