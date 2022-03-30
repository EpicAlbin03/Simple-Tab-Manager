// Runs when chrome extension is installed, updated or if chrome is updated
chrome.runtime.onInstalled.addListener((data) => {
  // Runs only when chrome extension is installed
  if (data.reason === "install") {
    // Opens website when extension is installed
    chrome.tabs.create({
      url: "https://epicalbin03.github.io/simpletabmanager/",
      active: true,
    });

    // Save variables in storage (default values)
    chrome.storage.sync.set({
      groupOption: "addGroup",
      sortOption: "titleSort",
      autoSort: false,
      autoSortSec: 0,
      autoSortMin: 0,
      autoSortHours: 0,
      preserveGroupOrder: true,
    });
  }
});

// Opens a google form when extension is uninstalled
chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/e/1FAIpQLSeWrvbjLACyM89LGy-7VOdm_pN-O8yIA9FSotfwSq24uzF6KQ/viewform?usp=pp_url&entry.1558238205=Not+using+it+anymore"
);

let groups = [];
let tabs = [];
var timerRef;

start();
async function start() {
  // Pushes tabs in current window into global array
  let tabsQuery = await chrome.tabs.query({ currentWindow: true });
  for (let i = 0; i < tabsQuery.length; i++) {
    tabs.push(tabsQuery[i]);
  }

  // Pushes groups in current window into global array
  let groupsQuery = await chrome.tabGroups.query({ windowId: -1 });
  for (let i = 0; i < groupsQuery.length; i++) {
    groups.push(groupsQuery[i]);
  }
}

addEventListener("message", (e) => {
  console.log(e.data);
  if (e.data == "autoSort") autoSort();
  else if (e.data == "titleSort") titleSort();
  else if (e.data == "urlSort") urlSort();
});

// Returns the number of tabs in each group
async function tabsInGroups() {
  tabs = await chrome.tabs.query({ currentWindow: true });

  // Resets values to 0
  let tabsInGroup = [];
  for (let i = 0; i < groups.length; i++) {
    tabsInGroup[i] = 0;
  }

  // Gets the amount of tabs in each group
  for (let i = 0; i < tabs.length; i++) {
    for (let j = 0; j < groups.length; j++) {
      if (tabs[i].groupId == groups[j].id) {
        tabsInGroup[j]++;
      }
    }
  }
  return tabsInGroup;
}

// Automatically sorts tabs by title or url after [x] amount of time (settings page needs to stay open)
function autoSort() {
  chrome.storage.sync.get(["autoSortSec", "autoSortMin", "autoSortHours"], (data) => {
    // Converts sec, min and hours to milliseconds and adds them together
    let sec = data.autoSortSec * 1000;
    let min = data.autoSortMin * 60 * 1000;
    let hours = data.autoSortHours * 60 * 60 * 1000;
    let time = sec + min + hours;

    // Resets timerRef
    clearInterval(timerRef);

    // Function that repeats itself after [x] amount of time
    timerRef = setInterval(function () {
      chrome.storage.sync.get(["autoSort", "sortOption"], (data) => {
        if (data.autoSort == true && (sec > 0 || min > 0 || hours > 0)) {
          // Checks if titleSort or urlSort is selected, then calls the function from popup.js
          if (data.sortOption == "titleSort") {
            titleSort();
          } else if (data.sortOption == "urlSort") {
            urlSort();
          }
        }
      });
    }, time);
  });
}

async function titleSort() {
  tabs = await chrome.tabs.query({ currentWindow: true });
  groups = await chrome.tabGroups.query({ windowId: -1 });

  chrome.storage.sync.get(["preserveGroupOrder"], (data) => {
    if (data.preserveGroupOrder == false) {
      // Separates titles into a different array
      let titles = [];
      for (let i = 0; i < tabs.length; i++) {
        titles.push(tabs[i].title);
      }

      // Sorts the array alphabetically
      titles.sort((a, b) => a.localeCompare(b));

      // Checks if the titles match and rearranges the tabs accordingly
      for (let i = 0; i < tabs.length; i++) {
        for (let j = 0; j < titles.length; j++) {
          if (tabs[i].title == titles[j]) {
            chrome.tabs.move(tabs[i].id, { index: j });
          }
        }
      }
    } else if (data.preserveGroupOrder == true) {
      tabsInGroups().then((p) => {
        // Moves groups to the left most positions
        let moveIndex = 0;
        for (let i = 0; i < groups.length; i++) {
          chrome.tabGroups.move(groups[i].id, { index: moveIndex });
          // moveIndex += tabsInGroups()[i];
          console.log(p);
          moveIndex += p[i];
          console.log("hej");
          console.log(moveIndex);
        }

        console.log("hej2");
        console.log(moveIndex);
        // Separates titles of ungrouped tabs into an array
        let titles = [];
        let tabsLength = tabs.length - moveIndex;
        for (let i = 0; i < tabsLength; i++) {
          titles.push(tabs[i + moveIndex].title);
        }
        console.log(titles);

        // Sorts the array alphabetically
        titles.sort((a, b) => a.localeCompare(b));
        console.log(titles);

        // Checks if the titles match and rearranges the tabs accordingly
        // for (let i = 0; i < titles.length; i++) {
        //   for (let j = 0; j < titles.length; j++) {
        //     if (tabs[i + moveIndex].title == titles[j]) {
        //       chrome.tabs.move(tabs[i + moveIndex].id, { index: j + moveIndex });
        //     }
        //   }
        // }
      });
    }
  });
}

async function urlSort() {
  tabs = await chrome.tabs.query({ currentWindow: true });

  chrome.storage.sync.get(["preserveGroupOrder"], (data) => {
    if (data.preserveGroupOrder == false) {
      // Separates urls into a different array & only keeps the hostname
      let urls = [];
      let tabHostnames = [];
      for (let i = 0; i < tabs.length; i++) {
        urls.push(tabs[i].url);
        urls[i] = urls[i].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
        tabHostnames[i] = tabs[i].url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
      }

      // Sorts the array alphabetically
      urls.sort((a, b) => a.localeCompare(b));

      // Checks if the urls match and rearranges the tabs accordingly
      for (let i = 0; i < tabs.length; i++) {
        for (let j = 0; j < urls.length; j++) {
          if (tabHostnames[i] == urls[j]) {
            chrome.tabs.move(tabs[i].id, { index: j });
          }
        }
      }
    } else if (data.preserveGroupOrder == true) {
      // Moves groups to the left most positions
      let moveIndex = 0;
      for (let i = 0; i < groups.length; i++) {
        chrome.tabGroups.move(groups[i].id, { index: moveIndex });
        moveIndex += tabsInGroups()[i];
      }

      // Separates urls into a different array & only keeps the hostname
      let urls = [];
      let tabHostnames = [];
      let tabsLength = tabs.length - moveIndex;
      for (let i = 0; i < tabsLength; i++) {
        urls.push(tabs[i + moveIndex].url);
        urls[i] = urls[i].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
        tabHostnames[i] = tabs[i + moveIndex].url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
      }

      // Sorts the array alphabetically
      urls.sort((a, b) => a.localeCompare(b));

      // Checks if the urls match and rearranges the tabs accordingly
      for (let i = 0; i < urls.length; i++) {
        for (let j = 0; j < urls.length; j++) {
          if (tabHostnames[i] == urls[j]) {
            chrome.tabs.move(tabs[i + moveIndex].id, { index: j + moveIndex });
          }
        }
      }
    }
  });
}
