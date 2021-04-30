class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load images
        this.load.image('background', './assets/background.png');
        this.load.image('breadbear', './assets/breadbear.png');
        this.load.image('bird', './assets/birds.png');
        this.load.image('butter', './assets/butter.png');
        this.load.image('avocado', './assets/avocado.png');
        this.load.image('jam', './assets/jam.png');
    }
    create() { //remember last things added in create are made first!!!!
        //add background
        this.background = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'background').setOrigin(0, 0);

        // define keys
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
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            wordWrap: { width: game.config.width, useAdvancedWrap: true }
        }
        
        //add score data structure (stores the text boxes in score object)
        this.score = {
            points: 0,
            time: 0,
            distance: 0
        };
        //TODO: change score to a map with "points", "time", "distance" as keys and values is object of value and text 
            //(allows sorting by key instead of remembering index and it's iterable unlike objects)  
        //add text boxes to display values on screen
        this.pointsText = this.add.text(50, 25, this.score.points, this.scoreConfig);
        this.timeText = this.add.text(125, 25, this.score.time, this.scoreConfig);
        this.distanceText = this.add.text(200, 25, this.score.distance, this.scoreConfig);

        //create player's character
        this.breadbear = new Breadbear(this, game.config.width / 2, game.config.height - playerHeightOffset,
            'breadbear');
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
        this.phantomBox = this.physics.add.sprite(game.config.width/2,
            game.config.height - 25).setOrigin(0,0); //creates at said position
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
                this.spreadGroup.add(spread);},
            callbackScope: this,
            loop: true
        });

        //implement birds as a group
        this.birdGroup = this.add.group({
            runChildUpdate: true,   // make sure update runs on group children
        });
        for(let i =0; i != 10; i++) {
            this.birdGroup.add(new Bird(this,16 + (i * 50), game.config.height - 33,'bird'));
        }

        //timed loop to have the birds swoop up at bread bear
        this.birdSwoopTimer = this.time.addEvent({
            delay: 4000,
            callback: this.birdSwoop,
            callbackScope: this,
            loop: true
        });

        //update time counter in score
        //TODO: implement updating the distance in the callback function
        this.updateScoreTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score.time++;
                this.timeText.text = this.score.time;},
            callbackScope: this,
            loop: true
        });

        this.birdGroup = this.add.group({
            runChildUpdate: true,
        });

        this.birdGroup.add(new Bird(this,(game.config.width / 4), game.config.height - 32,'bird'));
        this.birdGroup.add(new Bird(this,(game.config.width / 2), game.config.height - 32,'bird'));
        this.birdGroup.add(new Bird(this,((3* game.config.width) / 4), game.config.height - 32,'bird'));

        this.birdSwoopTimer = this.time.addEvent({
            delay: 4000,
            callback: this.birdSwoop,
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
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("menuScene");
        }

        //put this outside the if (!this.gameOver) block because it should update reguardless
        //check collisions with the birds and phantomBox
        this.physics.world.collide(this.birdGroup, this.phantomBox);

        //update while game is going
        if (!this.gameOver) {
            //scroll background
            //TODO: remove this when tinting and clouds are implemented
            this.background.tilePositionY -= scrollSpeed;

            //TODO: remove this when testing for game is done
            //temp testing for game over logic
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.stopGame();
            }

            //update bread bear
            this.breadbear.update();

            //if bread bear has fallen off screen, game over
            if (this.breadbear.y > game.config.height + this.breadbear.height)
                this.stopGame();
            
            //check collisions with breadbear and spreads
            this.physics.world.collide(this.spreadGroup, this.breadbear, (spread) => {
                    this.spreadGroup.remove(spread);
                    spread.destroy();
                    this.breadbear.speedUp(750);
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
            let randomBird = birdArray[Phaser.Math.Between(0, birdArray.length - 1)];
            if (randomBird.y != game.config.height - 35) { //make sure the bird we're selecting isn't already swooping
                randomBird = birdArray[Phaser.Math.Between(0, birdArray.length - 1)];
            }
            randomBird.body.setVelocityY(-1 * Phaser.Math.Between(minVelocity, maxVelocity));
        }
        let mediumMode = () => { //have bird's within an x range of bread bear fly up and back down again
            for (let bird of birdArray) {
                let xDist = Math.abs(bird.x - this.breadbear.x);
                if (xDist < 100) {
                    //velocity is amplified based off of how far away the birds are from bread bear
                    let velocity = (-1 * (100 + (Phaser.Math.Distance.BetweenPoints(bird, this.breadbear)) / 5));
                    if (bird.y != game.config.height - 35) //if the birds are already swooping up at bread bear
                    {
                        console.log(bird.y);
                        bird.body.setVelocityY(velocity / 1.5); //if the bird is already moving towards bread bear
                    }
                    else
                        bird.body.setVelocityY(velocity);
                }
            }
        }
        switch (game.difficulty) { //use the bird behavior based off the game's chosen difficulty
            case 1:
                easyMode(100, game.config.height / 3); //passing the min and max velocity range the birds can fly at
                break;
            case 2: 
                mediumMode();
                break;
            case 3: //case 3 (hard mode) has the same functionality of both case 1 and 2
                mediumMode();
                //easy mode called after medium mode so that the random velocity bird is not part of the group swooping up
                easyMode(game.config.height / 4, game.config.height / 2.5); 
                break;
            default:
                console.log(`error, difficulty level ${game.difficulty} doesn't exist`)
                break;
        }
        //birds will swoop every 4-7 seconds
        this.birdSwoopTimer.delay = Phaser.Math.Between(4000, 7000);
    }

    //stopping movement and timers before switching to the game over text screen
    stopGame() {
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
        this.gameOver = true;
    }


    birdCollision() {
        let spreadArray = this.spreadGroup.getChildren();
        for (let spread of spreadArray){
            spread.setAccelerationY(0);
            spread.setVelocityY(0);
        }
        let birdArray = this.birdGroup.getChildren();
        for (let bird of birdArray){
            bird.setAccelerationY(0);
            bird.setVelocityY(0);
        }
        this.spreadSpawnTimer.remove();
        this.birdSwoopTimer.remove();
        this.gameOver = true;        
    }

    //have a random bird fly up and back down again
    birdSwoop(){
        //select a random bird
        let birdArray = this.birdGroup.getChildren();
        let bird = birdArray[Phaser.Math.Between(0,birdArray.length-1)];
        bird.flyUp();
        //birds will swoop every 4-7 seconds
        this.birdSwoopTimer.delay = Phaser.Math.Between(4000, 7000);
    }

    gameOverText() {
        //display game over text
        this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'GAME OVER',
            this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'Press ↓ to Restart or ↑ for Menu',
            this.scoreConfig).setOrigin(0.5);

        let highScoreString = 'HIGHSCORE: ';
        //check/assign high score values
        if (this.score.points >= game.highScore.points) {
            game.highScore.points = this.score.points;
            game.highScore.distance = this.score.distance;
            game.highScore.time = this.score.time;
            highScoreString = 'NEW ' + highScoreString;
        }
        this.add.text(game.config.width / 2, game.config.height / 2 + 24,
            highScoreString + `
points: ${game.highScore.points} 
distance: ${game.highScore.distance} 
time: ${game.highScore.time}`,
            this.scoreConfig).setOrigin(0.5);
    }
}