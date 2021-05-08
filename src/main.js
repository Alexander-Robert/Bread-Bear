/*
Collaborators:
Alexander Robert - programming
Thea Gamez - art
Fiona Hsu - programming, art, sound
Game title: Bread Bear
Date completed: 5/5/2021
*/

//main game object
let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: false,
            gravity: {
                x:0,
                y:50
            }
        }
    },
    scene: [Load, Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 5;

let scrollSpeed = 4; //pixels per frame

//height offset for player
let playerHeightOffset = 250;

//initialize high score
game.highScore = { points: 0, time: 0, distance: 0};

//create a difficulty (1 easy, 2 medium, 3 hard)
game.difficulty = 1;

// reserve keyboard bindings
let keyDOWN, keyUP, keyLEFT, keyRIGHT;