// Global variables
let tabs = [];
let groups = [];
let page = window.location.pathname.split("/").pop();

// Runs when popup.html is opened so it doesn't interfere with options.html
if (page == "popup.html") {
  start();
}

async function start() {
  // Loads values from storage and assigns it to the dropdown menus
  chrome.storage.sync.get(["groupOption", "sortOption"], (data) => {
    document.getElementById("groupSelect").value = data.groupOption;
    document.getElementById("sortSelect").value = data.sortOption;
  });

  // Saves current values of dropdown menus to storage when changed
  document.body.addEventListener("change", function () {
    chrome.storage.sync.set({
      groupOption: document.getElementById("groupSelect").value,
      sortOption: document.getElementById("sortSelect").value,
    });
  });

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

  // Sorts groups-array in alphabetical order
  // (for some reason it doesn't query groups from left to right like it does with tabs, seems to be bit random tbh)
  groups.sort(function (a, b) {
    return a.title.localeCompare(b.title);
  });

  tabList();

  document.getElementById("urlCopy").onclick = function () {
    urlCopy();
  };

  document.getElementById("selectAll").onclick = function () {
    selectAll();
  };

  // Calls function when button is pressed
  document.getElementById("btnGroup").onclick = function () {
    // Prevents selection to go back to default value
    event.preventDefault();

    // Checks the selected value of dropdown menu
    if (document.getElementById("groupSelect").value == "addGroup") {
      addGroup();
    } else if (document.getElementById("groupSelect").value == "existingGroup") {
      existingGroup();
    } else if (document.getElementById("groupSelect").value == "removeFromGroup") {
      removeFromGroup();
    } else if (document.getElementById("groupSelect").value == "ungroup") {
      ungroup();
    } else if (document.getElementById("groupSelect").value == "closeGroup") {
      closeGroup();
    } else if (document.getElementById("groupSelect").value == "addWindow") {
      addWindow();
    }

    // Reloads script in order to show updated tabs in tabDiv
    location.reload();
  };

  document.getElementById("btnSort").onclick = function () {
    event.preventDefault();

    if (document.getElementById("sortSelect").value == "titleSort") {
      titleSort();
    } else if (document.getElementById("sortSelect").value == "urlSort") {
      urlSort();
    }

    location.reload();
  };
}

// Displays titles of open tabs with checkboxes in a list
async function tabList() {
  // Separates titles into a different array
  titles = [];
  for (let i = 0; i < tabs.length; i++) {
    titles.push(tabs[i].title);
  }

  let height = 0;

  // Creates checkboxes for each tab
  for (let i = 0; i < titles.length; i++) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let newLabel = document.createElement("label");

    checkbox.value = titles[i];
    checkbox.id = titles[i];

    // Makes it so titles can be max 30 chars
    let labelText;
    if (titles[i].length <= 30) {
      labelText = document.createTextNode(checkbox.id);
    } else {
      let shortTitle = titles[i].slice(0, 30);
      labelText = document.createTextNode(shortTitle);
    }

    newLabel.htmlFor = checkbox.id;
    newLabel.appendChild(labelText);
    let br = document.createElement("br");

    let container = document.getElementById("tabDiv");
    container.appendChild(checkbox);
    container.appendChild(newLabel);
    container.appendChild(br);

    // Increases height of tabDiv for each tab
    if (height < 160) {
      height += 20;
    }
  }

  // Increases height of tabDiv depending on the amount of open tabs
  let strTabDiv = height + "px";
  let tabDiv = document.getElementById("tabDiv");
  tabDiv.style.height = strTabDiv;

  // Increases height of body depending on the amount of open tabs
  document.body.style.height = height + 285 + "px";
}

// Selects all checkboxes
// If all checkboxes are selected then unselect all checkboxes
function selectAll() {
  let i = 0;

  [].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (cb) {
    if (cb.checked == true) {
      i++;
    }
  });

  if (i != tabs.length) {
    [].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (cb) {
      cb.checked = true;
    });
  } else {
    [].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (cb) {
      cb.checked = false;
    });
  }
}

// Copies urls of checked tabs to clipboard in form of a list
function urlCopy() {
  let urls = cbCheckedUrl();

  let str = "";
  for (let i = 0; i < urls.length; i++) {
    str += urls[i] + "\n";
  }

  copyToClipboard(str);
}

