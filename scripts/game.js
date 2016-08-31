var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Create the canvas
//var canvas = document.createElement("canvas");
//var ctx = canvas.getContext("2d");
//canvas.width = 800;
//canvas.height = 500;
//document.body.appendChild(canvas);

//get canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//Background Image
var backgroundImage = new Image();
// Bot images
var botNorthImage = new Image();
var botSouthImage = new Image();
var botWestImage = new Image();
var botEastImage = new Image();
var turnBotLeft;
var turnBotRight;
var moveBot;
var placeBot;
var botReport;
var executeCommand;

var bot;
var Bot = function (nImage, sImage, wImage, eImage) {
    var unitLength = 70;
    var stepsToMove = 0;
    this.x = 420;
    this.y = 420;
    var onTable = false;
    var direction = "NORTH";
    var currentImage = nImage;
    var images = {};
    images.NORTH = nImage;
    images.SOUTH = sImage;
    images.WEST = wImage;
    images.EAST = eImage;

    function canvasXCoordfromTableXCoord(coord) {
        if (onTable) {
            return 70 + (coord * unitLength);
        }
        else {
            return 420;
        }
    }

    function canvasYCoordfromTableYCoord(coord) {
        if (onTable) {
            return 350 - (coord * unitLength);
        }
        else {
            return 420;
        }
    }

    

    this.Render = function (context) {
        context.drawImage(currentImage, this.x, this.y, unitLength, unitLength);
    }

    this.Place = function (x, y, facing) {
        x = Number(x);
        y = Number(y);
        if ((x >= 0) && (x <= 4) && (y >= 0) && (y <= 4)) {
            onTable = true;
            this.x = canvasXCoordfromTableXCoord(x);
            this.y = canvasYCoordfromTableYCoord(y);
            direction = facing.toUpperCase();
            currentImage = images[direction];            
        }
    }
    this.Left = function () {
        if (onTable) {
            if (direction == "NORTH") {
                direction = "WEST";
            } else if (direction == "WEST") {
                direction = "SOUTH";
            } else if (direction == "SOUTH") {
                direction = "EAST";
            } else if (direction == "EAST") {
                direction = "NORTH";
            }
            currentImage = images[direction];
        }
    }

    this.Right = function () {
        if (onTable) {
            if (direction == "NORTH") {
                direction = "EAST";
            } else if (direction == "EAST") {
                direction = "SOUTH";
            } else if (direction == "SOUTH") {
                direction = "WEST";
            } else if (direction == "WEST") {
                direction = "NORTH";
            }
            currentImage = images[direction];
        }
    }

    this.Move = function () {
        var collision = false;
        if (stepsToMove == 0) {
            if ((direction == "NORTH") && (this.y != canvasYCoordfromTableYCoord(4))) {

            } else if ((direction == "EAST") && (this.x != canvasXCoordfromTableXCoord(4))) {

            } else if ((direction == "SOUTH") && (this.y != canvasYCoordfromTableYCoord(0))) {

            } else if ((direction == "WEST") && (this.x != canvasXCoordfromTableXCoord(0))) {

            } else {
                collision = true;
            }
            if (!collision) {
                stepsToMove = 70;
            }
        }
    }

    this.Update = function () {
        if (stepsToMove > 0) {
            if (direction == "NORTH") {
                this.y -= 5;
            } else if (direction == "EAST") {
                this.x += 5;
            } else if (direction == "SOUTH") {
                this.y += 5;
            } else if (direction == "WEST") {
                this.x -= 5;
            }
            stepsToMove -= 5;
        }
    }

    this.Report = function () {
        if (onTable) {
            var tableX = Math.ceil((this.x - 70) / unitLength);
            var tableY = Math.ceil((350 - this.y) / unitLength);
            reportResult = tableX + "," + tableY + "," + direction;
            logToCommandWindow(reportResult);
        }
    }

};

function logToCommandWindow(str) {
    var commandWindow = document.getElementById("commandWindow");
    commandWindow.value += str + "\r\n";
    commandWindow.scrollTop = commandWindow.scrollHeight;
}

