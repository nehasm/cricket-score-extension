// background.js

let loggingIntervalId = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "toggleLogging") {
    const { isEnabled, tabId } = message;
    if (isEnabled) {
      startCricket(tabId);
    } else {
      stopCricket();
    }
  }
});

function startCricket() {
  stopCricket();

  loggingIntervalId = setInterval(function () {
    chrome.tabs.query({ active: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          new Date(),
          function (response) {
            // any callback from content script comes here
          }
        );
      }
    });
  }, 5000);
}

function stopCricket() {
  if (loggingIntervalId) {
    clearInterval(loggingIntervalId);
    loggingIntervalId = null;
  }
}
