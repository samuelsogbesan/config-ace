/**
 * Basic UI Manager
 */
const UITargets = {
  Tray: document.getElementById('search-results-form'),
  InstructionBox: document.getElementById('instruction-box')
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

module.exports = UIManagementTools;
