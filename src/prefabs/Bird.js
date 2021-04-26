class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        scene.physics.add.existing(this);
        this.ACCELERATION = 200;
        this.collided = false;
    }
    update(){
        //stop birds at correct height
        if(this.body.velocity.y != 0 && this.y == game.config.height - 32) {
            this.setAccelerationY(0);
            this.setVelocityY(0);
        }
    }

    //TODO: find better implementation?
    //really janky method for timing the swoop.
    flyUp() {
        let duration = 1000;
        //set upward acceleration
        this.setAccelerationY(-this.ACCELERATION);
        //after acceleration duration, slow it down
        this.scene.time.delayedCall(duration, () => { 
            this.setAccelerationY(this.ACCELERATION * 2);
            this.scene.time.delayedCall((duration / 2), () => {
                this.setAccelerationY(0);
                this.setVelocityY(0);
                this.scene.time.delayedCall((duration / 4), () => {
                    this.setAccelerationY(this.ACCELERATION);
                    this.scene.time.delayedCall((duration), () => {
                        this.setAccelerationY(-this.ACCELERATION * 2);
                        this.scene.time.delayedCall((duration / 2), () => {
                            this.setAccelerationY(0);
                            this.setVelocityY(0);
                            this.y = game.config.height - 32;
                        });
                    });
                });
            });
        });
    }
}