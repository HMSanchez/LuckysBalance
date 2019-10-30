class Actor {
    constructor(parentObj, x, y) {
        this.parentObj = parentObj;

        this.image = new createjs.Shape();
        // this.image.graphics.beginFill("green").drawPolyStar(0, 0, 50, 50, 0.6, -90);
        this.image.graphics.beginFill('green').drawRect(0, 0, 100, 100).arc(0, 0, 90, 0, Math.PI / 2);

        this.image.x = x;
        this.image.y = y;
        // this.image.rotation += 225;
        parentObj.addChild(this.image);

        // parentObj.getChildIndex(this.image);
        // parentObj.setChild(this.image)
        //parentObj.swapChildren
        //parentObj.swapChildrenAt
    }

    update(dt) {
        // console.log("actor update");
        if (app.KEYCODE_LEFT.isPressed) {
            this.image.x -= 100 * dt;
        } else if (app.KEYCODE_RIGHT.isPressed) {
            this.image.x += 100 * dt;
        } else if (app.KEYCODE_UP.isPressed) {
            this.image.y -= 100 * dt;
        } else if (app.KEYCODE_DOWN.isPressed) {
            this.image.y += 100 * dt;
        } else if (app.KEYCODE_SPACE.isPressed) {
            console.log("space");
            // this.image.kill();
            // this.image.style = "black";
            // this.image.x += 10 ;
            // this.image.graphics.clear().beginFill(Math.floor(Math.random()*16777215).toString(16));
        }
    }

    fly(dt) {
        if (!app.firstPass) {
            this.image.x += 1;
        }
        if (this.image.x > app.CANVAS_WIDTH + 5) {
            app.firstPass = true;
            app.flyDirection = !app.flyDirection;
        } else if (this.image.x < -5) {
            app.flyDirection = !app.flyDirection;
        }

        if (app.flyDirection && app.firstPass) {
            this.image.rotation = 180;
            this.image.x -= 1;
        } else if (!app.flyDirection && app.firstPass) {
            this.image.x += 1;
            this.image.rotation = 0;
        }


    }

    kill() {
        this.parentObj.removeChild(this.image);
    }
}

//clcikable
class ClickableActor extends Actor {
    constructor(parentObj, x, y) {
        super(parentObj, x, y);

        this.image.on("mouseover", function (evt) {
            console.log("over");
        });
        this.image.on("mouseout", function (evt) {
            console.log("out");

        });
        this.image.on("mousedown", function (evt) {
            console.log("down");

        });
        this.image.on("click", function (evt) {
            console.log("clique");
            app.enemy.kill();
            app.enemy = new ClickableActor(app.stage, Math.random() * app.CANVAS_WIDTH, Math.random() * app.CANVAS_HEIGHT);
        });
    }
}

// actor that uses bitmap
class BitmapActor extends Actor {
    constructor(parentObj, x, y) {
        super(parentObj, x, y);

        parentObj.removeChild(this.image);
        this.image = new createjs.Bitmap(assets.getResult("star"));
        parentObj.addChild(this.image);
    }
}

class SpriteActor extends Actor {
    constructor(parentObj, x, y, id, animation) {
        super(parentObj, x, y);

        parentObj.removeChild(this.image);
        this.image = new createjs.Sprite(assets.getResult(id));
        this.image.x = x;
        this.image.y = y;
        parentObj.addChild(this.image);

        this.image.gotoAndPlay(animation);
        //go to and stop    
    }

    stopAnimation(animation){
        this.image.gotoAndStop(animation);
    }

}
