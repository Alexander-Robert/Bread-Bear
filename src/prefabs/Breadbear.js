// doughnut (player) prefab
class Breadbear extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        //add Object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.MAX_VELOCITY = 225;
        this.MAX_FALLING_VELOCITY = 50;
    }

    update() {
        // left/right movement
        if (keyLEFT.isDown && this.x >= this.width) {
            this.setVelocityX(-this.MAX_VELOCITY);
        } 
        else if (keyRIGHT.isDown && this.x <= game.config.width - this.width) {
            this.setVelocityX(this.MAX_VELOCITY);
        }
        else {
            this.body.velocity.x = 0;
        }

        //stop breadbear from falling too fast
        if (this.body.velocity.y >= this.MAX_FALLING_VELOCITY) { 
            this.setVelocityY(this.MAX_FALLING_VELOCITY);
        }
        //if breadbear is too close to the top of the screen
        if (this.y < 150){
            //console.log("too high up");
            this.setGravityY(50); //have him fall quicker
        }
        else{
            this.setGravityY(5); //reset his gravity to normal
        }
    }

        //TODO: figure out if internal speedUp amount should be handled here or in Play.js
    speedUp(duration) {
        this.setVelocityY(-this.MAX_FALLING_VELOCITY * 2);
        
        //speedUp player (increase background scroll speed, give player acceleration upwards for x amount of time)
            //x amount of time based on player's y position (higher up, less time to move up)

        //check bounds to make sure player does not go above screen.
        //if player is at some max y height, each speed up boost pushes them up quickly and back down to max y height
    }
}