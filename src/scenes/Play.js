class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load images
        this.load.image('toplayer', './assets/toplayer.png');
        this.load.image('background', './assets/sky.png');
        this.load.image('transition', './assets/transition.png');

        this.load.image('cloud1', './assets./cloud1.png');
        this.load.image('cloud2', './assets./cloud2.png');
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
        this.background.tint = 0x6CC3FD;
        
        

        // add top background border
        this.toplayer = this.add.sprite(0,  0, 'toplayer').setOrigin(0, 0);
        this.toplayer.tint = 0x4972DC;
        
        // add clouds
        this.cloud1 = new Cloud(this, 30, 200, 'cloud1', 0).setOrigin(0, 0);
        this.cloud2 = new Cloud(this, 250, 300, 'cloud2', 0).setOrigin(0, 0);

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
            distance: 0,
            scoreText: []
        };
        //TODO: change score to a map with "points", "time", "distance" as keys and values is object of value and text 
            //(allows sorting by key instead of remembering index and it's iterable unlike objects)  
        //add text boxes to scoreText array in the score object
        this.score.scoreText.push(this.add.text(50, 25, this.score.points, this.scoreConfig));
        this.score.scoreText.push(this.add.text(125, 25, this.score.time, this.scoreConfig));
        this.score.scoreText.push(this.add.text(200, 25, this.score.distance, this.scoreConfig));

        //create player's character
        this.breadbear = new Breadbear(this, game.config.width / 2, game.config.height - playerHeightOffset,
            'breadbear');
        this.breadbear.setImmovable(true);

        this.spreadGroup = this.add.group({
            runChildUpdate: true,    // make sure update runs on group children
        });

        //timed loop to create new spreads
        this.spreadSpawnTimer = this.time.addEvent({
            delay: 2500,
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

        this.birdGroup.add(new Bird(this,(game.config.width / 4), game.config.height - 32,'bird'));
        this.birdGroup.add(new Bird(this,(game.config.width / 2), game.config.height - 32,'bird'));
        this.birdGroup.add(new Bird(this,((3* game.config.width) / 4), game.config.height - 32,'bird'));

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
                this.score.scoreText[1].text = this.score.time;},
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

        this.cloud1.update();
        this.cloud2.update();


        if (this.score.time == 10) {
            this.background.tint = 0x4972DC;
            this.toplayer.tint = 0x5067DF;
            //this.transition = this.add.sprite(0,  0, 'transition').setOrigin(0, 0);
        }

        if (this.score.time == 20) {
            this.background.tint = 0x5067DF;
            this.toplayer.tint = 0x2847EC;
        }
        
        if (this.score.time == 30) {
            this.background.tint = 0x2847EC;
            this.toplayer.tint = 0x5837E3;
        }
        

        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("menuScene");
        }

        //update while game is going
        if (!this.gameOver) {

            //TODO: remove this when testing for game is done
            //temp testing for game over logic
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.birdCollision();
            }

            //update bread bear
            this.breadbear.update();
            
            //check collisions with breadbear and spreads
            this.physics.world.collide(this.spreadGroup, this.breadbear, (spread) => {
                    this.spreadGroup.remove(spread);
                    spread.destroy();
                    this.breadbear.speedUp(750);
                }, null, this);
            //check collisions with breadbear and birds
            this.physics.world.collide(this.birdGroup, this.breadbear, this.birdCollision, null, this);
        }
        else {
            if (!this.gameOverDisplayed) {
                this.gameOverText();
                this.gameOverDisplayed = true;
            }
        }
    }

    //stopping movement and timers before switching to gameOver conditions
    birdCollision(bird) {
        //stop all spreads on screen from moving
        let spreadArray = this.spreadGroup.getChildren();
        for (let spread of spreadArray){
            spread.setAccelerationY(0);
            spread.setVelocityY(0);
        }
        //stop the bird on screen from moving
        bird.setAccelerationY(0);
        bird.setVelocityY(0);
        //remove the looping timers of the game's mechanics
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