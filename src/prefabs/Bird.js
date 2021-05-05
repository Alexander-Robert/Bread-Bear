class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        scene.physics.add.existing(this);
        this.ACCELERATION = 200;
        this.collided = false;
    }
}