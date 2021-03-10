const ConfigState = require('./config');

/**
 * Basic UI Manager
 */
const UITargets = {
  Tray: document.getElementById('search-results-form'),
  InstructionBox: document.getElementById('instruction-box'),
  Keyboard: document.getElementById('keyboard')
}

const UIManagementTools = {}

UIManagementTools.closeTray = () => UITargets.Tray.classList.add('hidden');

UIManagementTools.openTray = () => UITargets.Tray.classList.remove('hidden');

UIManagementTools.submitSearch = () => document.getElementById('main-submit').click();

UIManagementTools.warnToast = (instruction) => {
  UITargets.InstructionBox.classList.remove('hint');
  UITargets.InstructionBox.classList.add('warm');
  UITargets.InstructionBox.innerHTML = instruction;
}

UIManagementTools.hintToast = (instruction) => {
  UITargets.InstructionBox.classList.remove('warn');
  UITargets.InstructionBox.classList.add('hint');
  UITargets.InstructionBox.innerHTML = instruction;
}

UIManagementTools.flashToast = (message, oldMessage = UITargets.InstructionBox.innerHTML) => {
  UITargets.InstructionBox.textContent = message;
  setTimeout(() => {
    UITargets.InstructionBox.textContent = oldMessage;
  }, 600);
}

UIManagementTools.refreshBindCounter = (bind) => {
  const bindCount = ConfigState.getBind(bind).length;
  const selector = `.key[data-bindcode="${bind}"]`;
  const keyElement = document.querySelector(selector);
  keyElement.setAttribute('data-bindcount', bindCount);
}

UIManagementTools.clearBindCounters = () => {
  let keys = UITargets.Keyboard.children;

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    key.removeAttribute('data-bindcount');
  }
}

module.exports = UIManagementTools;
