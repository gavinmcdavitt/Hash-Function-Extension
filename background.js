browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
      url: "hashbox.html"
    });
  });