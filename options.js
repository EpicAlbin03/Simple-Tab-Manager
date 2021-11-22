// Loads values from storage and assigns it to settings
chrome.storage.sync.get(["autoSort", "autoSortSec", "autoSortMin", "autoSortHours", "selectGrouping", "preserveGroupOrder"], (data) => {
  document.getElementById("autoSort").checked = data.autoSort;
  document.getElementById("autoSortSec").value = data.autoSortSec;
  document.getElementById("autoSortMin").value = data.autoSortMin;
  document.getElementById("autoSortHours").value = data.autoSortHours;
  document.getElementById("selectGrouping").value = data.selectGrouping;
  document.getElementById("preserveGroupOrder").checked = data.preserveGroupOrder;

  toggleInputTime();
});

// Saves current values of settings to storage when changed
document.body.addEventListener("change", function () {
  chrome.storage.sync.set({
    autoSort: document.getElementById("autoSort").checked,
    autoSortSec: document.getElementById("autoSortSec").value,
    autoSortMin: document.getElementById("autoSortMin").value,
    autoSortHours: document.getElementById("autoSortHours").value,
    selectGrouping: document.getElementById("selectGrouping").value,
    preserveGroupOrder: document.getElementById("preserveGroupOrder").checked,
  });
});

document.getElementById("autoSort").onclick = function () {
  toggleInputTime();
};

// Enables / disables inputTime wether or not the autoSort-checkbox is checked
function toggleInputTime() {
  if (document.getElementById("autoSort").checked) {
    document.getElementById("autoSortSec").disabled = false;
    document.getElementById("autoSortMin").disabled = false;
    document.getElementById("autoSortHours").disabled = false;
  } else {
    document.getElementById("autoSortSec").disabled = true;
    document.getElementById("autoSortMin").disabled = true;
    document.getElementById("autoSortHours").disabled = true;
  }
}

function autoSort() {}

function selectGrouping() {}

function preserveGroupOrder() {}
