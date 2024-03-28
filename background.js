// background.js

let loggingIntervalId = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "toggleLogging") {
    const { isEnabled } = message;
    if (isEnabled) {
      startCricket();
    } else {
      stopCricket();
    }
  }
});

function startCricket() {
  stopCricket();

  loggingIntervalId = setInterval(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        // Assuming you want to send the message to the active tab
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(
          tabId,
          { action: "polling" },
          function (response) {
            // Handle the response if needed
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
