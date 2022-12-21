// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/**
 * @param {number} timeout
 * @param {(event: Event) => void} callback
 * @return {(event: Event) => void}
 */
function debounce(timeout, callback) {
  let timeoutID = 0;
  return (event) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(event), timeout);
  };
}

document.onmouseup = highlightHandler;

function highlightHandler(e) {
  var selectionText = "";
  if (document.getSelection) {
    selectionText = document.getSelection();
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }
  // check if anything is actually highlighted
  if(selectionText !== '') {
      // we've got a highlight, now do your stuff here
      sendText(selectionText);
  }
}

function sendText(text) {
  // do something cool
  console.log(text);
}


document.getElementById('popup-options').addEventListener('change', async (event) => {
  let popup = event.target.value;
  await chrome.action.setPopup({ popup });

  // Show the updated popup path
  await getCurrentPopup();
});

async function getCurrentPopup() {
  let popup = await chrome.action.getPopup({});
  document.getElementById('current-popup-value').value = popup;
  return popup;
};

async function showCurrentPage() {
  let popup = await getCurrentPopup();
  let pathname = '';
  if (popup) {
    pathname = new URL(popup).pathname;
  }

  let options = document.getElementById('popup-options');
  let option = options.querySelector(`option[value="${pathname}"]`);
  option.selected = true;
}

// Populate popup inputs on on page load
showCurrentPage();

// ----------
// .onClicked
// ----------

// If a popup is specified, our on click handler won't be called. We declare it here rather than in
// the `onclicked-button` handler to prevent the user from accidentally registering multiple
// onClicked listeners.
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'https://html5zombo.com/' });
});

document.getElementById('onclicked-button').addEventListener('click', async () => {
  // Our listener will only receive the action's click event after clear out the popup URL
  await chrome.action.setPopup({ popup: '' });
  await showCurrentPage();
});

document.getElementById('onclicked-reset-button').addEventListener('click', async () => {
  await chrome.action.setPopup({ popup: 'popups/popup.html' });
  await showCurrentPage();
});

