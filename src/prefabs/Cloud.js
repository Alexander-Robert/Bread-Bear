class Cloud extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene = scene;
        scene.add.existing(this); 
        this.ySpeed = 2;
        this.xSpeed = 0;
        this.changeTexture = false;
        this.stars = false;
    }

    update() {
        this.y += this.ySpeed;
        if(!this.stars)
            this.x += this.xSpeed;
        // wrap around from bottom to top
        if (this.y >= game.config.height + this.height ||
            this.x >= game.config.width + this.width ||
            this.x <= 0 - this.width) {
            if(this.changeTexture)
                this.createStars();
            this.y = 0 - this.height * 1.25; //reset the height (resets it at maximum possible size)
            //give it random x position
            this.x = Phaser.Math.Between(15 + this.width, game.config.width - this.width - 15);
            let newSize;
            if(!this.stars){ //if its a cloud
                newSize = Phaser.Math.Between(0.75,1.25);
                this.ySpeed = 3 - newSize; //bigger size = slower fall, vice versa
            }
            else {//if it's a star
                newSize = Phaser.Math.Between(0.25,1);
                this.ySpeed = 2 - newSize; //bigger size = slower fall, vice versa
            }
            this.xSpeed = Phaser.Math.Between(-0.15/newSize,0.15/newSize); //give it a small random x value
            this.setScale(newSize); //set it to a random size
            
        }
    }

    createStars() {
        this.changeTexture = false; //only triggers once
        this.stars = true;
        this.setTexture('star2');
        this.rotateStar = this.scene.time.addEvent({ //every few seconds, the star will rotate a random factor or 90 degrees
            delay: 1000,
            callback: () => {
                this.angle = 90 * Math.floor(Phaser.Math.Between(0, 4));
                this.rotateStar.delay = 1000 * Math.floor(Phaser.Math.Between(1, 3))
            },
            callbackScope: this, //scene instead of this?
            loop: true
        });
    }
}
// checkCollision(doughnut, guard) { //OUTSIDE SHOULD BE || NOT &&
//     //simple AABB checking
//     if (doughnut.x < guard.x + guard.width &&
//         doughnut.x + doughnut.width > guard.x &&
//         doughnut.y < guard.y + guard.height &&
//         doughnut.height + doughnut.y > guard.y) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }