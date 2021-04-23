class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load images
        this.load.image('background', './assets/background.png');
        this.load.image('breadbear', './assets/breadbear.png');
        this.load.image('birds', './assets/birds.png');
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
            distance: 0,
            scoreText: []
        };
        //TODO: change scoreText to a map (allows sorting by key instead of remembering index and it's iterable unlike objects)  
        //add text boxes to scoreText array in the score object
        this.score.scoreText.push(this.add.text(50, 25, this.score.points, this.scoreConfig));
        this.score.scoreText.push(this.add.text(125, 25, this.score.time, this.scoreConfig));
        this.score.scoreText.push(this.add.text(200, 25, this.score.distance, this.scoreConfig));

        //create player's character
        this.breadbear = new Breadbear(this, game.config.width / 2, game.config.height - playerHeightOffset,
            'breadbear');

        //TODO: implement spreads (images, collisions, collision effect)
            //spreads will be an object of each spread type, 
            //each spread type will be an array of objects of that spread type 
        //create spreads object 
        this.spreads = {
            butter: [],
            jam: [],
            avocado: []
        }
        //create spreads
        //TODO: more spreads than just butter
        this.spreads.butter.push(new Spread(this, game.config.width / 2, 32, 'butter', true));

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

        //update while game is going
        if (!this.gameOver) {
            //scroll background
            this.background.tilePositionY -= scrollSpeed;

            //TODO: remove this when actual game over is implemented
            //temp testing for game over logic
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.gameOver = true;
            }

            //update bread bear
                this.breadbear.update();

            //update spreads
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
            for (let spreadType in this.spreads){
                for (let spread of this.spreads[spreadType]){
                    spread.update();
                }
            }

            //update timer
            //TODO: find out way to properly call totalElapsedSeconds from this scene
            //this.score.time = this.time.totalElapsedSeconds();
            this.score.scoreText[2].text = Math.floor(this.score.time);
            
        }
        else {
            if(!this.gameOverDisplayed){
                this.gameOverText();
                this.gameOverDisplayed = true;
            }
        }
        
        // //check collisions
        // if (this.checkCollision(this.breadbear, this.spreads.butter)) {
        //     console.log('collided!');
        // }
    }

    //TODO: change simple AABB collision detection to Phaser physics collision detection
    checkCollision(Breadbear, spreadObject) {
        //simple AABB checking
        if (Breadbear.x < spreadObject.x + spreadObject.width &&
            Breadbear.x + Breadbear.width > spreadObject.x &&
            Breadbear.y < spreadObject.y + spreadObject.height &&
            Breadbear.height + Breadbear.y > spreadObject.y) {
            return true;
        }
        else {
            return false;
        }
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