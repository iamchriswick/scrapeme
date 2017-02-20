import 'chromereload/devonly';

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {

    console.log('This is the first install!');

  } else if (details.reason === 'update') {

    var thisVersion = chrome.runtime.getManifest().version;

    if (details.previousVersion !== thisVersion) {

      console.log('Updated from v' + details.previousVersion + ' to v' + thisVersion + '!');

      notifyMe(thisVersion);

    } else {

      console.log('Running v' + thisVersion + '!');

    }

  }
});

chrome.extension.onMessage.addListener(function(message, sender) {

  if (message === 'showPageActionIn') {

    console.log(message);
    var tab = sender.tab;
    chrome.pageAction.show(tab.id);
    chrome.pageAction.setIcon({
      tabId: tab.id,
      path: 'images/icon-in-32.png'
    });

    chrome.pageAction.show(sender.tab.id);

    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      id: 'change-language',
      title: 'Change Language',
      contexts: ['page_action']
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      console.log("Item " + info.menuItemId + " clicked " +
        "in tab " + tab.id);

      chrome.tabs.sendMessage(
        tab.id, {
          action: 'change_language'
        }
      );
    });

  } else if (message === 'showPageAction') {

    console.log(message);
    var tab = sender.tab;
    chrome.pageAction.show(tab.id);
    chrome.pageAction.setIcon({
      tabId: tab.id,
      path: 'images/icon-nav-32.png'
    });

    chrome.pageAction.show(sender.tab.id);

  }

});
