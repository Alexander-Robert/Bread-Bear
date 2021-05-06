class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //add Object to existing scene
        scene.physics.add.existing(this);
    }
    update() {
        if (this.y < 150) {
            this.setGravityY(500); //have him fall quicker
        }
        else {
            switch (game.difficulty) {
                case 1:
                    this.setGravityY(50); //reset his gravity to normal
                    break;
                case 2:
                    this.setGravityY(100); //reset his gravity to normal
                    break;
                case 3:
                    this.setGravityY(300); //reset his gravity to normal
                    break;
                default:
                    break;
            }
        }
    }
}