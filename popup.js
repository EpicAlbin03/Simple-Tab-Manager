// Sorts tabs in alphabetical order
document.getElementById("btnSortAlph").onclick = async function () {
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
};
