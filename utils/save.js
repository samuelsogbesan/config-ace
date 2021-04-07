const ConfigState = require("../state/config");

export const save = () => {
  const blobParts = ConfigState.export();
  blobParts.unshift('// Config Courtesy of "Easy Config", a CSGO Config Generator by @sam.sog 🥳\n');
  const file = new Blob(blobParts, {endings: 'native'});
  const a = document.createElement('a');
  a.download='config.cfg'
  a.href = URL.createObjectURL(file);
  a.click();
}
