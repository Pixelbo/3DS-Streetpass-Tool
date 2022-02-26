var read = require("./reading");

const fs = require('fs');

exports.checkCECdir = function (dir){
    if (fs.existsSync(dir)) {
        console.log('Directory exists!');
    } else {
        console.log('Directory not found.');
    }
}