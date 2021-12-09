// Gets the current manifest version and assigns it as text to elements with the id "version"
document.addEventListener("DOMContentLoaded", function () {
  let version = "v" + chrome.runtime.getManifest().version;
  document.getElementById("version").innerHTML = version;
});
