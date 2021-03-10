/**
 * Returns the DOMElement representing this bind code.
 */
const getKey = (bindCode) => {
  const selector = `.key[data-bindcode="${bindCode}"]`;
  return document.querySelector(selector);
}

module.exports = { getKey }
