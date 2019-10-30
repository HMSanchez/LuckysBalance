
var audio = {
    sfxCanPlay: true,
    music: false,
    musicPlaying: true,
    mainMusic: null,
    clickEffect: null,
    windEffect: null,
    airplaneEffect: null,
    luckyEffect: null,

    playSound: function (id) {
        if (this.musicPlaying) {
            this.mainMusic = createjs.Sound.play(id, { loop: -1 });
            this.mainMusic.volume = 0.2;
        }
    },

    toggleMute: function (isMuted) {
        this.mainMusic.muted = !isMuted;
    },

    playClick: function () {
        this.clickEffect = createjs.Sound.play("click");
    },

    playWind: function () {
        this.windEffect = createjs.Sound.play("wind", { loop: -1 });
        this.windEffect.volume = 0.6;
    },
    stopWind: function () {
        this.windEffect.muted = !this.windEffect.muted;
    },
    playAirplane: function () {
        this.airplaneEffect = createjs.Sound.play("airplane-fly", { loop: -1 });
        this.airplaneEffect.volume = 0.5;
    },
    stopAirplane: function () {
        this.airplaneEffect.muted = !this.airplaneEffect.muted;
    },
    playLucky: function () {
        this.luckyEffect = createjs.Sound.play("dolphin-click");
        this.luckyEffect.volume = 0.5;
    },
    stopLucky: function () {
        this.luckyEffect.muted = !this.luckyEffect.muted;
    },
}

