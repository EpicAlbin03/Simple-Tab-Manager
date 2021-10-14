document.getElementById("btnSort").onclick = function () {
  // Prevents selection to go back to default value
  event.preventDefault();
  // Dropdown menu
  var tabSelect = document.getElementById("tabSelect");

  // Checks the selected value of dropdown menu
  if (tabSelect.value == "Alphabetical") {
    sortAlphabetical();
  } else {
    alert("Placeholder");
  }
};

// Sorts tabs in alphabetical order
async function sortAlphabetical() {
  // Puts tabinfo into an array
  var tabs = await chrome.tabs.query({ currentWindow: true });

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
