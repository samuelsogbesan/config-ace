/**
 * Hooks toast animations to a specific HTMLElement.
 * @param trigger a HTMLElement that will be updated.
 */
const Toast = (trigger) => {
  // Options for the observer (which mutations to observe)
  const config = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: false
  };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && mutation.addedNodes.item(0).data !== mutation.removedNodes.item(0).data) {
        let toast = document.getElementById('toast');
        toast.classList.add('hidden');
        setTimeout(() => toast.classList.remove('hidden'), 300);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(trigger, config);
}

module.exports = Toast;