var backgroundLoaded = new Promise(function (resolve, reject) {
    backgroundImage.src = "images/table.png";
    backgroundImage.onload = function () {
        resolve("Table loaded");
    };
});

var botNorthLoaded = new Promise(function (resolve, reject) {
    botNorthImage.src = "images/bot_north.png";
    botNorthImage.onload = function () {
        resolve("Bot loaded");
    };
});

var botSouthLoaded = new Promise(function (resolve, reject) {
    botSouthImage.src = "images/bot_south.png";
    botSouthImage.onload = function () {
        resolve("Bot loaded");
    };
});

var botWestLoaded = new Promise(function (resolve, reject) {
    botWestImage.src = "images/bot_west.png";
    botWestImage.onload = function () {
        resolve("Bot loaded");
    };
});

var botEastLoaded = new Promise(function (resolve, reject) {
    botEastImage.src = "images/bot_east.png";
    botEastImage.onload = function () {
        resolve("Bot loaded");
    };
});
Promise.all([backgroundLoaded, botNorthLoaded, botSouthLoaded, botWestLoaded, botEastLoaded]).then(function () {
    // all loaded
    bot = new Bot(botNorthImage, botSouthImage, botWestImage, botEastImage);

    turnBotLeft = function () {
        bot.Left();
    }

    turnBotRight = function () {
        bot.Right();
    }

    moveBot = function () {
        bot.Move();
    }

    placeBot = function () {
        var xSelect = document.getElementById("tableX");
        var tableX = Number(xSelect.options[xSelect.selectedIndex].text) - 1;

        var ySelect = document.getElementById("tableY");
        var tableY = Number(ySelect.options[ySelect.selectedIndex].text);

        var facingSelect = document.getElementById("facing");
        var facing = facingSelect.options[facingSelect.selectedIndex].text;
        
        bot.Place(tableX, tableY, facing);
    }

    botReport = function () {
        bot.Report();
    }

    executeCommand = function (event) {
        if (event.keyCode == 13) {
            var placeRe = /(PLACE)\s+([0-5])\s*,\s*([0-5])\s*,\s*(NORTH|SOUTH|WEST|EAST)/;
            var moveRe = /\s*MOVE\s*/;
            var leftRe = /\s*LEFT\s*/;
            var rightRe = /\s*RIGHT\s*/;
            var reportRe = /\s*REPORT\s*/;
            var command = document.getElementById('newCommand').value.toUpperCase();

            if (placeRe.test(command)) {
                var match = command.match(placeRe);
                var tableX = match[2];
                var tableY = match[3];
                var facing = match[4];
                bot.Place(tableX, tableY, facing);
                command = "PLACE " + tableX + "," + tableY + "," + facing;
                logToCommandWindow(command);
            } else if (moveRe.test(command)) {
                bot.Move();
                command = "MOVE";
                logToCommandWindow(command);
            } else if (leftRe.test(command)) {
                bot.Left();
                command = "LEFT";
                logToCommandWindow(command);
            } else if (rightRe.test(command)) {
                bot.Right();
                command = "RIGHT";
                logToCommandWindow(command);
            } else if (reportRe.test(command)) {
                command = "REPORT";
                logToCommandWindow(command);
                bot.Report();                
            } else {
                logToCommandWindow("Bad command >> " + command + " \r\n Please check spec for command format")
            }
            document.getElementById('newCommand').value = "";
            return false;
        }

    }

    // The main game loop
    var main = function () {

        //ctx.beginPath();
        //ctx.rect(0, 0, 490, 490);
        //ctx.fillStyle = "darkgreen";
        //ctx.fill();

        //ctx.beginPath();        
        //ctx.rect(70, 70, 350, 350);
        //ctx.fillStyle = "lightgray";
        //ctx.fill();
        ctx.drawImage(backgroundImage, 0, 0);
        bot.Update();
        bot.Render(ctx);
        requestAnimationFrame(main);
    };
    
    main();
}, function () {
    // one or more failed
});




