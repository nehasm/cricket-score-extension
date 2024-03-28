console.log("Content script loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "polling") {
    console.log("polling");
    // Step 1: Create the new element
    var newElement = document.createElement("div");

    // Step 2: Get a reference to the <body> element
    var bodyElement = document.body;

    // Step 3: Get the current timestamp
    var currentTimeStamp = new Date().toLocaleString(); // Get the current time in string format

    // Step 4: Add text content with the current timestamp to the new <div> element
    newElement.textContent = "Current timestamp: " + currentTimeStamp;

    // Step 5: Append the new element as the first child of the <body> element
    if (bodyElement.firstChild) {
      // If <body> already has child elements, insert before the first child
      bodyElement.insertBefore(newElement, bodyElement.firstChild);
    } else {
      // If <body> has no child elements, append as the first child
      bodyElement.appendChild(newElement);
    }
  }
});
