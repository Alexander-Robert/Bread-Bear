class Spread extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, speedUp, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        scene.physics.add.existing(this);
        this.boostPlayer = speedUp; //bool to check if collision should boost or slow player
        this.MAX_VELOCITY = 200;
        this.setGravityY(0); //have spreads fall at a constant rate
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
        //set downward velocity
        this.setVelocityY(this.MAX_VELOCITY);
    }
    update() {
        //if the spread goes offscreen, destroy it
        if (this.y > game.config.height + this.height) {
                this.destroy();
        }
    }
}