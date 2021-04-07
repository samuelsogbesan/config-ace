
/**
 * Parses a config file as a string and returns the tokens.
 */
const parse = (string) => {
  let regex = /^(unbindall|(bind|BindToggle) .+ .+)$/gm;
  let results = string.match(regex);
  return results;
}

/**
 * Cleanup strings.
 * @param {*} string 
 * @returns 
 */
const cleanse = (string) => {
  return string.toLowerCase().replace(/"/g, '').replace(/\\/g, '');
}

/**
 * Compile tokens into the classes.
 * @param {*} tokens 
 * @returns 
 */
const convert = (tokens) => {
  let unbindallRegex = /.*unbindall.*/;
  let bindableRegex = /(bind|bindToggle)\s(\S+)(?=\s)*(.*)/;

  let binds = {};
  tokens.forEach((token, idx) => {
    if (unbindallRegex.test(token)) {
      // for now we ignore cause we havent got a usecase for them. need to add an "bindless" section to binds. e.g. binds[bindless] = [...]
    }
    else if (bindableRegex.test(token)) {
      // gets us bind/bindall + key + commands
      let partialBind = bindableRegex.exec(token);
      let bindCode = cleanse(partialBind[2]);

      let rawCommands = partialBind[3].split(';');

      // basically truncate if we encountered the ';' at the end of the string. makes the next stage cleaner since we dont encounter empty string as rawCommand.
      if (rawCommands[rawCommands.length-1] === '') rawCommands.length = rawCommands.length-1;

      let commands = rawCommands.map(rawCommand => {
        let commandTokens = cleanse(rawCommand).match(/(\S+)(?=\s)*(.*)/);
        return ({
          command: commandTokens[1],
          // Will be undefined if no value exists, which is handled behaviour.
          value: commandTokens[2],
        });
      });

      if (!binds[bindCode]) binds[bindCode] = [];

      binds[bindCode] = binds[bindCode].concat(commands);
    } else {
      throw new Error(`Unknown line found at line ${idx}, line: ${token}`);
    }
  });

  return binds;
}

module.exports = { parse, cleanse, convert };
