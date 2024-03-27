document.addEventListener("DOMContentLoaded", async function () {
  // Function to update button text based on isEnabled state
  function updateButtonText(isEnabled) {
    const toggleLoggingButton = document.getElementById("btnGetData");
    toggleLoggingButton.textContent = isEnabled
      ? "Stop Logging"
      : "Start Logging";
  }

  let { isEnabled } = await chrome.storage.sync.get("isEnabled");
  const toggleLoggingButton = document.getElementById("btnGetData");

  updateButtonText(isEnabled);

  toggleLoggingButton.addEventListener("click", function () {
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ isEnabled: isEnabled });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({
        action: "toggleLogging",
        isEnabled: isEnabled,
      });
    });

    updateButtonText(isEnabled);
  });
});
