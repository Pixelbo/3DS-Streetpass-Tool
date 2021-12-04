const fs = require("fs");

exports.listTitles = function(){
    var titles = fs.readdirSync("./CEC");

    if(titles.length === 0){
        return false;
    }else{
        return titles;
    }
}