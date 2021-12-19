# CECTool_Electron

Tool in electron to edit/generate files providen by the CecBoxTool dev app;


File structure:
/CECTool_Electron
|   
+---CEC
|       *CEC Extrated via CECBoxTool*  
|            
+---css
|       *Css files*
|       
+---libs                    *Javascripts file*
|       common.js           *Node module for readng and parsing boxes*
|       menu.js             *JS module for everything related to the buttons (main menu)*
|       menu_dropdown.js    *JS module for the dropdown in the iframe*
|       preload.js          *Node module called before the page loads for setting everything up and adds up listener*
|       reading.js          *Node module for everything related to reading files*
|           
+---titles                  *HTML pages*
|       00020800.html       *html file unique to each game (custom mess building)*
|       common.html         *html file common to each game (basic mess building)*
|      
|   .gitignore              *ahem*
|   about.html              *About the project, 1st loaded in the iframe*
|   index.html              *The main html file*         
|   list.html               *List about the supported games*
|   main.js                 *Electron building gui setup*
|   package.json            *yes but no*
|   README.md               *what you're reading*
|   workspace.code-workspace*For VSCODE*
\   yarn.lock               *lul*
