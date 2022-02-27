/*
This is the main file TODO: this file
*/

const inquirer = require("inquirer");
const clc = require("cli-color");
var pather = require("path");

const reading = require("./libs/reading");
const checker = require("./libs/check");
const { cp } = require("fs");

var CEC_path = "./CEC/";

var MainMessage = "\n";

MainMessage += "┌──────────────────────────────────────────────────────────┐\n";
MainMessage +=
    "│                    " + clc.underline.bold("3DS Streetpass Tool") + "                   │\n";
MainMessage += "│                                                          │\n";
MainMessage += "│                                                          │\n";
MainMessage += "│Share love and the GitHub!                By Pixelbo, 2022│\n";
MainMessage += "└──────────────────────────────────────────────────────────┘\n";

function promptPath() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "cec_path",
                message:
                    "[✖] CEC Directory not found! \n Please input the path to the CEC directory: "
            }
        ])
        .then((answers) => {
            if (!checker.checkCECdir(answers.cec_path)) {
                console.clear();
                console.log(clc.red.bold("Again, directory not found please reenter the path;"));
                promptPath();
            } else {
                CEC_path = pather.normalize(answers.cec_path + "/");
                main();
            }
        });
}

function game_select(dict) {
    choices = [];

    for (let i = 0; i < Object.keys(dict).length; i++) {
        choices.push({ value: i, name: dict[i]["BoxInfo"]["titleName"] });
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
            console.log(answers.game_selector);
        });
}

function main() {
    console.clear();

    if (!checker.checkCECdir(CEC_path)) {
        promptPath();
        return;
    } else {
        console.log(clc.green.bold("[🗸] CEC Directory found!"));
    }

    var generalDict = {};

    var titleCount = 0;
    reading.listDirs(CEC_path).forEach((titleID) => {
        var BoxInfo = checker.checkTitle(titleID, CEC_path);
        if (BoxInfo) {
            generalDict[titleCount] = BoxInfo;
            titleCount = titleCount + 1;
        } else {
            console.log(clc.red.bold(`[✖] A game as an error in his data!`));
        }
    });
    titleCount = titleCount - 1;

    console.log(clc.green.bold(`[🗸] Found ${titleCount + 1} game(s)`));

    game_select(generalDict);
}

main();
