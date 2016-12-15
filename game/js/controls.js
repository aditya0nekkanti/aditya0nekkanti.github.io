var controls = function(game) {};

var background;
var play;

controls.prototype = {
    
    preload: function() {
        
        this.game.load.image('background', 'assets/img/controlsBG.png');
        this.game.load.image('play', 'assets/img/play.png');
        
    },
    
    create: function() {
        
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        //this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;
            
        //  Background
        background = game.add.tileSprite(0, 0, 1000, 615, 'background');
        
        play = game.add.button(360, 400, 'play', this.playOnClick, this);
    },
    
    playOnClick: function() {

        game.state.start("main");

    }
    
    
};