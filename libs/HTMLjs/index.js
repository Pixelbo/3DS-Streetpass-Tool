//This is a "clean" js file without node that serves for changing aspect of the page when buttons are pressed
var iframe, btn_about, btn_list;


window.addEventListener('DOMContentLoaded', () => { //Define vars
  iframe = document.getElementById("main");
  btn_about = document.getElementById("about");
  btn_list = document.getElementById("list");
});

function clear_active() { //Clear colors on the game selector
  var nodes = document.getElementById('titleSelector').childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeName.toLowerCase() == 'a') {
      nodes[i].classList.remove("active_btn");
    }
  }
}

function load_common(title_id) { //Load the page that is common for every game
  iframe.src = "./titles/common.html";

  btn_list.classList.remove("active_btn");
  btn_about.classList.remove("active_btn");
  document.getElementById(title_id).classList.add("active_btn");

  window.titleID = title_id; //Global var for the title ID

}

function load_list() { //Seperate function cause of the active color
  iframe.src = "./list.html";
  btn_list.classList.add("active_btn");
  btn_about.classList.remove("active_btn");

  clear_active();
}

function load_about() { //Seperate function cause of the active color
  iframe.src = "./about.html";
  btn_list.classList.remove("active_btn");
  btn_about.classList.add("active_btn");

  clear_active();
}

document.getElementById("CEC_folder").addEventListener("change", function(event) { //When CEC folder is changed
  let files = event.target.files;
  var folderpath = files[0]["path"].split("\\").slice(0,-1).join("\\");

  window.CECPATH = folderpath;

  load_common(window.titleID)
}, false);



function iframe_reload_event() {
  const reloadIframeEvent = new CustomEvent("reloadIframeEvent", {
    detail: window.titleID
  }); //New page means reaload common infos
  window.dispatchEvent(reloadIframeEvent);
}

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}