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
        this.load.image('cloud1', './assets/cloud1.png');
        this.load.image('cloud2', './assets/cloud2.png');
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
            distance: 0,
            scoreText: []
        };

        // add clouds
        this.cloud1 = this.add.sprite(30,  60, 'cloud1').setOrigin(0, 0);
        this.cloud2 = this.add.sprite(120,  65, 'cloud2').setOrigin(0, 0);
        this.cloud3 = this.add.sprite(300,  62, 'cloud1').setOrigin(0, 0);

        //TODO: change scoreText to a map (allows sorting by key instead of remembering index and it's iterable unlike objects)  
        //add text boxes to scoreText array in the score object
        //this.score.scoreText.push(this.add.text(50, 25, this.score.points, this.scoreConfig));
        //this.score.scoreText.push(this.add.text(125, 25, this.score.time, this.scoreConfig));
        //this.score.scoreText.push(this.add.text(200, 25, this.score.distance, this.scoreConfig));

        //create player's character
        this.breadbear = new Breadbear(this, game.config.width / 2, game.config.height - playerHeightOffset,
            'breadbear');
        this.breadbear.setImmovable(true);

        //TODO: implement spreads
        this.spreadGroup = this.add.group({
            runChildUpdate: true,    // make sure update runs on group children
        });

        this.spreadSpawnTimer = this.time.addEvent({
            delay: 2500,
            callback: this.addSpread,
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

    addSpread(){
        //create spreads
        //TODO: more spreads than just butter
        let spread = new Spread(this, 0, -32, 'butter', true);
        spread.create();
        this.spreadGroup.add(spread);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start("menuScene");
        }

        //update while game is going
        if (!this.gameOver) {
            //scroll background
            //TODO: remove this when tinting and clouds are implemented
            this.background.tilePositionY -= scrollSpeed;

            //TODO: remove this when actual game over is implemented
            //temp testing for game over logic
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.gameOver = true;
            }

            //update bread bear
            this.breadbear.update();
            
            this.physics.world.collide(this.breadbear, this.spreadGroup, this.spreadCollision, null, this);
            this.physics.world.collide(this.breadbear, this.birdGroup, this.birdCollision, null, this);


            //update game timer
            //TODO: find out way to properly call totalElapsedSeconds from this scene
            //this.score.time = this.time.totalElapsedSeconds();
            //this.score.scoreText[2].text = Math.floor(this.score.time);

        }
        else {
            if (!this.gameOverDisplayed) {
                this.gameOverText();
                this.gameOverDisplayed = true;
            }
        }
    }

    spreadCollision() {
        let spreadArray = this.spreadGroup.getChildren();
        let closest = 10000; //look at each object to see which is closest to bread bear 
        //(i.e. which spread collided with bread bear)
        let targetSpread;
        for (let spread of spreadArray) {
            let distance = Math.sqrt(Math.pow((this.breadbear.x - spread.x), 2) 
                                   + Math.pow((this.breadbear.y - spread.y), 2));
            if (closest > distance) {
                closest = distance;
                targetSpread = spread;
            }
        }
        this.spreadGroup.remove(targetSpread);
        targetSpread.destroy();
        this.breadbear.speedUp(750);
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