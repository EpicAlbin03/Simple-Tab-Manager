let page = window.location.pathname.split("/").pop();

if (page == "popup.html") {
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

  start();
}

async function start() {
  // Puts tabinfo into an array
  let tabs = await chrome.tabs.query({ currentWindow: true });

  // Puts the groups with the given title into an array
  let group = await chrome.tabGroups.query({ title: title() });

  tabList(tabs);

  document.getElementById("urlCopy").onclick = function () {
    urlCopy(tabs);
  };

  // Calls function when button is pressed
  document.getElementById("btnGroup").onclick = function () {
    // Prevents selection to go back to default value
    event.preventDefault();

    // Checks the selected value of dropdown menu
    if (document.getElementById("groupSelect").value == "addGroup") {
      addGroup(tabs);
    } else if (document.getElementById("groupSelect").value == "existingGroup") {
      existingGroup(tabs, group);
    } else if (document.getElementById("groupSelect").value == "removeFromGroup") {
      removeFromGroup(tabs);
    } else if (document.getElementById("groupSelect").value == "ungroup") {
      ungroup(tabs, group);
    } else if (document.getElementById("groupSelect").value == "closeGroup") {
      closeGroup(tabs, group);
    } else if (document.getElementById("groupSelect").value == "addWindow") {
      addWindow(tabs);
    }
  };

  document.getElementById("btnSort").onclick = function () {
    event.preventDefault();

    if (document.getElementById("sortSelect").value == "titleSort") {
      titleSort(tabs);
    } else if (document.getElementById("sortSelect").value == "urlSort") {
      urlSort(tabs);
    }
  };
}

// Displays titles of open tabs with checkboxes in a list
function tabList(tabs) {
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

    // Makes it so titles can be max 35 chars
    let labelText;
    if (titles[i].length <= 35) {
      labelText = document.createTextNode(checkbox.id);
    } else {
      let shortTitle = titles[i].slice(0, 35);
      labelText = document.createTextNode(shortTitle);
    }

    newLabel.htmlFor = checkbox.id;
    newLabel.appendChild(labelText);
    let br = document.createElement("br");

    let container = document.getElementById("tabDiv");
    container.appendChild(checkbox);
    container.appendChild(newLabel);
    container.appendChild(br);

    if (height < 160) {
      height += 20;
    }
  }

  // Increases height of tabDiv depending on the amount of open tabs
  let strTabDiv = height + "px";
  let tabDiv = document.getElementById("tabDiv");
  tabDiv.style.height = strTabDiv;

  // Increases height of body depending on the amount of open tabs
  document.body.style.height = height + 260 + "px";
}

// Copies urls of checked tabs to clipboard in form of a list
function urlCopy(tabs) {
  let urls = cbCheckedUrl(tabs);

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
function cbChecked(tabs) {
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
function cbCheckedUrl(tabs) {
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

// Return string from name input field
function title() {
  return document.getElementById("inputName").value;
}

async function addGroup(tabs) {
  // Creates new group with selected tabs
  let newGroupId = await chrome.tabs.group({ tabIds: cbChecked(tabs)[0] });
  for (let i = 1; i < cbChecked(tabs).length; i++) {
    chrome.tabs.group({ groupId: newGroupId, tabIds: cbChecked(tabs)[i] });
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

  // Checks if settings are set to rightToLeft and rearranges tabs accordingly
  chrome.storage.sync.get(["selectGrouping"], (data) => {
    if (data.selectGrouping == "rightToLeft") {
      // Gets the last position in the tabGroup
      let lastPos;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].id == cbChecked(tabs)[cbChecked(tabs).length - 1]) {
          lastPos = i;
        }
      }

      // Rearranges tabs from right to left
      for (let i = cbChecked(tabs).length; i > 0; i--) {
        chrome.tabs.move(cbChecked(tabs)[i - 1], { index: lastPos });
      }
    }
  });
}

function existingGroup(tabs, group) {
  // Adds selected tabs to group
  for (let i = 0; i < cbChecked(tabs).length; i++) {
    chrome.tabs.group({ groupId: group[0].id, tabIds: cbChecked(tabs)[i] });
  }
}

function removeFromGroup(tabs) {
  // Removes selected tabs from group
  for (let i = 0; i < cbChecked(tabs).length; i++) {
    chrome.tabs.ungroup(cbChecked(tabs)[i]);
  }
}

function ungroup(tabs, group) {
  // Checks if the tabs groupIds match the given group id and ungroups them accordingly
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].groupId == group[0].id) {
      chrome.tabs.ungroup(tabs[i].id);
    }
  }
}

