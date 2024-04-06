import React, { useEffect, useState } from 'react';

const ExtensionController = () => {
  const [isEnableScore, setIsEnableScore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { isEnabled } = await chrome.storage.sync.get("isEnabled");
        setIsEnableScore(isEnabled);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const scoreToggleHandler = () => {
    setIsEnableScore(!isEnableScore)
    chrome.storage.sync.set({ isEnabled: !isEnableScore });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({
        action: "toggleLogging",
        isEnabled: !isEnableScore,
      });
    });
  };
  const buttonStyle = {
    padding: '8px',
    borderRadius: '4px',
    display: 'inline-block',
    cursor: 'pointer',
    background: isEnableScore ? 'linear-gradient(-180deg, #c7c7c7 0%, #868686 100%)' : 'linear-gradient(-180deg, #37AEE2 0%, #1E96C8 100%)',
    color: '#fff',
    cursor : 'pointer'
  };
  return (
    <div style={{width: '300px',fontFamily: 'Arial', fontSize : '14px',textAlign: 'center' }}>
      <div style={{padding: '12px'}}>IPL Live Score</div>
      <div>
        <div style={buttonStyle} onClick={scoreToggleHandler}>{isEnableScore ? 'Disable' : 'Enable'}</div>
        <div style={{fontSize : '12px', 'padding': '8px 8px',color: '#ababab'}}>Press the button to {isEnableScore ? 'Disable' : 'Enable'} live score</div>
      </div>
    </div>
  );
};

export default ExtensionController;
