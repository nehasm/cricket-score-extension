// background.js

function getLatestScoresAndRender() {
  // Your API fetch logic
  fetch(
    "Add your API URL here"
  )
    .then((response) => response.json())
    .then((data) => {
      const iplMatches = data.matches.filter(
        (match) => match.series.slug === "indian-premier-league-2024"
        && match.stage === "RUNNING"
      );
      let allIplMatches = [];
      for (let match of iplMatches) {
        let currentTeamData = {
          teamData: [],
          statusText: match.statusText,
        };
        for (let team of match.teams) {
          currentTeamData.teamData.push({
            teamName: team.team.abbreviation,
            score: team.score,
            scoreInfo: team.scoreInfo,
          });
        }
        allIplMatches.push(currentTeamData);
      }

      // Send the fetched data to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;
          chrome.tabs.sendMessage(
            tabId,
            { action: "polling", data: allIplMatches }, // Include fetched data in the message
            function (response) {
              // Handle the response from the content script if needed
            }
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching API:", error);
    });
}

let loggingIntervalId = null;

function startCricket() {
  stopCricket();

  loggingIntervalId = setInterval(getLatestScoresAndRender, 5000);
}

function stopCricket() {
  if (loggingIntervalId) {
    clearInterval(loggingIntervalId);
    loggingIntervalId = null;

    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "stopDisplayScore" },
          function (response) {
            // Handle the response from the content script if needed
          }
        );
      });
    });
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { isEnabled } = message;
  if (message.action === "init" && isEnabled) {
    getLatestScoresAndRender();
  }
  if (message.action === "toggleLogging") {
    if (isEnabled) {
      startCricket();
    } else {
      stopCricket();
    }
  }
});
