// This object holds our main methods and variables for managing the game

var app = {
    stage: null,
    CANVAS_WIDTH: 1000,
    CANVAS_HEIGHT: 500,
    mainContainer: null,
    timer: 0,
    stateTimer: 0,
    stateTimerMax: 5,
    timerText: null,
    stateText: null,
    scoreText: null,
    positionText: null,
    assetsLoaded: false,
    volumeButton: null,
    deltaTime: 0,
    circleCollider: null,
    myGameObject: null,
    playerScore: 0,
    windNum: 0,
    windValue: 5,
    userValue: 40,
    windDirection: null,
    endGameTimer: 0,
    loadPercent: null,
    fallenOff: false,
    firstPass: false,
    flyDirection: 0,
    mainMenuHeader: null,
    seesaw: 0,
    dangerText: null,
    soundStart: false,
    luckyDistance: {
        x: 0,
        y: 0
    },
    dolphinArmyCreated: false,
    time: 0,

    player: null,
    enemy: null,
    airplane: null,
    enemies: [],

    gameStates: {
        MOVE_RIGHT: 1,
        MOVE_LEFT: 2,
        MOVE_UP: 3,
        MOVE_DOWN: 4,
    },

    state: 1,
    screenState: 1,
    gameStatus: {
        pregame: 1,
        game: 2,
        endgame: 3,
    },
    mousePos: {
        x: 0,
        y: 0,
    },
    KEYCODE_LEFT: { code: 37, isPressed: false, alt: 65 },
    KEYCODE_RIGHT: { code: 39, isPressed: false, alt: 68 },
    KEYCODE_UP: { code: 38, isPressed: false, alt: 87 },
    KEYCODE_DOWN: { code: 40, isPressed: false, alt: 83 },
    KEYCODE_SPACE: { code: 32, isPressed: false },
    KEYCODE_ENTER: { code: 13, isPressed: false },
    KEYCODE_J: { code: 74, isPressed: false },

    init: function () {
        this.initCanvas();
        assets.preloadAssets();

        this.grabScreen(app.screenState);
        this.stage.enableMouseOver();
        // this.stage.on("stagemousemove", function (evt) {
        //     app.mousePos.x = evt.stageX;
        //     app.mousePos.y = evt.stageY;
        //     app.positionText.text = app.mousePos.x + "," + app.mousePos.y;
        // });
        // this.stage.on("stagemousedown", function (evt) {
        //     console.log("stage click");
        //     if (app.mousePos.x > 0 && app.mousePos.x < app.CANVAS_WIDTH / 2) {
        //         if (app.mousePos.y > 0 && app.mousePos.y < app.CANVAS_HEIGHT / 2) {

        //         }
        //     }
        // });

        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;

        createjs.Ticker.addEventListener("tick", this.update);
        createjs.Ticker.framerate = 60;
    },

    //reset game to starting state
    resetGame: function () {
        app.gameStatus = 1;
    },
    update: function (event) {
        app.stage.update(event);
        var dt = event.delta / 1000;
        app.deltaTime = dt;
        app.time += dt;
        
        if (Math.round(10 * app.time) / 10 % 5 > 1) {
            // console.log(Math.round(Math.round(10 * app.time) / 10));
            if (app.screenState == 1 && (Math.round(Math.round(10 * app.time) / 10) % 5)== 0) {
                // console.log("hello2");
                switch (app.updateColor()) {
                    case 0:
                        app.mainMenuHeader.set({
                            color: "#fff",
                        });
                        break;
                    case 1:
                        app.mainMenuHeader.set({
                            color: "red",
                        });
                        break;
                    case 2:
                        app.mainMenuHeader.set({
                            color: "blue",
                        });
                        break;
                }

            }
        }


        // if (app.screenState == 1) {
        if (!app.seesaw) {
            app.mainMenuHeader.rotation += 10 * dt;
            // app.mainMenuHeader.scaleY += 1 * dt;
            if (app.mainMenuHeader.rotation >= 25) {
                app.seesaw = 1;
            }
        }
        else if (app.seesaw) {
            app.mainMenuHeader.rotation -= 10 * dt;
            // app.mainMenuHeader.scaleY -= 1 * dt;
            if (app.mainMenuHeader.rotation <= -25) {
                app.seesaw = 0;
            }
        }
        // }

        //Game screen state
        if (app.screenState == 3) {
            // if ((Math.round(10 * app.timer) / 10 == 5) ) {

            // }

            app.airplane.fly(dt);
            app.timer += dt;
            app.scoreText.text = "Score: " + Math.round(app.timer);
            app.timerText.text = "Game Time: " + Math.round(10 * app.timer) / 10;
            if ((Math.round(10 * app.timer) / 10 % 5) == 0) {
                app.windNum = app.updateWind();
                // console.log("hut");

            }
            app.player.update(dt);
            app.player.wind(dt, app.windNum);
            // console.log(app.player.x, app.player.y);
            // if(app.player.x == app.circleCollider.getChildAt(1).regX || app.player.y == app.circleCollider.getChildAt(1).regY ){
            //     console.log("player collision");
            // }

            // if (Math.round(10 * app.timer) / 10 > 5) {
            //     app.stage.removeChild(1);
            //     app.screenState = 4;
            //     app.timer = 0;
            //     app.timerText = 0;
            //     app.grabScreen(app.screenState);
            //     app.setGameState(app.gameStatus.endgame);
            // }
        }

        app.stateTimer += dt;

        switch (app.gameStatus) {
            case 1:
                app.setGameState(app.gameStatus.pregame);
                break;
            case 2:
                app.setGameState(app.gameStatus.game);
                break;
            case 3:
                app.setGameState(app.gameStatus.endgame);
                break;
        }

        var mb = volumeButton.getChildAt(1);
        if (app.assetsLoaded) {
            mb.text = audio.musicPlaying ? "Mute" : "Un-Mute";
        }


    },
    updateWind() {
        return Math.round(Math.random());
    },
    updateColor() {
        return Math.floor(Math.random() * 3);
    },
    setState: function (newState) {
        app.state = newState;

        switch (app.state) {
            case app.gameStates.MOVE_RIGHT:
                app.stateText.text = "moving right";
                break;
            case app.gameStates.MOVE_LEFT:
                app.stateText.text = "moving left";
                break;
            default:
                console.log("RIP");
                break;
        }
    }, setGameState: function (newGameState) {

        switch (app.gameStatus) {
            case 1:
                app.stateText.text = "Pre game";
                break;
            case 2:
                app.stateText.text = "Game";
                break;
            case 3:
                app.stateText.text = "End Game";
                break;
            default:
                console.log("RIP");
                break;
        }
    }, handleKeyDown: function (evt) {
        if (evt) { var evt = window.event; }
        console.log("KC " + evt.keyCode);
        switch (evt.keyCode) {
            case app.KEYCODE_LEFT.code: app.KEYCODE_LEFT.isPressed = true;
            case app.KEYCODE_LEFT.alt: app.KEYCODE_LEFT.isPressed = true;
                break;
            case app.KEYCODE_RIGHT.code: app.KEYCODE_RIGHT.isPressed = true;
            case app.KEYCODE_RIGHT.alt: app.KEYCODE_RIGHT.isPressed = true;
                break;
            case app.KEYCODE_UP.code: app.KEYCODE_UP.isPressed = true;
            case app.KEYCODE_UP.alt: app.KEYCODE_UP.isPressed = true;
                break;
            case app.KEYCODE_DOWN.code: app.KEYCODE_DOWN.isPressed = true;
            case app.KEYCODE_DOWN.alt: app.KEYCODE_DOWN.isPressed = true;
                break;
            case app.KEYCODE_SPACE.code: app.KEYCODE_SPACE.isPressed = true; break;
            case app.KEYCODE_ENTER.code: app.KEYCODE_ENTER.isPressed = true; break;
            case app.KEYCODE_J.code: app.KEYCODE_J.isPressed = true; break;

        }

    }, handleKeyUp: function (evt) {
        if (evt) { var evt = window.event; }
        console.log("KC " + evt.keyCode);
        switch (evt.keyCode) {
            case app.KEYCODE_LEFT.code: app.KEYCODE_LEFT.isPressed = false;
            case app.KEYCODE_LEFT.alt: app.KEYCODE_LEFT.isPressed = false;
                break;
            case app.KEYCODE_RIGHT.code: app.KEYCODE_RIGHT.isPressed = false;
            case app.KEYCODE_RIGHT.alt: app.KEYCODE_RIGHT.isPressed = false;
                break;
            case app.KEYCODE_UP.code: app.KEYCODE_UP.isPressed = false;
            case app.KEYCODE_UP.alt: app.KEYCODE_UP.isPressed = false;
                break;
            case app.KEYCODE_DOWN.code: app.KEYCODE_DOWN.isPressed = false;
            case app.KEYCODE_DOWN.alt: app.KEYCODE_DOWN.isPressed = false;
                break;
            case app.KEYCODE_SPACE.code: app.KEYCODE_SPACE.isPressed = false;
                break;
            case app.KEYCODE_ENTER.code: app.KEYCODE_ENTER.isPressed = false;

                break;
            case app.KEYCODE_J.code: app.KEYCODE_J.isPressed = true;
                app.userValue = 40;
                app.windValue = 5;
                break;

        }
    }, makeCircle: function (posx, posy, radius, color) {
        var shape1 = new createjs.Shape();
        shape1.graphics.beginFill(color).drawCircle(posx, posy, radius);
        return shape1;
    }, makeRect: function (posx, posy, length, width, color, x, y) {
        var shape2 = new createjs.Shape();
        shape2.graphics.beginFill(color).drawRect(posx, posy, length, width, x, y);
        shape2.x = x;
        shape2.y = y;
        return shape2;
    }, initCanvas: function () {
        var canvas = document.getElementById("game");
        canvas.height = this.CANVAS_HEIGHT;
        canvas.width = this.CANVAS_WIDTH;
        this.stage = new createjs.Stage(canvas);
    }, createText: function (objectName, textContent, attrString, textColor, x = 0, y = 0) {
        objectName = new createjs.Text(textContent, attrString, textColor);
        objectName.x = x;
        objectName.y = x;
    }, createContainer: function (posx, posy, length, width, color, x, y) {
        var container = new createjs.Container();
        container.graphics.beginFill(color).drawRect(posx, posy, length, width, x, y);
        container.x = x;
        container.y = y;

        return container;
    }, makeButton: function (posx, posy, length, width, color, x, y) {
        var btnPlay = new createjs.Shape();
        btnPlay.graphics.beginFill(color).drawRect(posx, posy, length, width, x, y);
        btnPlay.x = x;
        btnPlay.y = y;
        // btnPlay.on("click", function (evt) { console.log("Clicked"); });
        // btnPlay.on("mouseover", function (evt) { console.log("Mouse Over"); });
        // btnPlay.on("mouseout", function (evt) { console.log("Mouse Out"); });
        // btnPlay.on("mousedown", function (evt) { console.log("Mouse Down"); });
        return btnPlay;
    }, grabScreen: function (id) {
        var returnScreen = null;
        switch (id) {
            case 1:
                returnScreen = this.titleScreen();
                break;
            case 2:
                returnScreen = this.instructionsScreen();
                break;
            case 3:
                returnScreen = this.gameScreen();
                app.gameStatus = 2;
                break;
            case 4:
                app.gameStatus = 3;
                returnScreen = this.endScreen();

                break;
        }


        this.stage.addChild(returnScreen);
        this.positionText = new createjs.Text();
        this.positionText.set({
            font: "20px Raleway",
            x: 10,
            y: 10
        });
        this.stage.addChild(this.positionText);

        volumeButton = this.createButton(130, 50, "#2AB0BF", "Mute", "#000", 0, 450);
        volumeButton.on("click", function (evt) {
            audio.musicPlaying = !audio.musicPlaying;
            audio.playClick();

            audio.toggleMute(audio.musicPlaying);
        });
        this.stage.addChild(volumeButton);

        this.stateText = new createjs.Text("NONE", "20px Raleway", "rgba(0, 0, 0, 1)");
        this.stateText.x = 840;
        this.stateText.y = 470;
        this.stage.addChild(this.stateText);

    }, createButton: function (length, width, color, buttonText, textColor, posX, posY) {
        var button1 = new createjs.Container();
        button1.x = posX;
        button1.y = posY;
        var bg1 = new createjs.Shape();
        bg1.graphics.beginFill(color).drawRect(0, 0, length, width);
        var text = new createjs.Text();
        text.text = buttonText;
        text.color = textColor;
        text.set({
            textAlign: "center",
            textBaseline: "middle",
            font: "20px Raleway",
            x: length / 2,
            y: width / 2
        });
        button1.addChild(bg1, text);
        return button1;
    },

    createHeaderText: function (parentObj, textContent, color) {
        var headerText = new createjs.Text(textContent, "40px Raleway", color);
        headerText.x = 400;
        headerText.y = 20;
    }, titleScreen: function () {
        var startScreen = new createjs.Container();
        var waveBg = new createjs.Bitmap(assets.getResult("under"));
        startScreen.addChild(waveBg);

        var bg = new createjs.Shape();
        bg.graphics.beginFill('#E9F2EA').drawRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // var header = this.createHeaderText(startScreen,"Welcome","#000");
        this.mainMenuHeader = new createjs.Text("Lucky's Balance", "70px Raleway", "#fff");
        this.mainMenuHeader.x = 500;
        this.mainMenuHeader.y = 170;
        this.mainMenuHeader.regX = 260;
        this.mainMenuHeader.regY = 50;


        var creditText = new createjs.Text("Developed By:\nHarrisen Sanchez", "20px Raleway", "#000");
        creditText.x = 10;
        creditText.y = 10;

        var instructionsButton = this.createButton(130, 50, "#000", "Instructions", "#fff", 550, 350);
        instructionsButton.on("click", function (evt) {
            this.stage.removeChild(1);
            app.screenState = 2;
            audio.playClick();

            app.grabScreen(app.screenState);
        });

        var playButton = this.createButton(130, 50, "#000", "Play", "#fff", 350, 350);
        playButton.on("click", function (evt) {
            this.stage.removeChild(1);
            app.screenState = 3;
            audio.playClick();
            app.grabScreen(app.screenState);
        });


        // startScreen.addChild(bg);
        startScreen.addChild(instructionsButton);
        startScreen.addChild(playButton);
        startScreen.addChild(this.mainMenuHeader);
        startScreen.addChild(creditText);
        returnScreen = startScreen;

        return returnScreen;
    }, instructionsScreen: function () {
        var instructionScreen = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#E9F2EA').drawRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        var headerText = new createjs.Text("Instructions", "40px Raleway", "#000");
        headerText.x = 400;
        headerText.y = 20;
        var backToMenuButton = this.createButton(130, 50, "#000", "Title", "#fff", 450, 450);
        backToMenuButton.on("click", function (evt) {
            // console.log("Clicked");
            audio.playClick();
            this.stage.removeChild(1);
            app.screenState = 1;
            app.grabScreen(app.screenState);
        });

        var instructions = new createjs.Text("1. Help Lucky the Dolphin balance his ball.\n2. Watch out for wind resistance which will get stronger as time goes.\n3. Score points based on time spent balancing.\n" +
            "Controls: Left/Right or A/D to balance.\n", "40px Raleway", "#000");
        instructions.set({
            textAlign: "center",
            textBaseline: "middle",
            font: "30px Raleway",
            x: this.CANVAS_WIDTH / 2,
            y: this.CANVAS_HEIGHT / 2 - 50
        });

        var waveBg = new createjs.Bitmap(assets.getResult("under"));

        instructionScreen.addChild(bg);
        instructionScreen.addChild(waveBg);
        instructionScreen.addChild(headerText);
        instructionScreen.addChild(instructions);
        instructionScreen.addChild(backToMenuButton);
        returnScreen = instructionScreen;
        return returnScreen;
    }, gameScreen: function () {
        var gameScreen = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#051940').drawRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        var headerText = new createjs.Text("Balance!", "40px Raleway", "#051940");
        headerText.x = 400;
        headerText.y = 20;

        this.scoreText = new createjs.Text("Score: ", "30px Raleway", "#051940");
        this.scoreText.x = 100;
        this.scoreText.y = 20;

        this.timerText = new createjs.Text("Time", "30px Raleway", "#051940");
        this.timerText.x = 750;
        this.timerText.y = 20;


        this.dangerText = new createjs.Text("Danger", "60px Raleway", "red");
        this.dangerText.x = 720;
        this.dangerText.y = 300;

        // var bitmap = new createjs.Bitmap(image);
        // stage.addChild(bitmap);
        var waveBg = new createjs.Bitmap(assets.getResult("waves"));
        waveBg.y = 0;


        // gameScreen.addChild(bg);
        gameScreen.addChildAt(waveBg, 0);
        gameScreen.addChild(headerText);
        gameScreen.addChild(this.timerText);
        gameScreen.addChild(this.scoreText);

        this.windDirection = new createjs.Text();
        this.windDirection.set({
            text: "Wind Blowing",
            textAlign: "center",
            color: "#051940",
            textBaseline: "middle",
            font: "40px Raleway",
            x: 200,
            y: 300
        });
        gameScreen.addChild(this.windDirection);


        // this.enemies.push(new SpriteActor(gameScreen, 150, 150));
        // this.enemies.push(new BitmapActor(gameScreen, 450, 450));
        // for(var i = 0; i < app.enemies.length; i++)
        // {
        //     app.enemies[i].update(app.deltaTime);
        // } 

        this.airplane = new SpriteActor(gameScreen, 0, 100, "airplane", "fly");
        audio.playAirplane();
        // this.airplane.x += 20;
        // this.airplane = new createjs.Shape();
        // this.airplane.graphics.beginFill('green').drawRect(0, 0, 100, 100).arc(0, 0, 90, 0, Math.PI / 2);
        // gameScreen.addChild(this.airplane);

        this.enemy = new SpriteActor(gameScreen, this.CANVAS_WIDTH / 2 - 95, this.CANVAS_HEIGHT / 2, "dolphin", "idle");

        // var pole = new createjs.Shape();
        // pole.graphics.beginFill('red').drawRect(this.CANVAS_WIDTH / 2 + 19, this.CANVAS_HEIGHT / 2, 10, 250);
        // console.log(pole);

        // gameScreen.addChild(pole);
        // this.player = new CollisionActor(gameScreen, this.CANVAS_WIDTH / 2 + 24, this.CANVAS_HEIGHT / 2);
        this.player = new CollisionActor(gameScreen, this.CANVAS_WIDTH / 2 + 24, this.CANVAS_HEIGHT / 2 + 30, "beachball", "idle");

        // this.player = new ClickableActor(gameScreen, pole.x/2, pole.y/2);
        // this.player.rotation += 3;

        // app.enemies[1].update(app.deltaTime);

        app.player.update(app.deltaTime);
        audio.playWind();
        returnScreen = gameScreen;
        return returnScreen;
    }, endScreen: function () {
        var gameScreen = new createjs.Container();
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#020E26').drawRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        var headerText = new createjs.Text("Game Over", "100px Raleway", "#fff");
        headerText.x = 230;
        headerText.y = 20;

        //move score text to center

        this.scoreText.set({
            textAlign: "center",
            textBaseline: "middle",
            color: "#fff",
            font: "60px Raleway",
            x: this.CANVAS_WIDTH / 2,
            y: this.CANVAS_HEIGHT / 2
        });


        var menuButton = this.createButton(130, 50, "#E8F2E9", "Main Menu", "#000", 450, 450);
        menuButton.on("click", function (evt) {
            this.stage.removeChild(1);
            app.screenState = 1;
            audio.playClick();
            // audio.playSound("music");
            // audio.musicPlaying = true;
            app.gameStatus = 1;
            app.grabScreen(app.screenState);
        });


        app.windNum = 0;
        app.windValue = 5;
        app.userValue = 40;
        app.timer = 0;

        gameScreen.addChild(bg);
        this.luckyDistance.x = 0;
        this.luckyDistance.y = 0;
        for (var i = 0; i < 80; i++) {

            if (this.luckyDistance.x < this.CANVAS_WIDTH) {
                var lucky = new CollisionActor(gameScreen, this.luckyDistance.x, this.luckyDistance.y, "dance", "dance");
                lucky.setRotation(0);
                this.luckyDistance.x += 80;
            } else if (this.luckyDistance.x >= this.CANVAS_WIDTH) {
                this.luckyDistance.y += 100;
                // var lucky = new CollisionActor(gameScreen, this.luckyDistance.x, this.luckyDistance.y, "dance", "dance");
                // lucky.setRotation(45);
                this.luckyDistance.x = 0;
            }

            // this.enemies.push
        }



        gameScreen.addChild(headerText);
        gameScreen.addChild(this.scoreText);
        gameScreen.addChild(menuButton);
        returnScreen = gameScreen;
        return returnScreen;
    }


}

app.init();