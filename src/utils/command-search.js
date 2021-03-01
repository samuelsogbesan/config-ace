const rawCovars = require('../constants/commands');

const commands = JSON.parse(rawCovars);

/**
 * Search convars
 * @param {*} term 
 */
const search = (term) => {
  const regex = new RegExp(term);
  return commands.filter(command => regex.test(command));
}

module.exports = search;
