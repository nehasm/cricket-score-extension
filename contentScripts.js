console.log("Content script loaded");

const head = document.head;
const styleTag = document.createElement("link");
styleTag.href = chrome.runtime.getURL("live-score.css");
styleTag.rel = "stylesheet";
styleTag.type = "text/css";

head.appendChild(styleTag);

const init = async () => {
  let { isEnabled } = await chrome.storage.sync.get("isEnabled");
  chrome.runtime.sendMessage({
    action: "init",
    isEnabled: isEnabled,
  });
};

init();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "polling") {
    // Step 1: Check if the div already exists
    const existingDiv = document.getElementById("liveCricketDataUpdate");

    if (!existingDiv) {
      // Step 2: Create the new element if it doesn't exist
      const newElement = document.createElement("div");
      newElement.id = "liveCricketDataUpdate";
      newElement.innerHTML = "Getting scores for you";

      // Step 3: Get a reference to the <body> element
      var bodyElement = document.body;
      if (bodyElement.firstChild) {
        bodyElement.insertBefore(newElement, bodyElement.firstChild);
      } else {
        bodyElement.appendChild(newElement);
      }
    } else {
      // Step 4: Add HTML blocks based on the array
      var htmlBlocks = "";
      const matches = message.data;

      if (matches.length === 0) {
        htmlBlocks = "No running matches";
      } else {
        matches.forEach(function (match, index) {
          htmlBlocks += '<div class="ipl-match">';
          htmlBlocks +=
            '<div style="display: flex; justify-content: space-between;">';
          match.teamData.forEach(function (teamInfo) {
            htmlBlocks += "<div>" + teamInfo.teamName;
            if (teamInfo.score) {
              htmlBlocks += " <span>(" + teamInfo.score + ")</span>";
            }
            htmlBlocks += "</div>";
          });
          htmlBlocks += "</div>";
          htmlBlocks +=
            '<div style="color: #989596; font-style: italic">' +
            match.statusText +
            "</div>";
          htmlBlocks += "</div>";
        });
      }
      existingDiv.innerHTML = htmlBlocks;
    }
  } else if (message.action === "stopDisplayScore") {
    const existingDiv = document.getElementById("liveCricketDataUpdate");
    if (existingDiv) {
      existingDiv.parentNode.removeChild(existingDiv);
    }
  }
});
