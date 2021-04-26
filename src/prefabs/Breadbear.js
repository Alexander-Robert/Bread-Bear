// doughnut (player) prefab
class Breadbear extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        //add Object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.MAX_VELOCITY = 225;
        this.ACCELERATION = 500;
        this.DRAG = 100;
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

        if (this.body.velocity.y == 0) {
            //slowly drift down when not collecting spreads
            //this.setAccelerationY(5);
            //this.body.velocity.y = 0;
        }
    }

    //TODO: implement function. (gets call from collision handling in Play.js)
        //TODO: figure out if internal speedUp amount should be handled here or in Play.js
    speedUp(duration) {
        console.log("speed up!");
        //set upward acceleration
        this.setAccelerationY(-this.ACCELERATION);
        //after acceleration duration, slow it down
        this.scene.time.delayedCall(duration, () => { 
            this.setAccelerationY(this.ACCELERATION * 2);
            this.scene.time.delayedCall((duration / 2), () => { 
                this.setAccelerationY(0);
                this.setVelocityY(0);
            });
        });
        //speedUp player (increase background scroll speed, give player acceleration upwards for x amount of time)
            //x amount of time based on player's y position (higher up, less time to move up)

        //check bounds to make sure player does not go above screen.
        //if player is at some max y height, each speed up boost pushes them up quickly and back down to max y height
    }
}