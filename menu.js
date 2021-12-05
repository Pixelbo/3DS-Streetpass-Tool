
var iframe, btn_about, btn_list;

window.addEventListener('DOMContentLoaded', () => {
    iframe = document.getElementById("main");
    btn_about = document.getElementById("about");
    btn_list = document.getElementById("list");
});

function clear_active(){
    var nodes = document.getElementById('titleSelector').childNodes;
    for(var i=0; i<nodes.length; i++) {
        if (nodes[i].nodeName.toLowerCase() == 'a') {
            nodes[i].className = "";
        }
}
}

function load_page(url){
    iframe.src = url;
    btn_list.className = "";
    btn_about.className = "";
    document.getElementById(url.slice(9, 17)).className = "active";
}

function load_list(){ //Seperate function cause of the active color
    iframe.src = "./list.html";
    btn_list.className = "active";
    btn_about.className = "";
    clear_active();
}

function load_about(){ //Seperate function cause of the active color
    iframe.src = "./about.html";
    btn_list.className = "";
    btn_about.className = "active";
    clear_active();
}