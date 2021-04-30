class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/click.wav');
    }

    create() {
        //menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
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
        this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding,
            'Bread Bear', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2,
            'Use ←→ arrows to move ↑ to start', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding,
            'collect butter to speed up', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 2.5,
            'too slow and the birds get you', menuConfig).setOrigin(0.5);

        let highScoreString = `HIGHSCORE: 
points: ${game.highScore.points}
distance: ${game.highScore.distance}
time: ${game.highScore.time}`;

        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 5,
            highScoreString, menuConfig).setOrigin(0.5);

        // define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.difficulty = 1;
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
    }
}