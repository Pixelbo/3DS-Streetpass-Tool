//Iframe JS
var title_navbar, iframe;

window.addEventListener('DOMContentLoaded', () => { //Define vars
    title_navbar = document.getElementById("titleNavbar");
    iframe = window.parent.document.getElementById("main")
});

function toggle_dropdown(which) {
    document.getElementById(which).classList.toggle("show");
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    var dropdown_input = document.getElementById("dropdown_input");
    var dropdown_output = document.getElementById("dropdown_output");


    if(!e.target.matches('.dropbtnI') && !e.target.matches('.dropbtnO')){ //Cool garbage that works
        if (dropdown_input.classList.contains('show')) {
            dropdown_input.classList.remove('show');
        }
        if (dropdown_output.classList.contains('show')) {
            dropdown_output.classList.remove('show');
        }
    }else if (!e.target.matches('.dropbtnI')) {
        if (dropdown_input.classList.contains('show')) {
            dropdown_input.classList.remove('show');
        }
    }else if(!e.target.matches('.dropbtnO')){
        if (dropdown_output.classList.contains('show')) {
            dropdown_output.classList.remove('show');
        }
    }
}

function load_game(ID) { //load the page that is specific to the game
    iframe.src = `./titles/${ID}.html`;
}

function load_common() { //not the same common as menu.js!
    iframe.src = `./titles/common.html`;
}