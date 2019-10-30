//load assets and info about assets

var assets = {

    //store results of wahts loaded
    queue: null,
    loadText: null,
    preloadAssets: function () {
        //manifest: list of assets that will be loaded from parse
        manifest = [
            {
                src: "media/audio/music.mp3",
                id: "music"
            },
            {
                src: "media/audio/click.mp3",
                id: "click"
            },
            {
                src: "media/audio/dolphin-click.mp3",
                id: "dolphin-click"
            },
            {
                src: "media/audio/airplane.mp3",
                id: "airplane-fly"
            },
            {
                src: "media/audio/wind.mp3",
                id: "wind"
            },
            {
                src: "gameObjects/actor.js",
            },
            {
                src: "gameObjects/collisionactor.js",
            },
             {
                src: "media/images/under.jpg",
                id: "under"
            }
            ,{
                src: "audio.js",
            }, {
                src: "media/images/ocean.png",
                id: "waves"
            }
            , {
                src: "media/images/particle.png",
                id: "star"
            }, {
                src: "media/images/pigsheet.json",
                id: "pig",
                type: "spritesheet",
                crossOrigin: true
            }, {
                src: "media/images/dolp.json",
                id: "dolphin",
                type: "spritesheet",
                crossOrigin: true
            }, {
                src: "media/images/ballSheet/beachball.json",
                id: "beachball",
                type: "spritesheet",
                crossOrigin: true
            }, {
                src: "media/images/airplane/airplane.json",
                id: "airplane",
                type: "spritesheet",
                crossOrigin: true
            }, {
                src: "media/images/luckydance/dance.json",
                id: "dance",
                type: "spritesheet",
                crossOrigin: true
            },
        ];

        this.queue = new createjs.LoadQueue(true);



        //audio install createjs plugin
        this.queue.installPlugin(createjs.Sound);

        //set up sounds
        createjs.Sound.alternateExtensions = ["mp3"];

        this.queue.on("progress", this.loadProgress, this);
        this.queue.on("complete", this.loadComplete, this);
        this.queue.loadManifest(manifest);
    },
    loadComplete: function (evt) {
        console.log("done loading");
        var waveBg = new createjs.Bitmap(assets.getResult("under")); 
        app.stage.addChildAt(waveBg,0);
        app.resetGame();
        audio.playSound("music");
        app.assetsLoaded = true;

    },
    loadProgress: function (evt) {
        // console.log("now loading " + (evt.loaded / evt.total) + "%");
        bar = new createjs.Shape();
        // bar.graphics.beginFill("#000").drawRect(100, 420, 420, 10).endFill();
        bar.graphics.beginFill("#000").drawRect(100, 470, 420, 10).endFill();
        bar.x = 260;
        // bar.y= 175;
        bar.scaleX = evt.loaded * .9;

        console.log(evt.loaded);
        app.stage.addChild(bar);


    },
    // get load result
    getResult: function (id) {
        var result = this.queue.getResult(id);
        // console.log(result);
        return result;
    }

}