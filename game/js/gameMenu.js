var gameMenu = function(game) {};

var background;
var logo;
var play;

gameMenu.prototype = {

    preload: function() {
        
        this.game.load.image('background', 'assets/img/background.png');
        this.game.load.image('logo', 'assets/img/logo.png');
        this.game.load.image('play', 'assets/img/play.png');
        this.game.load.image('controls', 'assets/img/controls.png');
        
    },

    create: function() {
        
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        //this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;
            
        //  Background
        background = game.add.tileSprite(0, 0, 1000, 615, 'background');
        
        //  Logo
        logo = game.add.tileSprite(0, 0, 600, 450, 'logo');
        //logo.x = game.world.centerX;
        logo.y = -100;
        logo.x = 210;
        
        play = game.add.button(360, 200, 'play', this.playOnClick, this);
        controls = game.add.button(360, 330, 'controls', this.controlsOnClick, this);
    
  },
    
    playOnClick: function() {

        game.state.start("main");

    },
    
    controlsOnClick: function() {

        game.state.start("controls");

    }
};