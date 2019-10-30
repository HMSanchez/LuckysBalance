class CollisionActor {
    constructor(parentObj, x, y, id) {
        this.parentObj = parentObj;

        // this.image = new createjs.Shape();
        // this.image.graphics.beginFill('green').drawRect(0, 0, 100, 100).arc(0, 0, 90, 0, Math.PI / 2);

        // this.image.x = x;
        // this.image.y = y;
        // this.image.rotation += 225;

        // parentObj.addChild(this.image);
        parentObj.removeChild(this.image);
        this.image = new createjs.Sprite(assets.getResult(id));
        this.image.x = x;
        this.image.y = y;
        this.image.rotation = 225;
        parentObj.addChild(this.image);

        this.image.gotoAndPlay("roll");
    }

    update(dt) {
        app.airplane.x += 10;
        // console.log("actor update");
        if (app.KEYCODE_LEFT.isPressed) {
            if (!app.fallenOff) {
                this.image.rotation -= app.userValue * (dt);
            }
        } else if (app.KEYCODE_RIGHT.isPressed) {
            if (!app.fallenOff) {
                this.image.rotation += app.userValue * (dt);
            }
        } else if (app.KEYCODE_UP.isPressed) {
            // this.image.y -= 100 * dt;
        } else if (app.KEYCODE_DOWN.isPressed) {
            // this.image.y += 100 * dt;
        } else if (app.KEYCODE_SPACE.isPressed) {
            console.log("space");
            // this.image.kill();
            // this.image.style = "black";
            // this.image.x += 10 ;
            // this.image.graphics.clear().beginFill(Math.floor(Math.random()*16777215).toString(16));
        }

    }

    wind(dt, windDirection) {

        // console.log(this.image.rotation);
        if (this.image.rotation >= 245  && !app.fallenOff) {
            this.parentObj.addChild(app.dangerText);
        } 
        else if(this.image.rotation <= 205  && !app.fallenOff){
            this.parentObj.addChild(app.dangerText);
        // console.log(this.image.rotation);
        }
        else {
            this.parentObj.removeChild(app.dangerText);
        }

        if (this.image.rotation < 260 && this.image.rotation > 190 && !app.fallenOff) {
            if (windDirection == 0) {
                this.image.rotation -= app.windValue * (dt);

            } else if (windDirection == 1) {
                this.image.rotation += app.windValue * (dt);
            }
            if (!app.KEYCODE_J.isPressed && (Math.round(10 * app.timer) / 10 > 1) && (Math.round(10 * app.timer) / 10 % 5 == 0) && app.windValue < 60) {
                app.windValue += .5;
                app.userValue += .3;
                console.log(app.windValue);
            }
            app.windDirection.text = windDirection ? "Wind Direction:\n \u21D2" : "Wind Direction:\n \u21D0";
        } else {
            console.log("dead");
            app.fallenOff = true;
            app.enemy.stopAnimation("idle");
            this.move(dt, windDirection);
        }

        if(app.fallenOff && !app.soundStart){
            audio.playLucky();
            app.soundStart=true;
        }
        // console.log(this.image.rotation);

    }

    move(dt, windDirection) {
        if (app.KEYCODE_LEFT.isPressed && windDirection == 1) {
            windDirection = !windDirection;
        } else if (app.KEYCODE_RIGHT.isPressed && windDirection == 0) {
            windDirection = !windDirection;
        }
        if (windDirection == 0) {
            this.image.rotation -= 125 * (dt);
            if (this.image.y < 550) {
                this.image.y += 6 + dt;
                if (app.KEYCODE_LEFT.isPressed) {
                    console.log();
                    this.image.x -= 4 * dt;
                } else if (app.KEYCODE_RIGHT.isPressed) {
                    this.image.x += 4 * dt;
                }
            } else {
                // audio.stopWind();
                this.kill();
            }
        } else if (windDirection == 1) {

            this.image.rotation += 125 * (dt);
            if (this.image.y < 550) {
                this.image.y += 6 + dt;
                if (app.KEYCODE_LEFT.isPressed) {
                    this.image.x -= 4 * dt;
                } else if (app.KEYCODE_RIGHT.isPressed) {
                    this.image.x += 4 * dt;
                }
            } else {
                // audio.stopWind();
                this.kill();
            }

        }
        var time = Math.floor(app.timer);
        app.timer = time;

        app.endGameTimer += dt;

        // console.log((Math.round(10 * app.endGameTimer) / 10 ));
        if (app.endGameTimer > 5 && this.image.y > 550) {
            this.image.rotation = 225;
            app.stage.removeChild(1);
            app.screenState = 4;
            app.timer = 0;
            app.endGameTimer = 0;
            app.fallenOff = false;
            app.timerText = 0;
            // console.log(audio.musicPlaying);
            // audio.musicPlaying = audio.musicPlaying ? !audio.musicPlaying : audio.musicPlaying;
            audio.stopWind();
            audio.stopLucky();
            audio.stopAirplane();
            app.grabScreen(app.screenState);
            app.setGameState(app.gameStatus.endgame);
        }

        // this.showEndScreenButton();
        // app.timerText.text = "Game Time: " + Math.round(10 * app.timer) / 10;
        // app.scoreText = Math.floor(app.timer);
    }

    getActor() {
        return this.image;
    }

    kill() {
        this.parentObj.removeChild(this.image);
    }

    showEndScreenButton() {
        var toEndScreen = app.createButton(230, 150, "#fff", "View Results", "#000", 650, 250);
        toEndScreen.on("click", function (evt) {
            console.log("Clicked");
            app.stage.removeChild(1);
            app.screenState = 4;
            app.grabScreen(app.screenState);
        });

        // console.log(this.parentObj);
        this.parentObj.addChild(toEndScreen);
    }

    setRotation(num){
        this.image.rotation = num;
    }
}