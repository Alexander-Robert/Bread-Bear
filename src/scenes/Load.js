class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // this.load.path = './assets/';

        // //load audio
        // this.load.audio('sfx_caw', 'sfx/caw.wav');
        // this.load.audio('sfx_select', 'sfx/click.wav');
        // this.load.audio('sfx_smear', 'sfx/smear.wav');

        // //load images
        // this.load.image('toplayer', 'base-sprites/toplayer.png');
        // this.load.image('background', 'base-sprites/sky.png');
        // this.load.image('cloud1', 'base-sprites/cloud1.png');
        // this.load.image('cloud2', 'base-sprites/cloud2.png');
        // this.load.image('star1', 'base-sprites/star1.png');
        // this.load.image('star2', 'base-sprites/star2.png');
        // this.load.image('breadbear', 'base-sprites/breadbear.png');
        // this.load.image('butter', 'base-sprites/butter.png');
        // this.load.image('avocado', 'base-sprites/avocado.png');
        // this.load.image('jam', 'base-sprites/jam.png');

        // //load atlas
        // this.load.atlas('bird', 'animation-files/birdwingflap.png',
        //     'animation-files/birdwingflap.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    create() {
        console.log('load scene finished');
        this.scene.start('menuScene');
    }
}