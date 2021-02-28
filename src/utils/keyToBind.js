const keyNames = require("./keyNames");

/**
 * 
 * @param {*} code event.code
 */
const keyToBind = (code) => {
  const normalisedCode = code.toLowerCase();

  // code represents event.code. these binds have to be converted before they can be used.
  if (/^altleft$/.test(normalisedCode)) return 'alt';
  if (/^altright$/.test(normalisedCode)) return 'ralt';
  if (/^bracketleft$/.test(normalisedCode)) return '[';
  if (/^bracketright$/.test(normalisedCode)) return ']';
  if (/^comma$/.test(normalisedCode)) return ',';
  if (/^controlleft$/.test(normalisedCode)) return 'ctrl';
  if (/^controlright$/.test(normalisedCode)) return 'rctrl';
  if (/^digit[0-9]{1}$/.test(normalisedCode)) return normalisedCode.substring(5);
  if (/^equal$/.test(normalisedCode)) return 'kp_plus';
  if (/^intlbackslash$/.test(normalisedCode)) return '\\\\';
  if (/^key[A-Za-z]{1}$/.test(normalisedCode)) return normalisedCode.substring(3);
  if (/^minus$/.test(normalisedCode)) return 'kp_minus';
  if (/^period$/.test(normalisedCode)) return '.';
  if (/^quote$/.test(normalisedCode)) return '\'';
  if (/^semicolon$/.test(normalisedCode)) return ';';
  if (/^shiftleft$/.test(normalisedCode)) return 'shift';
  if (/^shiftright$/.test(normalisedCode)) return 'rshift';
  if (/^slash$/.test(normalisedCode)) return '/';

  // now we catch all the cases that don't need explicit conversion
  if (keyNames[normalisedCode]) return normalisedCode;
  else {
    throw new Error(`${code} is not a bindable key`);
  }
}

module.exports = keyToBind;
