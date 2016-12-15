var mainGame = function(game){
    
        
};
 

var player;
        var background;
        var enemies;
        var explosions;
        var cursors;
        var bullets;
        var healthText;
        var fireButton; 
        var bankEffect;
        var bulletTimer = 0;
        var enemyTimer;
        var gameOver;
        var score = 0;
        var scoreText;
        
        var ACCELERATION = 600;
        var DRAG = 400;
        var MAXSPEED = 400;

    mainGame.prototype = {
    
        
        
        preload: function() {
            this.game.load.image('background', 'assets/img/background.png');
            this.game.load.image('baby', 'assets/img/player.png');
            this.game.load.image('bullet', 'assets/img/bullet.png');
            this.game.load.image('enemy', 'assets/img/enemy.png');
            this.game.load.spritesheet('explosion', 'assets/img/explode.png', 128, 128);
            this.game.load.bitmapFont('statFont', 'assets/fonts/statFont.png', 'assets/fonts/statFont.xml');
            this.game.load.bitmapFont('replayFont', 'assets/fonts/reFont.png', 'assets/fonts/reFont.xml');
        },

        create: function() {
            
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            //this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;
            
            //  Scrolling Hills
            background = game.add.tileSprite(0, 0, 1000, 615, 'background');
            
            // Bullets
            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(30, 'bullet');
            bullets.setAll('anchor.x', 0.5);
            bullets.setAll('anchor.y', 1);
            bullets.setAll('outOfBoundsKill', true);
            bullets.setAll('checkWorldBounds', true);

            //  The Player
            player = game.add.sprite(200, 300, 'baby');
            player.health = 100;
            player.anchor.setTo(0.5, 0.5);
            player.scale.setTo(1, 1);
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.setSize(40, 50, 0, -15);
            player.body.maxVelocity.setTo(MAXSPEED,MAXSPEED);
            player.body.drag.setTo(DRAG,DRAG);
            
            
            //  The Enemies
            enemies = game.add.group();
            enemies.enableBody = true;
            enemies.physicsBodyType = Phaser.Physics.ARCADE;
            enemies.createMultiple(8, 'enemy');
            enemies.setAll('anchor.x', 0.5);
            enemies.setAll('anchor.y', 0.5);
            enemies.setAll('scale.x', 0.8);
            enemies.setAll('scale.y', 1);
            enemies.setAll('outOfBoundsKill', true);
            enemies.setAll('checkWorldBounds', true);  
            enemies.forEach(function(enemies) {
                enemies.body.setSize(enemies.width * 0.75, enemies.height * 0.75);
                enemies.damageAmount = 25;
            });
            
            game.time.events.add(1000, this.launchEnemy, this);
            
            
            //  Explosions
            explosions = game.add.group();
            explosions.enableBody = true;
            explosions.physicsBodyType = Phaser.Physics.ARCADE;
            explosions.createMultiple(30, 'explosion');
            explosions.setAll('anchor.x', 0.5);
            explosions.setAll('anchor.y', 0.5);
            explosions.setAll('scale.x', 1.5);
            explosions.setAll('scale.y', 1.5);
            explosions.forEach( function(explosion) {
                explosion.animations.add('explosion');
            });
            
            //  Keyboard Controls
            cursors = game.input.keyboard.createCursorKeys();
            
            //  Fire Controls
            fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            
             //  Health Text
            healthText = game.add.bitmapText(game.world.width - 350, 10, 'statFont', 'Health:' + player.health +'%', 35);
            healthText.render = function () {
                healthText.text = 'Health: ' + Math.max(player.health, 0) +'%';
            };
            healthText.render();
            
            //  Score
            scoreText = game.add.bitmapText(10, 10, 'statFont', 'Score:', 35);
            scoreText.render = function () {
                scoreText.text = 'Score: ' + score;
            };
            scoreText.render();
            
            //  Game Over Test
            gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'replayFont', 'GAME OVER!\nPlay Again?', 80);
            gameOver.x = gameOver.x - gameOver.textWidth / 2;
            gameOver.y = gameOver.y - gameOver.textHeight / 3;
            gameOver.visible = false;
            
        },

        update: function() {
            
            background.tilePosition.x -= 2;
            
            //  Limit Range of Motion to window
            if (player.y > (game.height - 50))
                {
                    player.y = (game.height - 50);
                    player.body.acceleration.y = 0;
                }
            
            if (player.y < 50)
                {
                    player.y = 50;
                    player.body.acceleration.y = 0;
                }
            
            //  Fire bullet
            if (player.alive && (fireButton.isDown || game.input.activePointer.isDown))
                {
                    this.fireBullet();
                }
            
            
            // Reset player, and check for movement input
            player.body.acceleration.y = 0;
            
            // Add Mouse Control
            if (game.input.y < (game.height - 20 ) &&
                game.input.y > 20                  &&
                game.input.x < (game.width - 20)   &&
                game.input.x > 20)                  
                {
                    var minDist = 200;
                    var dist = game.input.y - player.y;
                    player.body.velocity.y = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);;
                }
            
            if (cursors.down.isDown)
                {
                    player.body.acceleration.y = ACCELERATION;
                }
            
            else if (cursors.up.isDown)
                {
                    player.body.acceleration.y = -ACCELERATION;
                }
            
            bankEffect = player.body.velocity.y / MAXSPEED;
            player.angle = bankEffect * 5;
            
            //  Check for Collsion
            game.physics.arcade.overlap(player, enemies, this.babyCollide, null, this);
            game.physics.arcade.overlap(enemies, bullets, this.hitEnemy, null, this);
            
            //  Game Over Check
            if (!player.alive && gameOver.visible === false) {
                
                gameOver.visible = true;
                gameOver.alpha = 0;
                var fadeInGameOver = game.add.tween(gameOver);
                fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
                fadeInGameOver.onComplete.add(setResetHandlers);
                fadeInGameOver.start();
                
                
                
                function setResetHandlers() {
                    
                    //  The "click to restart" handler
                    tapRestart = game.input.onTap.addOnce(_restart,this);
                    spaceRestart = fireButton.onDown.addOnce(_restart,this);
                    
                    function _restart() {
                        game.state.restart();
                        tapRestart.detach();
                        spaceRestart.detach();
                        
                    }
                }
            }

        },

        render: function() {
            

        },
        
        launchEnemy: function() {
                var MIN_ENEMY_SPACING = 300;
                var MAX_ENEMY_SPACING = 600;
                var ENEMY_SPEED = -300;

                var enemy = enemies.getFirstExists(false);
                if (enemy) {
                    enemy.reset(game.width + 20 ,game.rnd.integerInRange(0,game.height));
                    enemy.body.velocity.y = game.rnd.integerInRange(-300, 300);
                    enemy.body.velocity.x = ENEMY_SPEED;
                    enemy.body.drag.y = 100;
                }
                
                enemy.update = function(){
                    enemy.angle = 270 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
                    if ((enemy.y < 0) || (enemy.x < 0)) {
                        enemy.kill();
                    }
                }
                
                //  Enemy Timing
                enemyTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), this.launchEnemy, this);
            },
        
        fireBullet: function()  {
                
                if (game.time.now > bulletTimer) 
                    { 
                        var BULLET_SPEED = 400;
                        var BULLET_SPACING = 600;
                        var bullet = bullets.getFirstExists(false); 
                        
                        if (bullet)
                            {
                                var bulletOffset = Math.sin(game.math.degToRad(player.angle));
                                bullet.reset(player.x + 30, player.y + bulletOffset - 20);
                                bullet.angle = player.angle;
                                game.physics.arcade.velocityFromAngle(bullet.angle, BULLET_SPEED, bullet.body.velocity);
                                bullet.body.velocity.y += player.body.velocity.y;
                                
                                bulletTimer = game.time.now + BULLET_SPACING;
                            
                            }
                    }
            },
        
        babyCollide: function(player, enemy) {
                var explosion = explosions.getFirstExists(false);
                explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
                explosion.body.velocity.x = enemy.body.velocity.x;
                explosion.alpha = 0.7;
                explosion.play('explosion', 30, false, true);
                enemy.kill();
                player.damage(enemy.damageAmount);
                healthText.render();
        },
        
        hitEnemy: function(enemy, bullet) {
                var explosion = explosions.getFirstExists(false);
                explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
                explosion.body.velocity.y = enemy.body.velocity.y;
                explosion.alpha = 0.7;
                explosion.play('explosion', 30, false, true);
                enemy.kill();
                bullet.kill()
                
                score += enemy.damageAmount * 4;
                scoreText.render()
        },
        
}