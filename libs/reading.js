const fs = require("fs");

exports.load_file = function(path_to_file) {
    return fs.readFileSync(path_to_file, { encoding: "hex" });
}

exports.listDirs = function (path) {
    var dirs = []
    fs.readdirSync(path).forEach((dir) => {
        if (fs.statSync(path + dir).isDirectory()) {
            dirs.push(dir)
        }
    })

    if (dirs.length === 0) {
        return false;
    } else {
        return dirs;
    }
}

exports.listFiles = function (path) {
    var files = []
    fs.readdirSync(path).forEach((file) => {
        if (fs.statSync(path + file).isFile()) {
            files.push(file)
        }
    })

    if (files.length === 0) {
        return false;
    } else {
        return files;
    }
}

exports.readHex = function (data_or_path, offset_, size, loaded) {
    offset_ = parseInt(offset_) * 2; //*2 because js counts in quartet not octet
    size = parseInt(size) * 2;

    if(!loaded) {var buffer = fs.readFileSync(data_or_path, { encoding: "hex" });
    }else{var buffer = data_or_path}
    
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
