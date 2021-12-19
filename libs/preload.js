//File that'll preload; everything related to how behavior works/events

const fs = require("fs");
var reading = require("./reading");
var common = require("./common")

!fs.existsSync("./CEC") && fs.mkdirSync("./CEC"); //Check if the dir CEC exist

function add_gamesToList() { //read the function name
    var titles = reading.listDirs("./CEC/");
    var titleList = document.getElementById("titleSelector");
    var i = 0;
    titles.forEach((title) => {
        var hex = reading.readHex(`./CEC/${title}/MessBoxName`, 0, 0);
        var titleName = reading.hexToUTF(hex);

        var child = document.createElement("a");
        var text = document.createTextNode(titleName);

        child.setAttribute("onclick", `load_common("${title}");`);
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