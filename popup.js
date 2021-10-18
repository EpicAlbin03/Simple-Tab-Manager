start();

async function start() {
  // Puts tabinfo into an array
  let tabs = await chrome.tabs.query({ currentWindow: true });

  tabList(tabs);

  // Calls function when button is pressed
  document.getElementById("btnGroup").onclick = function () {
    // Prevents selection to go back to default value
    event.preventDefault();

    // Checks the selected value of dropdown menu
    if (document.getElementById("groupSelect").value == "addGroup") {
      addGroup();
    } else if (
      document.getElementById("groupSelect").value == "existingGroup"
    ) {
      existingGroup();
    } else if (document.getElementById("groupSelect").value == "removeGroup") {
      removeGroup();
    }
  };

  document.getElementById("btnWindow").onclick = function () {
    event.preventDefault();

    if (document.getElementById("windowSelect").value == "addWindow") {
      addWindow();
    } else if (
      document.getElementById("windowSelect").value == "existingWindow"
    ) {
      existingWindow();
    } else if (
      document.getElementById("windowSelect").value == "removeWindow"
    ) {
      removeWindow();
    }
  };

  document.getElementById("btnSort").onclick = function () {
    event.preventDefault();

    if (document.getElementById("sortSelect").value == "titleSort") {
      titleSort(tabs);
    } else if (document.getElementById("sortSelect").value == "urlSort") {
      urlSort();
    }
  };
}

function tabList(tabs) {
  // Seperates titles into a different array
  titles = [];
  for (let i = 0; i < tabs.length; i++) {
    titles.push(tabs[i].title);
  }

  // Creates checkboxes for each tab
  for (let i = 0; i < titles.length; i++) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let newLabel = document.createElement("label");

    // Makes it so titles can be max 30 chars
    if (titles[i].length <= 30) {
      checkbox.id = titles[i];
      checkbox.value = titles[i];
    } else {
      let str = titles[i].slice(0, 30);
      checkbox.id = str;
      checkbox.value = str;
    }

    newLabel.htmlFor = checkbox.id;
    let labelText = document.createTextNode(checkbox.id);
    newLabel.appendChild(labelText);
    let br = document.createElement("br");

    let container = document.getElementById("tabDiv");
    container.appendChild(checkbox);
    container.appendChild(newLabel);
    container.appendChild(br);
  }
}

function addGroup() {
  /*let tabId = tabs[0].id;
  let groupId = await chrome.tabs.group({ tabIds: tabId });
  chrome.tabGroups.update(groupId, { collapsed: false, title: "test", color: "blue" });*/
}

function existingGroup() {}

function removeGroup() {}

function addWindow() {}

function existingWindow() {}

function removeWindow() {}

function titleSort(tabs) {
  // Seperates titles into a different array
  var titles = [];
  for (let i = 0; i < tabs.length; i++) {
    titles.push(tabs[i].title);
  }
  // Sorts the array alphabetical
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

function urlSort() {}
