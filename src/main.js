//main game object
let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x:0,
                y:0
            }
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 5;

//TODO: see if there's a better scope to bind this to
//height offset for player
let playerHeightOffset = 50;

let scrollSpeed = 4; //pixels per frame

//initialize high score
game.highScore = { points: 0, time: 0, distance: 0};

// reserve keyboard bindings
let keyDOWN, keyUP, keyLEFT, keyRIGHT;