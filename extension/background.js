// Background script for Form Automation Assistant Extension

// Listen for messages from web app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTENSION_CHECK') {
    sendResponse({ installed: true });
    return true;
  }
  
  if (message.type === 'START_TYPING') {
    // Forward the message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TYPING_STATUS') {
    // Forward status updates back to web app if needed
    sendResponse({ received: true });
  }
});