class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() { //remember last things added in create are made first!!!!
        //play background music
        this.music = this.sound.add('music', { loop: true });
        this.music.play();

        // add top background border
        this.toplayer = this.add.sprite(0, 0, 'toplayer').setOrigin(0, 0);
        this.toplayer.tint = 0x4972DC;

        //add background
        this.background = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'background').setOrigin(0, 0);
        this.background.tint = 0x6CC3FD;

        //define keys
        //restart key
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //start key
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        //movement keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //display score
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            wordWrap: { width: game.config.width, useAdvancedWrap: true }
        }

        //add score data structure
        this.score = {
            points: 0,
            time: 0,
            distance: 0
        };

        //add text boxes to display values on screen
        this.pointsText = this.add.text(50, 25, this.score.points, this.scoreConfig);

        //create player's character
        this.breadbear = new Breadbear(this, game.config.width / 2, game.config.height - playerHeightOffset,
            'breadbear');
        this.breadbear.setDepth(100);
        this.breadbear.setImmovable(true);
        this.breadbear.body.setAllowGravity(false);
        this.time.addEvent({ //after a few seconds, the player will start to fall
            delay: 1000,
            callback: () => {
                this.breadbear.body.setAllowGravity(true);
                this.breadbear.setGravityY(5); //give breadbear less gravity so he doesn't fall too quickly
            },
            callbackScope: this,
            loop: false
        });

        //create a physics body with no texture (used to have birds fall back to position after swooping)
        this.phantomBox = this.physics.add.sprite(game.config.width / 2,
            game.config.height + 25).setOrigin(0, 0); //creates at said position
        this.phantomBox.body.setSize(game.config.width + 100, 20); //makes it a rectangle of said dimensions
        this.phantomBox.setImmovable(true); //collision doesn't move this object
        this.phantomBox.body.setAllowGravity(false); //gravity should not affect this object

        //implement spreads as a group
        this.spreadGroup = this.add.group({
            runChildUpdate: true,    // make sure update runs on group children
        });

        //timed loop to create new spreads
        this.spreadSpawnTimer = this.time.addEvent({
            delay: 2500,
            startAt: 1000, //starts spawning objects 1 second after starting the game
            callback: () => {
                //create spreads
                //TODO: more spreads than just butter (implement slow down for other spreads)
                let spread = new Spread(this, 0, -32, 'butter', true); //bool arg: true = speed up, false = slow down
                spread.create(); //have spread be initialized (positioned on random lane and given downward movement)
                this.spreadGroup.add(spread);
            },
            callbackScope: this,
            loop: true
        });

        this.createAnimations(); //function that handles all anims.create for every atlas

        //implement birds as a group
        this.birdGroup = this.add.group({
            runChildUpdate: true,   // make sure update runs on group children
        });
        for (let i = 0; i != 10; i++) {
            let bird = new Bird(this, 16 + (i * 50), game.config.height + 16, 'bird');
            switch (game.difficulty) {
                case 1:
                    bird.setGravityY(50);
                    break;
                case 2:
                    bird.setGravityY(100);
                    break;
                case 3:
                    bird.setGravityY(300);
                    break;
                default:
                    break;
            }
            bird.anims.play('birdflap');
            this.birdGroup.add(bird);
        }

        //timed loop to have the birds swoop up at bread bear
        this.birdSwoopTimer = this.time.addEvent({
            delay: 4000,
            callback: () => {
                this.sound.play('sfx_caw');
                this.birdSwoop();
            },
            callbackScope: this,
            loop: true
        });

        //implement clouds as a group
        this.cloudGroup = this.add.group({
            runChildUpdate: true,   // make sure update runs on group children
        });
        for (let i = 0; i != 2; i++) {
            this.cloudGroup.add(new Cloud(this, 30 + (220 * i), 200 + (100 * i), 'cloud' + (i+1), 0).setOrigin(0.5));
        }
        this.changeCloudtoStar = true; //bool used to make the transition of cloud to star happen only once.

        //update time counter in score
        this.updateScoreTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score.time++;
            },
            callbackScope: this,
            loop: true
        });

        //update distance counter in score
        this.updateDistanceTimer = this.time.addEvent({
            delay: 100,
            callback: () => {
                this.score.distance++;
            },
            callbackScope: this,
            loop: true
        });

        //GAME OVER flag
        this.gameOver = false;
        this.gameOverDisplayed = false;
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.music.stop();
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.music.stop();
            this.scene.start("menuScene");
        }

        this.updateBackground();
        //put this outside the if (!this.gameOver) block because it should update reguardless
        //check collisions with the birds and phantomBox
        this.physics.world.collide(this.birdGroup, this.phantomBox);

        //update while game is going
        if (!this.gameOver) {
            //update bread bear
            this.breadbear.update();

            //if bread bear is being boosted, add distance and
            //have clouds falling speed be affected by breadbear's speed
            if (this.breadbear.body.velocity.y < 0) {
                this.score.distance++;
                let cloudArray = this.cloudGroup.getChildren();
                for (let cloud of cloudArray) {
                    if(!cloud.stars) //if it's textured as a cloud
                        cloud.ySpeed += 0.02;
                    else             //if it's textured to be a star
                        cloud.ySpeed += 0.01;
                }
            }
            else {
                let cloudArray = this.cloudGroup.getChildren();
                for (let cloud of cloudArray) {
                    if(!cloud.stars) //if it's textured as a cloud
                        cloud.ySpeed -= 0.01;
                    else             //if it's textured to be a star
                        cloud.ySpeed -= 0.005;
                }
            }

            //if bread bear has fallen off screen, game over
            if (this.breadbear.y > game.config.height + this.breadbear.height)
                this.stopGame();

            //check collisions with breadbear and spreads
            this.physics.world.collide(this.spreadGroup, this.breadbear, (spread) => {
                this.spreadGroup.remove(spread);
                spread.destroy();
                this.breadbear.speedUp();
                this.sound.play('sfx_smear');
                //add points to the game
                this.score.points += 100 + Math.floor(this.score.distance / 10);
                this.pointsText.text = this.score.points;
                //play the spread animation animation
                this.breadbear.setTexture('spread butter');
                this.breadbear.anims.play('smear butter');
                this.breadbear.on('animationcomplete', () => {    // callback after anim completes
                    this.breadbear.setTexture('breadbear'); //reset the texture
                });
            }, null, this);
            //check collisions with breadbear and birds
            this.physics.world.collide(this.birdGroup, this.breadbear, (bird) => {
                bird.setAccelerationY(0);
                bird.setVelocityY(0);
                this.stopGame();
            }, null, this);
        }
        else {
            if (!this.gameOverDisplayed) { //put in this if statement so update doesn't keep calling gameOverText();
                this.gameOverText();
                this.gameOverDisplayed = true;
            }
        }
    }

    birdSwoop() {
        let birdArray = this.birdGroup.getChildren();
        let easyMode = (minVelocity, maxVelocity) => { //choose a random bird to fly up a random height
            let randomBird = birdArray[Math.floor(Phaser.Math.Between(0, birdArray.length - 1))];
            let warning = this.add.sprite(randomBird.x, randomBird.y - randomBird.height, 'warning');
            //spawn a warning above the bird
            warning.anims.play('warning anim');
            //after the warning is done, have the bird fly up
            warning.on('animationcomplete', () => {
                warning.destroy();
                if (bird.y < game.config.height - 50)
                    randomBird.body.setVelocityY(-1 * (Phaser.Math.Between(minVelocity, maxVelocity) / 2));
                else
                    randomBird.body.setVelocityY(-1 * Phaser.Math.Between(minVelocity, maxVelocity));

            });
        }
        let mediumMode = (factor) => { //have bird's within an x range of bread bear fly up and back down again
            for (let bird of birdArray) {
                let xDist = Math.abs(bird.x - this.breadbear.x);
                if (xDist < 100) {
                    //spawn a warning above the bird
                    let warning = this.add.sprite(bird.x, bird.y - bird.height, 'warning');
                    warning.anims.play('warning anim');
                    //after the warning is done, have those birds fly up
                    warning.on('animationcomplete', () => {
                        warning.destroy();
                        //velocity is amplified based off of how far away the birds are from bread bear
                        let velocity = (-1 * (100 + 
                            (Phaser.Math.Distance.BetweenPoints(bird, this.breadbear)) / factor));
                        //if the birds are already swooping up at bread bear
                        if (bird.y < game.config.height - 50) // && bird.body.velocity > 0)
                            bird.body.setVelocityY(velocity / 1.5);
                        else
                            bird.body.setVelocityY(velocity);
                    });
                }
            }
        }
        switch (game.difficulty) { //use the bird behavior based off the game's chosen difficulty
            case 1:
                easyMode(game.config.height / 5, game.config.height / 3); //passing the min and max velocity range the birds can fly at
                this.birdSwoopTimer.delay = Phaser.Math.Between(4000, 7000);
                break;
            case 2:
                mediumMode(1.75);
                this.birdSwoopTimer.delay = Phaser.Math.Between(3000, 5000);
                break;
            case 3: //case 3 (hard mode) has the same functionality of both case 1 and 2
                mediumMode(1);
                //easy mode called after medium mode so that the random velocity bird is not part of the group swooping up
                easyMode(game.config.height / 1.5, game.config.height);
                this.birdSwoopTimer.delay = Phaser.Math.Between(2000, 3000);
                break;
            default:
                console.log(`error, difficulty level ${game.difficulty} doesn't exist`)
                break;
        }
    }

    //stopping movement and timers before switching to the game over text screen
    stopGame() {
        //TODO: disable gravity (global gravity tied to game.console.physics.arcade.gravity.y)
        //stop all spreads on screen from moving
        let spreadArray = this.spreadGroup.getChildren();
        for (let spread of spreadArray) {
            spread.setAccelerationY(0);
            spread.setVelocityY(0);
        }
        //remove the looping timers of the game's mechanics
        this.spreadSpawnTimer.remove();
        this.birdSwoopTimer.remove();
        this.updateScoreTimer.remove();
        this.updateDistanceTimer.remove();
        this.gameOver = true;
    }

    gameOverText() {
        //display game over text
        this.add.text(game.config.width / 2, game.config.height / 2.5 - 64, 'GAME OVER',
            this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2.5 + 128, '↓ to Restart or ↑ for Menu',
            this.scoreConfig).setOrigin(0.5);

        let highScoreString = 'HIGHSCORE: ';
        //check/assign high score values
        if (this.score.points >= game.highScore.points) {
            game.highScore.points = this.score.points;
            game.highScore.distance = this.score.distance;
            game.highScore.time = this.score.time;
            highScoreString = 'NEW ' + highScoreString;
        }
        this.add.text(game.config.width / 2, game.config.height / 2.5 + 24,
            highScoreString + `
points: ${game.highScore.points} 
distance: ${game.highScore.distance} 
time: ${game.highScore.time}`,
            this.scoreConfig).setOrigin(0.5);
    }

    createAnimations() {
        //bird flapping wings
        this.anims.create({
            key: 'birdflap',
            repeat: -1,
            yoyo: true, //yoyo makes the animation play back and forth (start -> finish, finish -> start)
            frames: this.anims.generateFrameNames('bird', {
                first: 0,
                end: 3,
            }),
            duration: 10,
            frameRate: 10,
        });

        //bread bear wiggles his ears when eating a good spread
        this.anims.create({
            key: 'smear butter',
            frames: this.anims.generateFrameNames('spread butter', {
                first: 0,
                end: 3,
            }),
            frameRate: 5,
        });

        //warning symbols appear above birds about to fly up
        this.anims.create({
            key: 'warning anim',
            frames: this.anims.generateFrameNames('warning', {
                first: 0,
                end: 3,
            }),
            frameRate: 10,
        });
    }

    updateBackground() {
        //background color change
        if (this.score.time == 10) {
            this.background.tint = 0x4972DC;
            this.toplayer.tint = 0x5067DF;
        }

        if (this.score.time == 20) {
            this.background.tint = 0x5067DF;
            this.toplayer.tint = 0x2847EC;
        }

        if (this.score.time == 30) {
            this.background.tint = 0x2847EC;
            this.toplayer.tint = 0x6217e3;
        }

        if (this.score.time == 40) {
            this.background.tint = 0x6217e3;
            this.toplayer.tint = 0x270578;
        }

        if ((this.score.time == 50) && (this.changeCloudtoStar)) {
            this.changeCloudtoStar = false;
            this.background.tint = 0x270578;
            this.toplayer.tint = 0x270578;
            let cloudArray = this.cloudGroup.getChildren();
            for (let cloud of cloudArray) {
                cloud.changeTexture = true;
            }
            for (let i = 0; i < 10; i++) {
                let spawnDelay = Math.floor(Phaser.Math.Between(1000,3000)) * (i + 1);
                this.clock = this.time.delayedCall(spawnDelay, () => {
                    let cloud = new Cloud(this, game.config.height + 100, 0, 'cloud1', 0).setOrigin(0.5);
                    cloud.changeTexture = true;
                    this.cloudGroup.add(cloud);
                }, null, this);
            }
        }
    }
}