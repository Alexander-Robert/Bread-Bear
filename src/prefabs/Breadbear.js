// doughnut (player) prefab
class Breadbear extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add Object to existing scene
        scene.add.existing(this);
        this.moveSpeed = 3; //pixels per frame
    }

    update() {
        // left/right movement
        if (keyLEFT.isDown && this.x >= this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - this.width) {
            this.x += this.moveSpeed;
        }
    }

    //TODO: implement function. (gets call from collision handling in Play.js)
        //TODO: figure out if internal speedUp amount should be handled here or in Play.js
    speedUp() {
        console.log("speed up!");
        //speedUp player (increase background scroll speed, give player acceleration upwards for x amount of time)
            //x amount of time based on player's y position (higher up, less time to move up)

        //check bounds to make sure player does not go above screen.
        //if player is at some max y height, each speed up boost pushes them up quickly and back down to max y height
    }
}