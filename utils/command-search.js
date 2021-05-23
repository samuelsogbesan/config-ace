const COVARS = require('../constants/commands');
//const Trie = require('./Trie');

const commands = COVARS;

//let commandTrie = new Trie();
//commands.forEach(command => commandTrie.add(command, command));

/**
 * Search convars
 * @param {*} term 
 */
const search = (term) => {
  const regex = new RegExp(term);
  return commands.filter(command => regex.test(command));
}

module.exports = search;
