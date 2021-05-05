class Cloud extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
  
        // add object to existing scene
        scene.add.existing(this);
        
      
    }

    update() {
        
        this.y -= 2

        // wrap around from top to bottom
        

        if (this.y <= 0 - this.width) {
            this.y = game.config.height;
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}