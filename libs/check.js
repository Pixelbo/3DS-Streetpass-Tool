const read = require("./reading");

const fs = require("fs");
const clc = require("cli-color");

function readTimestamp(fileBuffer, offset) {
    var date = new Date(
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x00, 0x2, true)), 16), //Year
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x04, 0x1, true)), 16)-1, //Month -1 cause fo the month offset
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x05, 0x1, true)), 16), //Day
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x07, 0x1, true)), 16)+2, //Hours +2 temp soltution
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x08, 0x1, true)), 16), //Minutes
        parseInt(read.reverse_endian(read.readHex(fileBuffer, offset + 0x09, 0x1, true)), 16) //Seconds
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

    var flag = read.reverse_endian(read.readHex(BoxInfoBuffer, 0x0C, 0x01, true)) ;
    var flagMeaning = "";

    if(flag == 0x01){flagMeaning = "APPLI";}
    else if(flag == 0x02){flagMeaning = "SYS";}
    else if(flag == 0x04){flagMeaning = "SYS2";}
    else if(flag == 0x81){flagMeaning = "HIDDEN";}

    var HMAC = read.reverse_endian(read.readHex(BoxInfoBuffer, 0x10, 0x20, true));

    var respDict = {
        BoxInfo: {
            titleID: titleID,
            titleName: titleName,
            flag: flag,
            flagMeaning: flagMeaning,
            hmac: HMAC,
            dateAccessed: dateAccessed,
            dateReceived: dateReceived
        }
    };

    return respDict;
};

exports.checkInOutboxInfo = function(titleID, CEC_path){
    ///////////////////////////////////////////Check inbox with InboxInfo file
    var InboxInfoBuffer = read.load_file(CEC_path + titleID + "/InboxInfo");

    if (read.readHex(InboxInfoBuffer, 0x00, 0x02, true) != "6262") { //Check magic number
        console.log(clc.red.bold("ERROR: bad data in InboxInfo file (magic number)"));
        return false;
    }

    let messNumI = parseInt(read.reverse_endian(read.readHex(InboxInfoBuffer, 0x14, 0x04, true)), 16);
    
    if( messNumI != read.listFiles(CEC_path + titleID + "/Inbox/").length){
        console.log(clc.red.bold("ERROR: Conflict with the number of inbox files and InboxInfo"));
        return false;
    }

    let maxMessNumI = parseInt(read.reverse_endian(read.readHex(InboxInfoBuffer, 0x10, 0x04, true)), 16);

    if(messNumI>maxMessNumI){
        console.log(clc.red.bold("ERROR: more inbox mess than the max in inbox info!"));
        return false;
    }

    let messSizeMaxI = parseInt(read.reverse_endian(read.readHex(InboxInfoBuffer, 0x1C, 0x04, true)), 16);

    let boxSizeI = parseInt(read.reverse_endian(read.readHex(InboxInfoBuffer, 0x0C, 0x04, true)), 16);
    let maxBoxSizeI = parseInt(read.reverse_endian(read.readHex(InboxInfoBuffer, 0x08, 0x04, true)), 16);

    ///////////////////////////////////////////Check outobx with OutboxInfo file

    var OutboxInfoBuffer = read.load_file(CEC_path + titleID + "/OutboxInfo");

    if (read.readHex(OutboxInfoBuffer, 0x00, 0x02, true) != "6262") { //Check magic number
        console.log(clc.red.bold("ERROR: bad data in Outobx file (magic number)"));
        return false;
    }

    let messNumO = parseInt(read.reverse_endian(read.readHex(OutboxInfoBuffer, 0x14, 0x04, true)), 16);
    
    if( messNumI != read.listFiles(CEC_path + titleID + "/Inbox/").length){
        console.log(clc.red.bold("ERROR: Conflict with the number of inbox files and InboxInfo"));
        return false;
    }

    let maxMessNumO = parseInt(read.reverse_endian(read.readHex(OutboxInfoBuffer, 0x10, 0x04, true)), 16);

    if(messNumO>maxMessNumO){
        console.log(clc.red.bold("ERROR: more inbox mess than the max in inbox info!"));
        return false;
    }

    let messSizeMaxO = parseInt(read.reverse_endian(read.readHex(OutboxInfoBuffer, 0x1C, 0x04, true)), 16);

    let boxSizeO = parseInt(read.reverse_endian(read.readHex(OutboxInfoBuffer, 0x0C, 0x04, true)), 16);
    let maxBoxSizeO = parseInt(read.reverse_endian(read.readHex(OutboxInfoBuffer, 0x08, 0x04, true)), 16);

    var respDict = {
        InboxInfo: {
            messNum: messNumI,
            maxMessNum: maxMessNumI,
            boxSize: boxSizeI,
            maxBoxSize: maxBoxSizeI,
            messSizeMax: messSizeMaxI
        },
        OutboxInfo: {
            messNum: messNumO,
            maxMessNum: maxMessNumO,
            boxSize: boxSizeO,
            maxBoxSize: maxBoxSizeO,
            messSizeMax: messSizeMaxO
        }
    };

    return respDict;
}