console.log("Content script loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "polling") {
    // Step 1: Check if the div already exists
    const existingDiv = document.getElementById("liveCricketDataUpdate");

    if (!existingDiv) {
      // Step 2: Create the new element if it doesn't exist
      const newElement = document.createElement("div");
      newElement.id = "liveCricketDataUpdate";
      newElement.style.position = "absolute";
      newElement.style.top = "6px";
      newElement.style.right = "6px";
      newElement.style.background = "#fff";
      newElement.style.zIndex = "9999";
      newElement.style.padding = "8px";
      newElement.style.width = "300px";
      newElement.style.fontSize = "14px";
      newElement.style.fontFamily = "sans-serif";
      newElement.style.color = "#000";
      newElement.style.lineHeight = "20px";
      newElement.style.boxShadow = "0px 3px 8px rgba(0, 0, 0, 0.24)";
      newElement.style.borderRadius = "2px";
      newElement.style.letterSpacing = "0.5px";

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
      message.data.forEach(function (match, index) {
        const isLastMatch = index === message.data.length - 1;
        const borderStyle = isLastMatch
          ? ""
          : "border-bottom: 1px solid #eeeeee;";
        htmlBlocks +=
          '<div id="ipl-match" style="padding: 4px; ' + borderStyle + '">';
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
      existingDiv.innerHTML = htmlBlocks;
    }
  } else if(message.action === "stopDisplayScore") {
    const existingDiv = document.getElementById("liveCricketDataUpdate");
    if (existingDiv) {
        existingDiv.parentNode.removeChild(existingDiv);
    }
  }
});
