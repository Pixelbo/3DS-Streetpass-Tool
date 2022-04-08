/*
This is the main file TODO: this file
*/

const inquirer = require("inquirer"); //Import some modules
const clc = require("cli-color");
var pather = require("path");

const reading = require("./libs/reading"); //Import own made modules
const checker = require("./libs/check");

var CEC_path = "./CEC/"; //Default path to the cec directory
var generalDict = {}; //All knowing dict

///////////////////////////////Message that will apear every time a prompt is here
var MainMessage = "\n"; 

MainMessage += "┌──────────────────────────────────────────────────────────┐\n";
MainMessage +=
    "│                    " + clc.green.underline.bold("3DS Streetpass Tool") + "                   │\n";
MainMessage += "│                                                          │\n";
MainMessage += "│                                                          │\n";
MainMessage += "│Share love and the GitHub!                " + clc.magenta.italic("By Pixelbo") + ", 2022│\n";
MainMessage += "└──────────────────────────────────────────────────────────┘\n";

/////////////////////////////////////////////////////////////////

function promptPath() {///If the CEC dir is not found, call a prompt to enter the path
    inquirer///Inquirer stuff
        .prompt([
            {
                type: "input",
                name: "cec_path",
                message:
                    MainMessage + "[✖] CEC Directory not found! \n Please input the path to the CEC directory: "
            }
        ])
        .then((answers) => {
            if (!checker.checkCECdir(answers.cec_path)) {//Recursive check
                console.clear();
                console.log(clc.red.bold("Again, directory not found please reenter the path;"));
                promptPath();
            } else {
                CEC_path = pather.normalize(answers.cec_path + "/");//Normalize the path + add a slash becuase folder
                Preload();//Jump to preload
            }
        });
}
////////////////////////////////////////////////////////////Select a game from our all knowing dict
function game_select() {
    choices = [];

    for (let i = 0; i < Object.keys(generalDict).length; i++) { //Parsing the dict
        choices.push({ value: i, name: generalDict[i]["BoxInfo"]["titleName"] });
    }

    inquirer
        .prompt([
            {
                type: "list",
                name: "game_selector",
                message: MainMessage + "Please Select A game from the list below!",
                choices: choices
            }
        ])
        .then((answers) => {
            var InOutboxInfo = checker.checkInOutboxInfo(generalDict[answers.game_selector]["BoxInfo"]["titleID"], CEC_path);

            if(InOutboxInfo){
                generalDict[answers.game_selector]["InOutboxInfo"] = InOutboxInfo;
                console.log(clc.green.bold("[🗸] Inbox/Outbox check passed!"));
                console.clear();
                MainMenu(answers.game_selector);
            }else {
                console.log(clc.red.bold(`[✖] A game as an error in his data!`));
                return false;
            }
            
            
        });
}
////////////////////////////////////////////////////Preaload everything
function Preload() {
    console.clear();

    if (!checker.checkCECdir(CEC_path)) { //Check the CEC Dir
        promptPath();
        return;
    } else {
        console.log(clc.green.bold("[🗸] CEC Directory found!"));
    }



    var titleCount = 0;///////////////For each title, check if the box is valid (id, name, etc) It does not verify input/output messages
    reading.listDirs(CEC_path).forEach((titleID) => {
        var BoxInfo = checker.checkTitle(titleID, CEC_path);
        if (BoxInfo) {
            generalDict[titleCount] = BoxInfo
            titleCount = titleCount + 1;
        } else {
            console.log(clc.red.bold(`[✖] A game as an error in his data!`));
        }
    });
    titleCount = titleCount - 1;

    console.log(clc.green.bold(`[🗸] Found ${titleCount + 1} game(s)`));//Prints a little message

    game_select();//Select a game
}

//////////////////////////////////////////////////////General info about the game
function GeneralInfo(listID) {
    console.clear();

    inquirer
    .prompt([
        {
            type: "list",
            name: "general_info",
            message: MainMessage + "You can here view and edit (press enter) some genral info about the game!",
            choices: [
                {value:0, name: ("ID of the title: " + generalDict[listID]["BoxInfo"]["titleID"])},
                {value:1, name: ("Name of the title: " + generalDict[listID]["BoxInfo"]["titleName"])},
                {value:2, name: ("Flag: " + generalDict[listID]["BoxInfo"]["flagMeaning"])},
                {value:3, name: ("HMAC (can't edit): " + generalDict[listID]["BoxInfo"]["hmac"])},
                {value:4, name: ("Date Accessed: " + generalDict[listID]["BoxInfo"]["dateAccessed"])},
                {value:5, name: ("Date Received: " + generalDict[listID]["BoxInfo"]["dateReceived"])},
                {value:-1, name: "Get back to the main menu!"}
        ]
        }
    ])
    .then((answers) => {
        let resp = answers.general_info;

        if(resp==-1){
            MainMenu(listID);
        }
    });

}

//////////////////////////////////////////////////////This is where the fun begins
function MainMenu(listID){//Takes the id from the dict
    console.clear();

    inquirer
        .prompt([
            {
                type: "list",
                name: "main_menu",
                message: MainMessage + "Welcome to the main menu!",
                choices: [
                    {value:0, name:"View/edit general info about the game"}, //todo: just display general dict info + menu to edit
                    {value:-1, name:new inquirer.Separator()},
                    {value:1, name:"View/edit Inbox Info"}, //todo: just display general dict info + menu to edit
                    {value:2, name:"View/edit Outbox Info"}, //todo: just display general dict info + menu to edit
                    {value:-1, name:new inquirer.Separator()},
                    {value:3, name:"View/edit an inbox message"},//not for now
                    {value:4, name:"View/edit an outbox message"},//not for now
                    {value:5, name:"Save the edits!"},//not for now
            ]
            }
        ])
        .then((answers) => {
            let resp = answers.main_menu;

            if(resp == 0){
                GeneralInfo(listID);
            }else if(resp == 1){
                console.clear();
                console.log(clc.green.bold("[🗸] Inbox info"));
                console.log(generalDict[listID]["InOutboxInfo"]["InboxInfo"]);
            }else if(resp == 2){
                console.clear();
                console.log(clc.green.bold("[🗸] Outbox info"));
                console.log(generalDict[listID]["InOutboxInfo"]["OutboxInfo"]);
            }else if(resp == 3){
                console.clear();
                console.log(clc.green.bold("[🗸] Inbox message"));
                console.log(generalDict[listID]["InOutboxInfo"]["InboxInfo"]["messages"][0]);
            }else if(resp == 4){
                console.clear();
                console.log(clc.green.bold("[🗸] Outbox message"));
                console.log(generalDict[listID]["InOutboxInfo"]["OutboxInfo"]["messages"][0]);
            }else if(resp==-1){
                console.clear();
                console.log(clc.cyan.bold(`[?] Bro don't select the seperator`));
                MainMenu(listID);
            }
        });
}

Preload();
