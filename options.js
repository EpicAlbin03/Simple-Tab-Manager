// Loads value from storage and assigns it to the dropdown menus

chrome.storage.sync.get(["autoSort", "autoSortSec", "autoSortMin", "autoSortHours", "selectGrouping", "preserveGroupOrder"], (data) => {
  document.getElementById("autoSort").checked = data.autoSort;
  document.getElementById("autoSortSec").value = data.autoSortSec;
  document.getElementById("autoSortMin").value = data.autoSortMin;
  document.getElementById("autoSortHours").value = data.autoSortHours;
  document.getElementById("selectGrouping").value = data.selectGrouping;
  document.getElementById("preserveGroupOrder").checked = data.preserveGroupOrder;
});

document.getElementById("autoSort").addEventListener("change", function () {
  chrome.storage.sync.set({
    autoSort: this.value,
  });
});

/*
document.getElementById("autoSort").onclick = function () {
  let cb = document.getElementById("autoSort");

  if (cb.checked) {
    document.getElementById("autoSortSec").disabled = false;
    document.getElementById("autoSortMin").disabled = false;
    document.getElementById("autoSortHours").disabled = false;
  } else {
    document.getElementById("autoSortSec").disabled = true;
    document.getElementById("autoSortMin").disabled = true;
    document.getElementById("autoSortHours").disabled = true;
  }
};*/
