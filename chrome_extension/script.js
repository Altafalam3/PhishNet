

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    document.getElementById("currUrl").innerHTML = currentUrl;
    console.log(currentUrl);
  });