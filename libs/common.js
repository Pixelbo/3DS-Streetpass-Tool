//Everything common get here
//Equals to every file that is not in the inbox or outbox folders (Messboxinfo, inboxonfo, ...)

var reading = require("./reading")
var path = require("path");
var Gauge = require("svg-gauge");

var iframeDOC, dropdown_in, dropdown_out;


//////////////////////////////////////////////////////////////Init and load
window.addEventListener('DOMContentLoaded', () => {
    iframeDOC = document.getElementById("main").contentWindow;

    window.addEventListener('reloadIframeEvent', (e) => {/////////Called when the iframe needs to be reloaded (like changing page)
        if (path.parse(iframeDOC.document.URL).name == "common") {
            //Called when the IFrame is on hte common page
            window.titleID = e.detail;

            dropdown_in = iframeDOC.document.getElementById("dropdown_input");
            dropdown_out = iframeDOC.document.getElementById("dropdown_output");

            set_app_info(window.titleID); //Set the common infos
            set_inoutdropbox_info(window.titleID); //Set the messages in the dropdown

        }
    });

    window.addEventListener("reloadCommonEvent", (e) => { /////////Called when it needs to be reloaded (info like inputs or outputs)
        var IorO = (e.detail.slice(0,1)==="I") ? true : false;
        var mess_id = e.detail.slice(1,);
        if(IorO){
            set_input_info(window.titleID, mess_id);
        }else{
            set_output_info(window.titleID, mess_id);
        }

    });

    
});

///////////////////////////////////////////////////////////////////Get the box infos (last time opened a game opened it, ...)
function get_app_info(id) {
    var file_data = reading.load_file(`${window.CECPATH}/${id}/MessBoxInfo`);

    var title_id = reading.readHex(file_data, 0x4, 0x4, true).match(/../g).reverse().join('');

    var timestamp_acessed = {
        "year": reading.reverse_endian(reading.readHex(file_data, 0x34, 0x2, true)), // Big endian to little endian
        "date": [
            reading.reverse_endian(reading.readHex(file_data, 0x38, 0x1, true)) , //Maybe doing it to function shrug
            reading.reverse_endian(reading.readHex(file_data, 0x39, 0x1, true)) 
        ],
        "time": [
            reading.reverse_endian(reading.readHex(file_data, 0x3B, 0x1, true)) ,
            reading.reverse_endian(reading.readHex(file_data, 0x3C, 0x1, true)) ,
            reading.reverse_endian(reading.readHex(file_data, 0x3D, 0x1, true)) 
        ],
    };

    var timestamp_received = {
        "year": reading.reverse_endian(reading.readHex(file_data, 0x44, 0x2, true)), // Big endian to little endian
        "date": [
            reading.reverse_endian(reading.readHex(file_data, 0x48, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x49, 0x1, true))
        ],
        "time": [
            reading.reverse_endian(reading.readHex(file_data, 0x4B, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x4C, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x4D, 0x1, true))
        ],
    };

    var file_data = reading.load_file(`${window.CECPATH}/${id}/InboxInfo`);

    var inbox_infos = {
        "max_box_data": reading.reverse_endian(reading.readHex(file_data, 0x8, 0x4, true)), //Allways the same
        "box_data": reading.reverse_endian(reading.readHex(file_data, 0xC, 0x4, true)),
        "max_mess": reading.reverse_endian(reading.readHex(file_data, 0x10, 0x4, true)),
        "curr_mess": reading.reverse_endian(reading.readHex(file_data, 0x14, 0x4, true)),
        "max_mess_size": reading.reverse_endian(reading.readHex(file_data, 0x1C, 0x4, true))
    }
    window.max_inmess_size = inbox_infos["max_mess_size"];

    var file_data = reading.load_file(`${window.CECPATH}/${id}/OutboxInfo`);

    var outbox_infos = {
        "max_box_data": reading.reverse_endian(reading.readHex(file_data, 0x8, 0x4, true)), //Allways the same
        "box_data": reading.reverse_endian(reading.readHex(file_data, 0xC, 0x4, true)),
        "max_mess": reading.reverse_endian(reading.readHex(file_data, 0x10, 0x4, true)),
        "curr_mess": reading.reverse_endian(reading.readHex(file_data, 0x14, 0x4, true)),
        "max_mess_size": reading.reverse_endian(reading.readHex(file_data, 0x1C, 0x4, true))
    }
    window.max_outmess_size = outbox_infos["max_mess_size"];


    return [title_id, timestamp_acessed, timestamp_received, inbox_infos, outbox_infos]
}

