/**
 * Basic UI Manager
 */
const UITargets = {
  Tray: document.getElementById('search-results-form')
}

const UIManagementTools = {}

UIManagementTools.closeTray = () => UITargets.Tray.classList.add('hidden');

UIManagementTools.openTray = () => UITargets.Tray.classList.remove('hidden');

UIManagementTools.submitSearch = () => document.getElementById('main-submit').click();

module.exports = UIManagementTools;