function closeGroup(tabs, group) {
  // Checks if the tabs groupIds match the given group id and closes them accordingly
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].groupId == group[0].id) {
      chrome.tabs.remove(tabs[i].id);
    }
  }
}

function addWindow(tabs) {
  // Adds selected tabs to new window (Googles API:s doesn't have an option to rename windows)
  for (let i = 0; i < cbChecked(tabs).length; i++) {
    chrome.windows.create({ tabId: cbChecked(tabs)[i] });
  }
}

async function titleSort(tabs) {
  // Puts groups in current window into an array
  let groups = await chrome.tabGroups.query({ windowId: -1 });
  console.log(groups);

  // Separates titles into a different array
  let groupTitles = [];
  for (let i = 0; i < groups.length; i++) {
    groupTitles.push(groups[i].title);
  }
  // Sorts the array alphabetically
  groupTitles.sort((a, b) => a.localeCompare(b));
  console.log(groupTitles);

  // Put groups into an array in alphabetical order
  let groupsAlph = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groupTitles.length; j++) {
      if (groupTitles[i] == groups[j].title) {
        groupsAlph.push(groups[j]);
      }
    }
  }
  console.log(groupsAlph);

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
      let tabsInGroup = [];
      // Resets values to 0 in tabsInGroup
      for (let i = 0; i < groups.length; i++) {
        tabsInGroup[i] = 0;
      }

      // Gets the amount of tabs in each group
      for (let i = 0; i < tabs.length; i++) {
        for (let j = 0; j < groups.length; j++) {
          if (tabs[i].groupId == groupsAlph[j].id) {
            tabsInGroup[j]++;
          }
        }
      }
      console.log(tabsInGroup);
      
      // Moves groups to the left most positions
      let moveIndex = 0;
      for (let i = 0; i < groupsAlph.length; i++) {
        chrome.tabGroups.move(groupsAlph[i].id, { index: moveIndex });
        moveIndex += tabsInGroup[i];
      }
      console.log(moveIndex);

      // Separates titles into a different array
      let titles = [];
      let tabsLength = tabs.length - moveIndex;
      for (let i = 0; i < tabsLength; i++) {
        titles.push(tabs[i + moveIndex].title);
      }

      // Sorts the array alphabetically
      titles.sort((a, b) => a.localeCompare(b));
      console.log(titles);
      
      // TODO: Sort the rest of the tabs (works separately)
      // Checks if the titles match and rearranges the tabs accordingly
      for (let i = 0; i < titles.length; i++) {
        for (let j = 0; j < titles.length; j++) {
          if (tabs[i + moveIndex].title == titles[j]) {
            chrome.tabs.move(tabs[i + moveIndex].id, { index: (j + moveIndex) });
          }
        }
      }
    }
  });
}

function urlSort(tabs) {
  chrome.storage.sync.get(["preserveGroupOrder"], (data) => {
    if (data.preserveGroupOrder == false) {
      // Separates urls into a different array & only keep the hostname
      let urls = [];
      let tabHostnames = [];
      for (let i = 0; i < tabs.length; i++) {
        urls.push(tabs[i].url);
        urls[i] = new URL(urls[i]).hostname;
        tabHostnames[i] = new URL(tabs[i].url).hostname;
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
    }
  });
}
