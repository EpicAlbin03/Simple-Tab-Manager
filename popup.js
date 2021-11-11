// Loads value from storage and assigns it to the dropdown menus
chrome.storage.local.get(["selectedGroupOption", "selectedSortOption"], (data) => {
  document.getElementById("groupSelect").value = data.selectedGroupOption;
  document.getElementById("sortSelect").value = data.selectedSortOption;
});

// Saves current value of dropdown menus to storage when changed
document.getElementById("groupSelect").addEventListener("change", function () {
  chrome.storage.local.set({
    selectedGroupOption: this.value,
  });
});

document.getElementById("sortSelect").addEventListener("change", function () {
  chrome.storage.local.set({
    selectedSortOption: this.value,
  });
});

start();

async function start() {
  // Puts tabinfo into an array
  let tabs = await chrome.tabs.query({ currentWindow: true });

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
      existingGroup(tabs);
    } else if (document.getElementById("groupSelect").value == "removeFromGroup") {
      removeFromGroup(tabs);
    } else if (document.getElementById("groupSelect").value == "ungroup") {
      ungroup();
    } else if (document.getElementById("groupSelect").value == "closeGroup") {
      closeGroup();
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

// Copy tab urls to clipboard in a list
function urlCopy(tabs) {
  let urls = cbCheckedUrl(tabs);

  let str = "";
  for (let i = 0; i < urls.length; i++) {
    str += urls[i] + "\n";
  }

  copyToClipboard(str);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
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
}

async function existingGroup(tabs) {
  // Puts the groups with the given title into an array
  let group = await chrome.tabGroups.query({ title: title() });

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

async function ungroup() {
  // Puts the groups with the given title into an array
  let group = await chrome.tabGroups.query({ title: title() });

  // Puts tabinfo into an array (when passing "tabs" to "ungroup()", the tabs groupId didn't update correctly when put into a new group)
  let tabs = await chrome.tabs.query({ currentWindow: true });

  // Checks if the tabs groupIds match the given group id and ungroups them accordingly
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].groupId == group[0].id) {
      chrome.tabs.ungroup(tabs[i].id);
    }
  }
}

async function closeGroup() {
  // Puts the groups with the given title into an array
  let group = await chrome.tabGroups.query({ title: title() });

  // Puts tabinfo into an array (when passing "tabs" to "ungroup()", the tabs groupId didn't update correctly when put into a new group)
  let tabs = await chrome.tabs.query({ currentWindow: true });

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

function titleSort(tabs) {
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
}

function urlSort(tabs) {
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
}
