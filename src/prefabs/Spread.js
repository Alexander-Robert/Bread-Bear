//TODO: see if we need a class for spreads or basic attributes for spreads objects in Play.js
class Spread extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, speedUp, timerPosition, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        this.boostPlayer = speedUp; //bool to check if collision should boost or slow player
        this.timer = timerPosition; //initial spawning dictates when spreads will fall in what order
    }
    create() {
        //spawn spread on 1 of 3 "lanes"
        switch (Phaser.Math.Between(1, 3)) {
            case 1:
                this.x = (game.config.width / 4) + Phaser.Math.Between(-this.width,this.width);
                break;
            case 2:
                this.x = game.config.width / 2 + Phaser.Math.Between(-this.width,this.width);
                break;
            case 3:
                this.x = (3* game.config.width) / 4 + Phaser.Math.Between(-this.width,this.width);
                break;
            default:
                console.log("Spread.js create(): error, number out of range.");
                break;
        }
        //TODO: create the timer of all objects based off difficulty mode adjusted by scrollSpeed
        //create a timer for object to start moving down screen
        //this.timer = ;
    }
    update() {
        //move spread down (while on screen)
        //TODO: add && conditional checking if timer is 0
        if (this.y <= game.config.height + this.height)
        this.y += scrollSpeed * 1.25;
    }
}