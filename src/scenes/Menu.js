class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        //load audio
        this.load.audio('sfx_caw', './assets/sfx/caw.wav');
        this.load.audio('sfx_select', './assets/sfx/click.wav');
        this.load.audio('sfx_smear', './assets/sfx/smear.wav');
        this.load.audio('music', './assets/sfx/bread_zoom.mp3');
        //load images
        this.load.image('title screen', './assets/title_screen.png');
        this.load.image('toplayer', './assets/base-sprites/toplayer.png');
        this.load.image('background', './assets/base-sprites/sky.png');
        this.load.image('cloud1', './assets/base-sprites/cloud1.png');
        this.load.image('cloud2', './assets/base-sprites/cloud2.png');
        this.load.image('star1', './assets/base-sprites/star1.png');
        this.load.image('star2', './assets/base-sprites/star2.png');
        this.load.image('breadbear', './assets/base-sprites/breadbear.png');
        this.load.image('butter', './assets/base-sprites/butter.png');
        this.load.image('avocado', './assets/base-sprites/avocado.png');
        this.load.image('jam', './assets/base-sprites/jam.png');

        //load all atlas
        this.load.atlas('bird', './assets/animation-files/birdwingflap.png',
            './assets/animation-files/birdwingflap.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('spread butter', './assets/animation-files/spread_butter.png',
            './assets/animation-files/spread_butter.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('warning', './assets/animation-files/warning.png',
            './assets/animation-files/warning.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }
    create() {

        // add top background border
        this.toplayer = this.add.sprite(0, 0, 'toplayer').setOrigin(0, 0);
        this.toplayer.tint = 0x4972DC;

        //add background
        this.background = this.add.tileSprite(0, 0,
            game.config.width, game.config.height, 'background').setOrigin(0, 0);
        this.background.tint = 0x6CC3FD;

        //add static title screen
        this.add.sprite(0,0,'title screen').setOrigin(0);

        //menu text configuration
        this.menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            wordWrap: { width: game.config.width, useAdvancedWrap: true },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width / 2, game.config.height / 4,
            `Bread Bear
            Use ←→ arrows to move 
            ← = easy ↑ = medium → = hard
            ↓ for credits`, this.menuConfig).setOrigin(0.5,0);
        this.add.text(game.config.width / 2, game.config.height / 3.5 + borderUISize *2.5,
            `collect butter to speed up
            too slow & the birds get you`, this.menuConfig).setOrigin(0.5,0);

        let highScoreString = `HIGHSCORE: 
points: ${game.highScore.points}
distance: ${game.highScore.distance}
time: ${game.highScore.time}`;

        this.add.text(game.config.width / 2, game.config.height / 1.5 - borderPadding * 2.25,
            highScoreString, this.menuConfig).setOrigin(0.5);

        this.menuConfig.backgroundColor = '#F3B141';
        this.credits = this.add.text(game.config.width / 2, game.config.height / 2 - 25,
            `Alexander Robert 
            programming
            Thea Gamez 
            art
            Fiona Hsu 
            programming, art, sound
            sounds used:
            “Crow Caw” from Jofae
            “Squelchy squirt” by DrMinky`, this.menuConfig).setOrigin(0.5,0);
        this.credits.alpha = 0;

        // define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.difficulty = 1;
            game.config.physics.arcade.gravity.y = 50;
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            game.difficulty = 2;
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.difficulty = 3;
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.credits.alpha = (this.credits.alpha == 0) ? 1 : 0;
        }
    }
}