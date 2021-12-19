//This is a "clean" js file without node that serves for changing aspect of the page when buttons are pressed

var iframe, btn_about, btn_list;


window.addEventListener('DOMContentLoaded', () => { //Define vars
    iframe = document.getElementById("main");
    btn_about = document.getElementById("about");
    btn_list = document.getElementById("list");
});

function clear_active() { //Clear colors on te game selector
    var nodes = document.getElementById('titleSelector').childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName.toLowerCase() == 'a') {
            nodes[i].className = "";
        }
    }
}

function FullOrCommon(full) { // this change the iframe and the div for full page (for list and about) Splited or not
    if (full) { 
        iframe.className = "main";
    } else { //show topnav²
        iframe.className = "main_";
    }
}

function load_common(title_id){ //Load the page that is common for every game
    iframe.src = "./titles/common.html";
    FullOrCommon(false); //show topnav²

    btn_list.className = ""; //Colors for the menu
    btn_about.className = "";
    document.getElementById(title_id).className = "active";

    window.titleID = title_id; //Global var for the title ID

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

function iframe_reload_envent(){
    const reloadIframeEvent = new CustomEvent("reloadIframeEvent", {detail: window.titleID});//New page means reaload common infos
    window.dispatchEvent(reloadIframeEvent); 
}