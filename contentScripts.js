console.log("Content script loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received message from popup.js:", message);
});
