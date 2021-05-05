class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        scene.physics.add.existing(this);
    }
    //bird doesn't do much right now. Play.js handles the bird behavior.
    //TODO: see if moving bird behavior here will help with clarity in Play.js
}