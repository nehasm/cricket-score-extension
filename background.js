// background.js
function findSmallestUtcTime(utcTimes) {
  // Convert the array of UTC times from strings to Date objects
  const utcDateObjects = utcTimes.map(time => new Date(time));

  // Find the minimum time using Math.min with getTime method
  const minTime = new Date(Math.min(...utcDateObjects.map(date => date.getTime())));

  // Convert the minimum time back to UTC format string
  const minTimeUtcString = minTime.toISOString();

  return minTimeUtcString;
}
function getLatestScoresAndRender() {
  // Your API fetch logic
  fetch(
    "https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en&latest=true"
  )
    .then((response) => response.json())
    .then((data) => {
      const iplMatches = data.matches.filter(
        (match) => match.series.slug === "indian-premier-league-2024"
        && match.stage === "RUNNING"
      );
      if(iplMatches.length > 0) {
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
      } else {
        let nextIplMatches = data.matches.filter(
          (match) => match.series.slug === "indian-premier-league-2024" &&
                     match.stage === "SCHEDULED"
        ).map(match => match.startTime)
        if (nextIplMatches.length > 0) {
          nextMatchStartTime = findSmallestUtcTime(nextIplMatches);
          console.log(`Next match starts at: ${nextMatchStartTime}`);
          
          // Calculate the delay in milliseconds
          const currentTime = new Date();
          const matchStartTime = new Date(nextMatchStartTime);
          const delay = matchStartTime - currentTime;
          
          // Stop current polling if running
          stopCricket();
          
          // Schedule polling to start at the next match's start time
          if (delay > 0) {
            console.log(`Scheduling polling in ${delay} ms`);
            setTimeout(startCricket, delay);
          }
        }
      }

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
