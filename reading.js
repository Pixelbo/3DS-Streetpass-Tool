const fs = require("fs");

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

exports.readHex = function (file, offset_, size) {
    var buffer = fs.readFileSync(file, { encoding: "hex" });
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
    return buffer.slice(0,-1); //delete EOF of string
}
