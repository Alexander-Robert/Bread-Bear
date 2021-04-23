//TODO: see if we need a class for spreads or basic attributes for spreads objects in Play.js
class Spread extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, speedUp, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add Object to existing scene
        this.boostPlayer = speedUp; //bool to check if collision should boost or slow player 
    }
    update() {
        //move spread down
        this.y += scrollSpeed * 1.25;
    }
}