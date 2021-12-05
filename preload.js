const fs = require("fs");
var reading = require("./reading")

!fs.existsSync("./CEC") && fs.mkdirSync("./CEC");

window.addEventListener('DOMContentLoaded', () => {
    var titles = reading.listTitles();
    var titleList = document.getElementById("titleSelector");
    var i = 0;
    titles.forEach( (title) => {
        var hex = reading.readHex(`./CEC/${title}/MessBoxName`, 0, 0);
        var titleName = reading.hexToUTF(hex);

        var child = document.createElement("a");
        var text = document.createTextNode(titleName);

        child.setAttribute("onclick", 'load_page("./list.html");'); //`load_page("./titles/${title}.html");`);
        child.id = title
        child.href = "#"

        child.appendChild(text);

        titleList.appendChild(child);
        i++;
    });

})
