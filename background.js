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
    // Your API fetch logic
    fetch(
      "https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en&latest=true"
    )
      .then((response) => response.json())
      .then((data) => {
        const iplMatches = data.matches.filter(
          (match) => match.series.slug === "indian-premier-league-2024"
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
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
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
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
      });
  }, 5000);
}

function stopCricket() {
  if (loggingIntervalId) {
    clearInterval(loggingIntervalId);
    loggingIntervalId = null;

    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "stopDisplayScore" },
          function(response) {
            // Handle the response from the content script if needed
          }
        );
      });
    });
  }
}

