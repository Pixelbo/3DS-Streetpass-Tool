var iframe, btn_about, btn_list, common_div;

window.addEventListener('DOMContentLoaded', () => {
    iframe = document.getElementById("main");
    btn_about = document.getElementById("about");
    btn_list = document.getElementById("list");
    common_div = document.getElementById("common_div");
});

function clear_active() {
    var nodes = document.getElementById('titleSelector').childNodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName.toLowerCase() == 'a') {
            nodes[i].className = "";
        }
    }
}

function FullOrCommon(full) { // this change the iframe and the div for full page (for list and about)
    if (full) {
        iframe.className = "main";
        common_div.className = "common";
    } else {
        iframe.className = "main_";
        common_div.className = "common_";
    }
}

function load_page(url) {
    FullOrCommon(false);
    iframe.src = url;
    btn_list.className = "";
    btn_about.className = "";
    document.getElementById(url.slice(9, 17)).className = "active";
    window.titleID = url.slice(9, 17);
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