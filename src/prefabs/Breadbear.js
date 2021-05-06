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
            this.setGravityY(50); //have him fall quicker
        }
        else{
            this.setGravityY(5); //reset his gravity to normal
        }
    }

    speedUp() {
        this.setVelocityY(-this.MAX_FALLING_VELOCITY * 2);
    }
}