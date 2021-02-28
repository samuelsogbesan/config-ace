const Keyboard = require('./components/Keyboard.js');
const keyToBind = require('./utils/keyToBind.js');
const layouts = require('./constants/LAYOUTS.js');

document.body.onload = event => {
  // Generate keyboard
  const keyboard = Keyboard(layouts.QWERTY);
  document.body.appendChild(keyboard);

  // Listen for key inputs
  document.body.addEventListener('keydown', ({code}) => {
    let bindCode;
    try {
      bindCode = keyToBind(code);
      const selector = `.key[data-bindcode="${bindCode}"]`;
      const keyElement = document.querySelector(selector);
      keyElement.click();
    } catch (err) {
      throw err;
    }
  });
};
