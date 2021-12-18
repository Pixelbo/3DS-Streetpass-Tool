var title_navbar;

window.addEventListener('DOMContentLoaded', () => { //Define vars
    title_navbar = document.getElementById("titleNavbar");
});

function toggle_dropdown(which) {
    document.getElementById(which).classList.toggle("show");
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("dropdown_input");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
        var myDropdown = document.getElementById("dropdown_output");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}