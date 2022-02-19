/*
 * bg.js -- a ManifestV3 service_worker that installs a context menu
 *          plus minimal framework for messaging between here and
 *          a content script.
 */
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'findWordFrequencyChromExtension',
    title: 'Find Word Frequency',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info,tabs) => {
  chrome.tabs.sendMessage(tabs.id, 'request-object', (rsp)=> {});
});