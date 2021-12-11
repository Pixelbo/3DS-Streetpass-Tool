//File that'll preload; everything related to how behavior works/events

const fs = require("fs");
var reading = require("./reading")
var common = require("./common");

!fs.existsSync("./CEC") && fs.mkdirSync("./CEC"); //Check if the dir CEC exist

function add_gamesToList() { //read the function name
    var titles = reading.listTitles();
    var titleList = document.getElementById("titleSelector");
    var i = 0;
    titles.forEach((title) => {
        var hex = reading.readHex(`./CEC/${title}/MessBoxName`, 0, 0);
        var titleName = reading.hexToUTF(hex);

        var child = document.createElement("a");
        var text = document.createTextNode(titleName);

        child.setAttribute("onclick", `load_page("./titles/${title}.html");`);
        child.id = title
        child.href = "#"

        child.appendChild(text);

        titleList.appendChild(child);
        i++;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    add_gamesToList();
});

window.addEventListener("reloadCommonEvent", (e) => {
    common.set_app_info(e.detail); //Set the common infos
});