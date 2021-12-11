//Everything common get here
//Equals to every file that is not in the inbox or outbox folders (Messboxinfo, inboxonfo, ...)

var reading = require("./reading")

function get_app_info(id) {
    var file_data = reading.load_file(`./CEC/${id}/MessBoxInfo`);

    var title_id = reading.readHex(file_data, 0x4, 0x4, true);

    var timestamp_acessed = {
        "year": parseInt(reading.readHex(file_data, 0x34, 0x2, true).match(/../g).reverse().join(''), 16), // Big endian to little endian
        "date": [
            parseInt(reading.readHex(file_data, 0x38, 0x1, true).match(/../g).reverse().join(''), 16), //Maybe doing it to function shrug
            parseInt(reading.readHex(file_data, 0x39, 0x1, true).match(/../g).reverse().join(''), 16)
        ],
        "time": [
            parseInt(reading.readHex(file_data, 0x3B, 0x1, true).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(file_data, 0x3C, 0x1, true).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(file_data, 0x3D, 0x1, true).match(/../g).reverse().join(''), 16)
        ],
    };

    var timestamp_opened = {
        "year": parseInt(reading.readHex(file_data, 0x44, 0x2, true).match(/../g).reverse().join(''), 16), // Big endian to little endian
        "date": [
            parseInt(reading.readHex(file_data, 0x48, 0x1, true).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(file_data, 0x49, 0x1, true).match(/../g).reverse().join(''), 16)
        ],
        "time": [
            parseInt(reading.readHex(file_data, 0x4B, 0x1, true).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(file_data, 0x4C, 0x1, true).match(/../g).reverse().join(''), 16),
            parseInt(reading.readHex(file_data, 0x4D, 0x1, true).match(/../g).reverse().join(''), 16)
        ],
    };

    var file_data = reading.load_file(`./CEC/${id}/InboxInfo`);

    var inbox_infos = {
        "max_box_data": parseInt(reading.readHex(file_data, 0x8, 0x4, true).match(/../g).reverse().join(''), 16), //Allways the same
        "box_data": parseInt(reading.readHex(file_data, 0xC, 0x4, true).match(/../g).reverse().join(''), 16),
        "max_mess": parseInt(reading.readHex(file_data, 0x10, 0x4, true).match(/../g).reverse().join(''), 16),
        "curr_mess": parseInt(reading.readHex(file_data, 0x14, 0x4, true).match(/../g).reverse().join(''), 16),
        "max_mess_size": parseInt(reading.readHex(file_data, 0x1C, 0x4, true).match(/../g).reverse().join(''), 16)
    }

    var file_data = reading.load_file(`./CEC/${id}/OutboxInfo`);

    var outbox_infos = {
        "max_box_data": parseInt(reading.readHex(file_data, 0x8, 0x4, true).match(/../g).reverse().join(''), 16), //Allways the same
        "box_data": parseInt(reading.readHex(file_data, 0xC, 0x4, true).match(/../g).reverse().join(''), 16),
        "max_mess": parseInt(reading.readHex(file_data, 0x10, 0x4, true).match(/../g).reverse().join(''), 16),
        "curr_mess": parseInt(reading.readHex(file_data, 0x14, 0x4, true).match(/../g).reverse().join(''), 16),
        "max_mess_size": parseInt(reading.readHex(file_data, 0x1C, 0x4, true).match(/../g).reverse().join(''), 16)
    }

    return [title_id, timestamp_acessed, timestamp_opened, inbox_infos, outbox_infos]
}

exports.set_app_info = function(id){
    var data = get_app_info(id);
    var date_accessed = new Date(
        data[1]["year"],
        data[1]["date"][0]-1, //Cause date module begin at 0
        data[1]["date"][1],
        data[1]["time"][0],
        data[1]["time"][1],
        data[1]["time"][2]
    );
    var date_opened = new Date(
        data[2]["year"],
        data[2]["date"][0]-1, //Cause date module begin at 0
        data[2]["date"][1],
        data[2]["time"][0],
        data[2]["time"][1],
        data[2]["time"][2]
    );

    document.getElementById("titleID").innerText = data[0];

    document.getElementById("date_accessed").innerText = "Date accessed: " + date_accessed.toDateString();
    document.getElementById("date_opened").innerText = "Date opened: " + date_opened.toDateString();
    
    document.getElementById("inbox").innerText = 
    `Inbox: -Box Size: ${data[3]["box_data"]}, MaxBoxSize: ${data[3]["max_box_data"]}-Num of Messages: ${data[3]["curr_mess"]}, MaxMessages: ${data[3]["max_mess"]}, MaxMessSize: ${data[3]["max_mess_size"]}`;

    document.getElementById("outbox").innerText = 
    `Outbox: -Box Size: ${data[4]["box_data"]}, MaxBoxSize: ${data[4]["max_box_data"]}-Num of Messages: ${data[4]["curr_mess"]}, MaxMessages: ${data[4]["max_mess"]}, MaxMessSize: ${data[4]["max_mess_size"]}`;

}