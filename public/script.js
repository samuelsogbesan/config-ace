/**
 * Generates a key element.
 * @param {*} keyString the key to be displayed on the key.
 */
const generateKey = (keyString) => {
  const key = document.createElement('input');
  key.type = 'submit';
  key.value = keyString;
  key.classList.add('key');
  return key;
}

/**
 * Generates a keyboard with standard UK-QWERTY layout.
 * @param {*} event the onload event.
 */
const generateKeyboard = (event) => {
  const keys = [];
  const keyboard = document.getElementById('keyboard');
  keys.forEach(key => keyboard.appendChild(generateKey(key)));
}

window.onload = generateKeyboard;
