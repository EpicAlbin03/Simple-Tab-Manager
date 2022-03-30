// Global variables
let elAutoSort = document.getElementById("autoSort");
let elAutoSortSec = document.getElementById("autoSortSec");
let elAutoSortMin = document.getElementById("autoSortMin");
let elAutoSortHours = document.getElementById("autoSortHours");
let elPreserveGroupOrder = document.getElementById("preserveGroupOrder");
var timerRef;

// Loads values from storage and assigns it to settings
chrome.storage.sync.get(["autoSort", "autoSortSec", "autoSortMin", "autoSortHours", "preserveGroupOrder"], (data) => {
  elAutoSort.checked = data.autoSort;
  elAutoSortSec.value = data.autoSortSec;
  elAutoSortMin.value = data.autoSortMin;
  elAutoSortHours.value = data.autoSortHours;
  elPreserveGroupOrder.checked = data.preserveGroupOrder;

  toggleInputTime();
  callSW();
});

// Enables save-button when any setting is changed
document.body.addEventListener("change", function () {
  if (elAutoSort.checked) {
    if (elAutoSortSec.value > 0 || elAutoSortMin.value > 0 || elAutoSortHours.value > 0) {
      document.getElementById("save").disabled = false;
    } else document.getElementById("save").disabled = true;
  } else document.getElementById("save").disabled = false;
});

// Save-button onclick
document.getElementById("save").onclick = function () {
  // Saves current values of settings to storage
  chrome.storage.sync.set({
    autoSort: elAutoSort.checked,
    autoSortSec: elAutoSortSec.value,
    autoSortMin: elAutoSortMin.value,
    autoSortHours: elAutoSortHours.value,
    preserveGroupOrder: elPreserveGroupOrder.checked,
  });

  // Disables save-button
  document.getElementById("save").disabled = true;

  callSW();
};

document.getElementById("autoSort").onclick = function () {
  toggleInputTime();
};

// Enables / disables inputTime wether or not the autoSort-checkbox is checked
function toggleInputTime() {
  if (elAutoSort.checked) {
    elAutoSortSec.disabled = false;
    elAutoSortMin.disabled = false;
    elAutoSortHours.disabled = false;
  } else {
    elAutoSortSec.disabled = true;
    elAutoSortMin.disabled = true;
    elAutoSortHours.disabled = true;
  }
}

// Calls the service worker
function callSW() {
  if (navigator.serviceWorker && elAutoSort.checked) {
    navigator.serviceWorker.register("./background.js");
    
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage("autoSort");
    });
  }
}