///////////////////////////////////////////////////////////////////Set the box info
function set_app_info(id) {
    var data = get_app_info(id);
    
    var date_accessed = data[1]["year"].toString() +"-"+ ("0" + (data[1]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[1]["date"][1]).toString()).slice(-2);
    var time_accessed = ("0" + data[1]["time"][0].toString()).slice(-2) + ":" + ("0" + data[1]["time"][1].toString()).slice(-2) + ":" + ("0" + data[1]["time"][2].toString()).slice(-2);

    var date_received = data[2]["year"].toString() +"-"+ ("0" + (data[2]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[2]["date"][1]).toString()).slice(-2);
    var time_received = ("0" + data[2]["time"][0].toString()).slice(-2) + ":" + ("0" + data[2]["time"][1].toString()).slice(-2) + ":" + ("0" + data[2]["time"][2].toString()).slice(-2);

    iframeDOC.document.getElementById("date_accessed").setAttribute("value", date_accessed);
    iframeDOC.document.getElementById("time_accessed").setAttribute("value", time_accessed);

    iframeDOC.document.getElementById("date_received").setAttribute("value", date_received);
    iframeDOC.document.getElementById("time_received").setAttribute("value", time_received);

    iframeDOC.document.getElementById("titleID").innerText = " " + data[0];

    var GaugeMessNumI = Gauge(iframeDOC.document.getElementById("GaugeMessNumI"),{
        max: data[3]["max_mess"],
        dialStartAngle: 180,
        dialEndAngle: 0,
        value: 0,
        iewBox: "0 0 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeMessNumI.setValueAnimated(data[3]["curr_mess"], 1);

    var GaugeBoxSizeI = Gauge(iframeDOC.document.getElementById("GaugeBoxSizeI"),{
        max: Math.round(data[3]["max_box_data"]/1000),
        dialStartAngle: 0,
        dialEndAngle: -180,
        viewBox: "0 40 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeBoxSizeI.setValueAnimated(Math.round(data[3]["box_data"]/1000), 1);

    var GaugeMessNumO = Gauge(iframeDOC.document.getElementById("GaugeMessNumO"),{
        max: data[4]["max_mess"],
        dialStartAngle: 180,
        dialEndAngle: 0,
        value: 0,
        iewBox: "0 0 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeMessNumO.setValueAnimated(data[4]["curr_mess"], 1);

    var GaugeBoxSizeO = Gauge(iframeDOC.document.getElementById("GaugeBoxSizeO"),{
        max: Math.round(data[4]["max_box_data"]/1000),
        dialStartAngle: 0,
        dialEndAngle: -180,
        viewBox: "0 40 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeBoxSizeO.setValueAnimated(Math.round(data[4]["box_data"]/1000), 1);
}

///////////////////////////////////////////////////////////////////Set the dropdonw texts
function set_inoutdropbox_info(id){
    
    var Inboxes = reading.listFiles(path.normalize(`${window.CECPATH}/${id}/Inbox/`));
    var inID;

    Inboxes.forEach(inbox => { //creating the element for each message
        inID = inbox;

        var ina = document.createElement("a");

        var text = document.createTextNode(inID);
        ina.appendChild(text);

        ina.id = inID;
        ina.href = "#Main_Inbox";
        ina.setAttribute("onclick", `reload_Common_Event("${inID}", true);`);

        dropdown_in.appendChild(ina);
    });

    set_input_info(id, inID) //Set the input infos for the first time (last mess)


    var Outboxes = reading.listFiles(path.normalize(`${window.CECPATH}/${id}/Outbox/`));
    var outID;

    Outboxes.forEach(outbox => {
        outID = outbox;

        var outa = document.createElement("a");

        var text = document.createTextNode(outID);
        outa.appendChild(text);

        outa.id = outID;
        outa.href = "#Main_Outbox";
        outa.setAttribute("onclick", `reload_Common_Event("${outID}", false);`);
        
        dropdown_out.appendChild(outa);
    });

    set_output_info(id, outID); //Same as before
    
}

///////////////////////////////////////////////////////////////////Get the information about the message
function get_mess_info(game_id, id, IorO){
    if(IorO){
        var path = `${window.CECPATH}/${game_id}/Inbox/${id}`;
    }else{
        var path = `${window.CECPATH}/${game_id}/Outbox/${id}`;
    }
    var file_data = reading.load_file(path);

    var mess_id = reading.reverse_endian(reading.readHex(file_data, 0x20, 0x8, true));
    var mess_size = reading.reverse_endian(reading.readHex(file_data, 0x4, 0x4, true));
    var send_method = reading.readHex(file_data, 0x35, 0x1, true);
    var unopen = reading.readHex(file_data, 0x36, 0x1, true);
    var isnew = reading.readHex(file_data, 0x37, 0x1, true);


    var timestamp_sent = {
        "year": reading.reverse_endian(reading.readHex(file_data, 0x48, 0x2, true)), 
        "date": [
            reading.reverse_endian(reading.readHex(file_data, 0x4C, 0x1, true)) , 
            reading.reverse_endian(reading.readHex(file_data, 0x4D, 0x1, true)) 
        ],
        "time": [
            reading.reverse_endian(reading.readHex(file_data, 0x4F, 0x1, true)) ,
            reading.reverse_endian(reading.readHex(file_data, 0x50, 0x1, true)) ,
            reading.reverse_endian(reading.readHex(file_data, 0x51, 0x1, true)) 
        ],
    };

    var timestamp_created = {
        "year": reading.reverse_endian(reading.readHex(file_data, 0x60, 0x2, true)),
        "date": [
            reading.reverse_endian(reading.readHex(file_data, 0x64, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x65, 0x1, true))
        ],
        "time": [
            reading.reverse_endian(reading.readHex(file_data, 0x66, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x67, 0x1, true)),
            reading.reverse_endian(reading.readHex(file_data, 0x68, 0x1, true))
        ],
    };
    
    return [mess_id, mess_size, send_method, unopen, isnew, timestamp_sent, timestamp_created];
}

///////////////////////////////////////////////////////////////////Set the info for the input square
function set_input_info(game_id, id){
    var data = get_mess_info(game_id, id, true);

    var date_accessed = data[5]["year"].toString() +"-"+ ("0" + (data[5]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[5]["date"][1]).toString()).slice(-2);
    var time_accessed = ("0" + data[5]["time"][0].toString()).slice(-2) + ":" + ("0" + data[5]["time"][1].toString()).slice(-2) + ":" + ("0" + data[5]["time"][2].toString()).slice(-2);

    var date_received = data[6]["year"].toString() +"-"+ ("0" + (data[6]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[6]["date"][1]).toString()).slice(-2);
    var time_received = ("0" + data[6]["time"][0].toString()).slice(-2) + ":" + ("0" + data[6]["time"][1].toString()).slice(-2) + ":" + ("0" + data[6]["time"][2].toString()).slice(-2);

    iframeDOC.document.getElementById("date_accessedI").setAttribute("value", date_accessed);
    iframeDOC.document.getElementById("time_accessedI").setAttribute("value", time_accessed);

    iframeDOC.document.getElementById("date_createdI").setAttribute("value", date_received);
    iframeDOC.document.getElementById("time_createdI").setAttribute("value", time_received);

    iframeDOC.document.getElementById("in_messID").innerText =  " " + data[0].toString(16).toUpperCase();
    
    var GaugeMessNumI = Gauge(iframeDOC.document.getElementById("GaugeMessSizeI"),{
        max: Math.round(window.max_inmess_size/1000),
        dialStartAngle: 0,
        dialEndAngle: 0.01,
        value: 0,
        iewBox: "0 0 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeMessNumI.setValueAnimated(Math.round(data[1]/1000), 1);

    iframeDOC.document.getElementById("in_messUnopen").innerText = "Mess Unopen" + data[3];
    iframeDOC.document.getElementById("in_messIsnew").innerText = "Mess New" + data[4];
}

///////////////////////////////////////////////////////////////////Set the info about the output square
function set_output_info(game_id, id){
    var data = get_mess_info(game_id, id, false);

    var date_accessed = data[5]["year"].toString() +"-"+ ("0" + (data[5]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[5]["date"][1]).toString()).slice(-2);
    var time_accessed = ("0" + data[5]["time"][0].toString()).slice(-2) + ":" + ("0" + data[5]["time"][1].toString()).slice(-2) + ":" + ("0" + data[5]["time"][2].toString()).slice(-2);

    var date_received = data[6]["year"].toString() +"-"+ ("0" + (data[6]["date"][0]-1).toString()).slice(-2) + "-" + ("0" + (data[6]["date"][1]).toString()).slice(-2);
    var time_received = ("0" + data[6]["time"][0].toString()).slice(-2) + ":" + ("0" + data[6]["time"][1].toString()).slice(-2) + ":" + ("0" + data[6]["time"][2].toString()).slice(-2);

    iframeDOC.document.getElementById("date_accessedO").setAttribute("value", date_accessed);
    iframeDOC.document.getElementById("time_accessedO").setAttribute("value", time_accessed);

    iframeDOC.document.getElementById("date_createdO").setAttribute("value", date_received);
    iframeDOC.document.getElementById("time_createdO").setAttribute("value", time_received);

    iframeDOC.document.getElementById("out_messID").innerText =  " " + data[0].toString(16).toUpperCase();
    
    var GaugeMessNumI = Gauge(iframeDOC.document.getElementById("GaugeMessSizeO"),{
        max: Math.round(window.max_inmess_size/1000),
        dialStartAngle: 0,
        dialEndAngle: 0.01,
        value: 0,
        iewBox: "0 0 100 100",
        value: 0,
        label: function(value) {return (Math.round(value) + "/" + this.max);},
    });

    GaugeMessNumI.setValueAnimated(Math.round(data[1]/1000), 1);

    iframeDOC.document.getElementById("out_messUnopen").innerText = "Mess Unopen" + data[3];
    iframeDOC.document.getElementById("out_messIsnew").innerText = "Mess New" + data[4];
}