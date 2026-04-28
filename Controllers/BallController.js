class BallController {

constructor(scene, spaceKey){
    this.scene = scene;
    this.spaceKey = spaceKey;
    this.hasBall = true;
    this.vx = 0;
    this.vy = 0;
}

create(){
    this.ball = this.scene.logicBall;
    this.player = this.scene.logicPlayer;
}

update(){

    if(this.hasBall && Phaser.Input.Keyboard.JustDown(this.spaceKey)){
        this.hasBall = false;
        this.vx = 7;
        this.vy = 0;
    }

    if(this.hasBall){

        this.ball.x = this.player.x + 14;
        this.ball.y = this.player.y;

    }else{

        this.ball.x += this.vx;
        this.ball.y += this.vy;

        this.vx *= 0.98;

        if(Math.abs(this.vx) < 0.1){
            this.hasBall = true;
        }
    }
}
}