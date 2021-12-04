const fs = require("fs");
var reading = require("./reading")

!fs.existsSync("./CEC") && fs.mkdirSync("./CEC");

window.addEventListener('DOMContentLoaded', () => {
    var titles = reading.listTitles();
    var titleList = document.getElementById("titleSelector");

    titles.forEach( (title) => {
        var hex = reading.readHex(`./CEC/${title}/MessBoxName`, 0, 0);
        var titleName = reading.hexToUTF(hex);

        var child = document.createElement("a");
        var text = document.createTextNode(titleName);

        child.href= "#"+title;
        child.appendChild(text);

        titleList.appendChild(child);
        
    });

    

})