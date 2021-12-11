const fs = require("fs");

exports.load_file = function(path_to_file) {
    return fs.readFileSync(path_to_file, { encoding: "hex" });
}

exports.listTitles = function () {
    var titles = []
    fs.readdirSync("./CEC").forEach((dir) => {

        if (fs.statSync("./CEC/" + dir).isDirectory()) {
            titles.push(dir)
        }
    })

    if (titles.length === 0) {
        return false;
    } else {
        return titles;
    }
}

exports.readHex = function (data, offset_, size, loaded) {
    offset_ = parseInt(offset_) * 2; //*2 because js counts in quartet not octet
    size = parseInt(size) * 2;

    if(!loaded) {var buffer = fs.readFileSync(data, { encoding: "hex" });
    }else{var buffer = data}
    
    if (size == 0) {
        return buffer.slice(offset_);
    } else {
        return buffer.slice(offset_, offset_ + size);
    }

}
exports.hexToUTF = function (HexString) {
    var buffer = [];

    HexString.match(/.{4}/g).forEach((code) => {
        buffer.push(
            String.fromCodePoint(
                parseInt(
                    code.replace("00", ""), 16)));
    });
    buffer = buffer.join("");
    return buffer.slice(0, -1); //delete EOF of string
}
