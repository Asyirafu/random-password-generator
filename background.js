browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "generate-password",
    title: "Generate Random Password",
    contexts: ["editable"]
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate-password") {
    browser.tabs.sendMessage(tab.id, {
      action: "generatePassword",
      context: "contextmenu"
    });
  }
});