// Copies string to clipboard
function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// Checks which checkboxes are checked and returns the corresponding tabIds
function cbChecked() {
  let i = 0;
  let checkedTabIds = [];

  [].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (cb) {
    if (cb.checked) {
      checkedTabIds.push(tabs[i].id);
    }
    i++;
  });

  return checkedTabIds;
}

// Checks which checkboxes are checked and returns the corresponding tabUrls
function cbCheckedUrl() {
  let i = 0;
  let checkedTabUrls = [];

  [].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (cb) {
    if (cb.checked) {
      checkedTabUrls.push(tabs[i].url);
    }
    i++;
  });

  return checkedTabUrls;
}

// Returns string from name input field
function title() {
  return document.getElementById("inputName").value;
}

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

async function addGroup() {
  // Creates new group with selected tabs
  let newGroupId = await chrome.tabs.group({ tabIds: cbChecked()[0] });
  for (let i = 1; i < cbChecked().length; i++) {
    chrome.tabs.group({ groupId: newGroupId, tabIds: cbChecked()[i] });
  }

  // Checks which radio button is selected and assigns the corresponding color
  let selectedColor;
  [].forEach.call(document.querySelectorAll('input[type="radio"]'), function (rb) {
    if (rb.checked) {
      selectedColor = rb.value;
    }
  });

  // Updates the group with selected title and color
  chrome.tabGroups.update(newGroupId, { title: title(), color: selectedColor });
}

// Adds selected tabs to existing group
async function existingGroup() {
  let group = await chrome.tabGroups.query({ title: title() });

  for (let i = 0; i < cbChecked().length; i++) {
    chrome.tabs.group({ groupId: group[0].id, tabIds: cbChecked()[i] });
  }
}

// Removes selected tabs from a group
function removeFromGroup() {
  for (let i = 0; i < cbChecked().length; i++) {
    chrome.tabs.ungroup(cbChecked()[i]);
  }
}

// Checks if the tabs groupIds match the given group id and ungroups them accordingly
async function ungroup() {
  tabs = await chrome.tabs.query({ currentWindow: true });
  let group = await chrome.tabGroups.query({ title: title() });

  for (let i = 0; i < group.length; i++) {
    for (let j = 0; j < tabs.length; j++) {
      if (tabs[j].groupId == group[i].id) {
        chrome.tabs.ungroup(tabs[j].id);
      }
    }
  }
}

// Checks if the tabs groupIds match the given group id and closes them accordingly
async function closeGroup() {
  tabs = await chrome.tabs.query({ currentWindow: true });
  let group = await chrome.tabGroups.query({ title: title() });

  for (let i = 0; i < group.length; i++) {
    for (let j = 0; j < tabs.length; j++) {
      if (tabs[j].groupId == group[i].id) {
        chrome.tabs.remove(tabs[j].id);
      }
    }
  }
}

// Adds selected tabs to new window (Googles API:s doesn't have an option to rename windows)
function addWindow() {
  for (let i = 0; i < cbChecked().length; i++) {
    chrome.windows.create({ tabId: cbChecked()[i] });
  }
}

async function titleSort() {
  tabs = await chrome.tabs.query({ currentWindow: true });

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
      // Moves groups to the left most positions
      let moveIndex = 0;
      for (let i = 0; i < groups.length; i++) {
        chrome.tabGroups.move(groups[i].id, { index: moveIndex });
        moveIndex += tabsInGroups()[i];
      }

      // Separates titles of ungrouped tabs into an array
      let titles = [];
      let tabsLength = tabs.length - moveIndex;
      for (let i = 0; i < tabsLength; i++) {
        titles.push(tabs[i + moveIndex].title);
      }

      // Sorts the array alphabetically
      titles.sort((a, b) => a.localeCompare(b));
      console.log(titles);

      // Checks if the titles match and rearranges the tabs accordingly
      for (let i = 0; i < titles.length; i++) {
        for (let j = 0; j < titles.length; j++) {
          if (tabs[i + moveIndex].title == titles[j]) {
            chrome.tabs.move(tabs[i + moveIndex].id, { index: j + moveIndex });
          }
        }
      }
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
