console.log("Content script loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "polling") {
    // Step 1: Check if the div already exists
    var existingDiv = document.getElementById("liveCricketDataUpdate");

    if (!existingDiv) {
      // Step 2: Create the new element if it doesn't exist
      var newElement = document.createElement("div");
      newElement.id = "liveCricketDataUpdate";
      newElement.style.position = "absolute";
      newElement.style.top = "0";
      newElement.style.right = "0";
      newElement.style.background = "#fff";
      newElement.style.zIndex = "9999";
      newElement.style.padding = "8px";

      // Step 3: Get a reference to the <body> element
      var bodyElement = document.body;

      // Step 4: Get the current timestamp
      var currentTimeStamp = new Date().toLocaleString(); // Get the current time in string format

      // Step 5: Add text content with the current timestamp to the new <div> element
      newElement.textContent = "Current timestamp: " + currentTimeStamp;

      // Step 6: Append the new element as the first child of the <body> element
      if (bodyElement.firstChild) {
        // If <body> already has child elements, insert before the first child
        bodyElement.insertBefore(newElement, bodyElement.firstChild);
      } else {
        // If <body> has no child elements, append as the first child
        bodyElement.appendChild(newElement);
      }
    } else {
      // Step 7: If the div already exists, update its content with the new timestamp
      existingDiv.textContent =
        "Current timestamp: " + new Date().toLocaleString();
    }
  }
});
