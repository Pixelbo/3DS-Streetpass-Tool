//This is a "clean" js file without node that serves for changing aspect of the page when buttons are pressed

var iframe, btn_about, btn_list, title_navbar;


window.addEventListener('DOMContentLoaded', () => { //Define vars
    iframe = document.getElementById("main");
    btn_about = document.getElementById("about");
    btn_list = document.getElementById("list");
    title_navbar = document.getElementById("titleNavbar");
});

function toggle_dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}

function clear_active() { //Clear colors on te game selector
    var nodes = document.getElementById('titleSelector').childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName.toLowerCase() == 'a') {
            nodes[i].className = "";
        }
    }
}

function FullOrCommon(full) { // this change the iframe and the div for full page (for list and about) Splited or not
    if (full) { //Class that'll hide the topnav²
        iframe.className = "main";
        if (title_navbar.classList.contains('show')) {
            title_navbar.classList.remove('show');
        }
    } else { //show topnav²
        iframe.className = "main_";
        if (!title_navbar.classList.contains('show')) {
            title_navbar.classList.toggle('show');
        }
        
    }
}

function load_common(title_id){ //Load the page that is common for every game
    iframe.src = "./titles/common.html";
    FullOrCommon(false); //show topnav²

    btn_list.className = ""; //Colors for the menu
    btn_about.className = "";
    document.getElementById(title_id).className = "active";

    window.titleID = title_id; //Global var for the title ID
    const reloadCommonEvent = new CustomEvent("reloadCommonEvent", {detail: window.titleID});//New page means reaload common infos
    window.dispatchEvent(reloadCommonEvent); 
}

function load_game(url) { //load the pag that is specific to the game
    iframe.src = url;

    const reloadCommonEvent = new CustomEvent("reloadCommonEvent", {detail: window.titleID});//New page means reaload common infos
    window.dispatchEvent(reloadCommonEvent); 
}

function load_list() { //Seperate function cause of the active color
    iframe.src = "./list.html";
    btn_list.className = "active";
    btn_about.className = "";
    FullOrCommon(true);
    clear_active();
}

function load_about() { //Seperate function cause of the active color
    iframe.src = "./about.html";
    btn_list.className = "";
    btn_about.className = "active";
    FullOrCommon(true);
    clear_active();
}