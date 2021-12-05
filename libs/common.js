//Everything common get here
var reading = require("./reading")
//TODO: big think: optimize!!!!
exports.get_app_info = function (id) {

    var title_id = reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x4, 0x4);

    var timestamp_acessed = {
        "year": parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x34, 0x2).match(/../g).reverse().join(''), 16), // Big endian to little endian
        "date": [
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x38, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x39, 0x1).match(/../g).reverse().join(''), 16)
        ],
        "time": [
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x3B, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x3C, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x3D, 0x1).match(/../g).reverse().join(''), 16)
        ],
    };

    var timestamp_opened = {
        "year": parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x44, 0x2).match(/../g).reverse().join(''), 16), // Big endian to little endian
        "date": [
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x48, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x49, 0x1).match(/../g).reverse().join(''), 16)
        ],
        "time": [
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x4B, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x4C, 0x1).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(`./CEC/${id}/MessBoxInfo`, 0x4D, 0x1).match(/../g).reverse().join(''), 16)
        ],
    };

    var inbox_infos = {
        "max_box_data": parseInt(reading.readHex(`./CEC/${id}/InboxInfo`, 0x8, 0x4).match(/../g).reverse().join(''), 16), //Allways the same
        "box_data": parseInt(reading.readHex(`./CEC/${id}/InboxInfo`, 0xC, 0x4).match(/../g).reverse().join(''), 16),
        "max_mess": parseInt(reading.readHex(`./CEC/${id}/InboxInfo`, 0x10, 0x4).match(/../g).reverse().join(''), 16),
        "curr_mess": parseInt(reading.readHex(`./CEC/${id}/InboxInfo`, 0x14, 0x4).match(/../g).reverse().join(''), 16),
        "max_mess_size": parseInt(reading.readHex(`./CEC/${id}/InboxInfo`, 0x1C, 0x4).match(/../g).reverse().join(''), 16)
    }

    var outbox_infos = {
        "max_box_data": parseInt(reading.readHex(`./CEC/${id}/OutboxInfo`, 0x8, 0x4).match(/../g).reverse().join(''), 16), //Allways the same
        "box_data": parseInt(reading.readHex(`./CEC/${id}/OutboxInfo`, 0xC, 0x4).match(/../g).reverse().join(''), 16),
        "max_mess": parseInt(reading.readHex(`./CEC/${id}/OutboxInfo`, 0x10, 0x4).match(/../g).reverse().join(''), 16),
        "curr_mess": parseInt(reading.readHex(`./CEC/${id}/OutboxInfo`, 0x14, 0x4).match(/../g).reverse().join(''), 16),
        "max_mess_size": parseInt(reading.readHex(`./CEC/${id}/OutboxInfo`, 0x1C, 0x4).match(/../g).reverse().join(''), 16)
    }

    return [title_id, timestamp_acessed, timestamp_opened, inbox_infos, outbox_infos]
}