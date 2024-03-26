let isEnabled = window.localStorage.getItem('livecricket') || false;

document.addEventListener('DOMContentLoaded', function() {
  const toggleLoggingButton = document.getElementById('btnGetData')
  
  toggleLoggingButton.addEventListener('click', function() {
    isEnabled = !isEnabled;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.runtime.sendMessage({ action: "toggleLogging", isEnabled: isEnabled });
    });

    if (isEnabled) {
      toggleLoggingButton.textContent = 'Stop Logging';
    } else {
      toggleLoggingButton.textContent = 'Start Logging';
    }
  });
});