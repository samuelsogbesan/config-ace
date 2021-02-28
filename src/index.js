const Keyboard = require('./components/Keyboard.js');
const keyToBind = require('./utils/keyToBind.js');
const layouts = require('./constants/LAYOUTS.js');
const search = require('./utils/search');

document.body.onload = event => {
  // Generate keyboard
  const keyboard = Keyboard(layouts.QWERTY);
  document.body.appendChild(keyboard);

  // Listen for key inputs
  document.body.addEventListener('keydown', ({code}) => {
    let bindCode;
    try {
      bindCode = keyToBind(code);
      const selector = `.key[data-bindcode="${bindCode}"]`;
      const keyElement = document.querySelector(selector);
      keyElement.click();
    } catch (err) {
      throw err;
    }
  });

  // Hook Search
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', event => {
    console.log("here")
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const formData = new FormData(event.target);
    const query = formData.get('search');
    const results = search(query);

    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    for (var i = 0; i < results.length; i++) {
      const span = document.createElement('span');
      span.innerHTML = results[i];
      resultsContainer.appendChild(span);
    }

    return false;
  });

  const searchInput = document.getElementById('main-search');
  searchInput.addEventListener('input', (event) => {
    console.log("firign")
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('main-submit').click();
    return false;
  });
};
