const read = require("./reading");

const fs = require("fs");
const clc = require("cli-color");

function readTimestamp(fileBuffer, offset) {
    var date = new Date(
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x00, 0x2, true)), 16), //Year
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x04, 0x1, true)), 16), //Month
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x05, 0x1, true)), 16), //Day
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x06, 0x1, true)), 16), //Hours
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x07, 0x1, true)), 16), //Minutes
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x08, 0x1, true)), 16) //Seconds
    );

    return date;
}

exports.checkCECdir = function (dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else {
        return false;
    }
};

exports.checkTitle = function (titleID, CEC_path) {
    var titleName = read.hexToUTF(
        read.readHex(CEC_path + titleID + "/MessBoxName", 0x00, 0x00, false)
    );

    var BoxInfoBuffer = read.load_file(CEC_path + titleID + "/MessBoxInfo");

    if (read.readHex(BoxInfoBuffer, 0x00, 0x02, true) != "6363") {
        console.log(clc.red.bold("ERROR: bad data in MessBoxInfo file (magic number)"));
        return false;
    }

    if (read.reverse_endian(read.readHex(BoxInfoBuffer, 0x04, 0x04, true)) != titleID) {
        console.log(clc.red.bold("ERROR: bad data in MessBoxInfo file (titleID)"));
        return false;
    }

    var dateAccessed = readTimestamp(BoxInfoBuffer, 0x34);
    var dateReceived = readTimestamp(BoxInfoBuffer, 0x44);
    //TODO: get hmac key?

    var respDict = {
        BoxInfo: {
            titleID: titleID,
            titleName: titleName,
            dateAccessed: dateAccessed,
            dateReceived: dateReceived
        }
    };

    return respDict;
};
