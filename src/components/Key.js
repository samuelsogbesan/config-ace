const keyNames = require("../utils/keyNames");

/**
 * Generates a key element.
 * @param {*} keyString the key to be displayed on the key.
 */
const Key = (bindCode) => {
  const key = document.createElement('button');
  key.type = 'submit';

  const keyName = keyNames[bindCode];
  if (/!.+/.test(bindCode)) {
    key.innerHTML = bindCode.slice(1);
    key.value = bindCode;
    key.setAttribute('data-bindcode', 'unbindable');
  } else {
    const bindCodes = bindCode.split(/~/);
    key.innerHTML = keyName;
    key.value = bindCode;
    key.setAttribute('data-bindcode', bindCodes[0]);
    if (bindCodes[1]) {
      key.setAttribute('data-bindcode2', bindCodes[1]);
    }
  }

  key.classList.add('key');

  return key;
}

module.exports = Key;
