//Everything common get here
//Equals to every file that is not in the inbox or outbox folders (Messboxinfo, inboxonfo, ...)

var reading = require("./reading")
var path = require("path");

var iframeDOC, dropdown_in, dropdown_out;

window.addEventListener('DOMContentLoaded', () => {
    iframeDOC = document.getElementById("main").contentWindow;

    window.addEventListener('reloadIframeEvent', (e) => {
        if (path.parse(iframeDOC.document.URL).name == "common") {
            //Called when the IFrame is on hte common page
            window.titleID = e.detail;

            dropdown_in = iframeDOC.document.getElementById("dropdown_input");
            dropdown_out = iframeDOC.document.getElementById("dropdown_output");

            set_app_info(window.titleID); //Set the common infos
            set_inoutdropbox_info(window.titleID); //Set the messages in the dropdown
        }
    });

    window.addEventListener("reloadCommonEvent", (e) => {
        var IorO = (e.detail.slice(0,1)==="I") ? true : false;
        var mess_id = e.detail.slice(1,17);

        if(IorO){

        }else{

        }

    });
});

function get_app_info(id) {
    var file_data = reading.load_file(`./CEC/${id}/MessBoxInfo`);

    var title_id = reading.readHex(file_data, 0x4, 0x4, true).match(/../g).reverse().join('');

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

function set_app_info(id) {
    var data = get_app_info(id);
    var date_accessed = new Date(
        data[1]["year"],
        data[1]["date"][0] - 1, //Cause date module begin at 0
        data[1]["date"][1],
        data[1]["time"][0],
        data[1]["time"][1],
        data[1]["time"][2]
    );
    var date_opened = new Date(
        data[2]["year"],
        data[2]["date"][0] - 1, //Cause date module begin at 0
        data[2]["date"][1],
        data[2]["time"][0],
        data[2]["time"][1],
        data[2]["time"][2]
    );

    var iframe = document.getElementById("main").contentWindow;

    iframe.document.getElementById("titleID").innerText = data[0];

    iframe.document.getElementById("date_accessed").innerText = "Date accessed: " + date_accessed.toDateString();
    iframe.document.getElementById("date_opened").innerText = "Date opened: " + date_opened.toDateString();

    iframe.document.getElementById("inbox").innerText =
        `Inbox: -Box Size: ${data[3]["box_data"]}, MaxBoxSize: ${data[3]["max_box_data"]}-Num of Messages: ${data[3]["curr_mess"]}, MaxMessages: ${data[3]["max_mess"]}, MaxMessSize: ${data[3]["max_mess_size"]}`;

    iframe.document.getElementById("outbox").innerText =
        `Outbox: -Box Size: ${data[4]["box_data"]}, MaxBoxSize: ${data[4]["max_box_data"]}-Num of Messages: ${data[4]["curr_mess"]}, MaxMessages: ${data[4]["max_mess"]}, MaxMessSize: ${data[4]["max_mess_size"]}`;

}

function set_inoutdropbox_info(id){
    var Inboxes = reading.listFiles(path.normalize(`./CEC/${id}/Inbox/`));
    var inID;

    Inboxes.forEach(inbox => {
        inID = reading.readHex(path.normalize(`./CEC/${id}/Inbox/${inbox}`), 0x20, 0x8, false);

        var ina = document.createElement("a");

        var text = document.createTextNode(inID);
        ina.appendChild(text);

        ina.id = inID;
        ina.href = "#Main_Inbox";
        ina.setAttribute("onclick", `reload_Common_Event("${inID}", true);`);

        dropdown_in.appendChild(ina);
    });
    set_input_info(id, inID)

    var Outboxes = reading.listFiles(path.normalize(`./CEC/${id}/Outbox/`));
    var outID;

    Outboxes.forEach(outbox => {
        outID = reading.readHex(path.normalize(`./CEC/${id}/Outbox/${outbox}`), 0x20, 0x8, false);

        var outa = document.createElement("a");

        var text = document.createTextNode(outID);
        outa.appendChild(text);

        outa.id = outID;
        outa.href = "#Main_Inbox";
        outa.setAttribute("onclick", `reload_Common_Event("${outID}", false);`);
        
        dropdown_out.appendChild(outa);
    });
    set_output_info(id, outID);
    
}

function get_mess_info(game_id, id, IorO){

}

function set_input_info(game_id, id){
    var data = get_mess_info(game_id, id, true);

}

function set_output_info(game_id, id){
    var data = get_mess_info(game_id, id, false);

}