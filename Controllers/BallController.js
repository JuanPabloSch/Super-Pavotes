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

    if(this.scene.isPaused) return;

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
shoot(){
    if(!this.hasBall) return;

    this.hasBall = false;
    this.vx = 7;
    this.vy = 0;
}

pass(){
    if(!this.hasBall) return;

    this.hasBall = false;

    let mate = this.scene.teammate;

    let dx = mate.x - this.ball.x;
    let dy = mate.y - this.ball.y;

    let dist = Math.sqrt(dx*dx + dy*dy);

    this.vx = (dx/dist) * 6;
    this.vy = (dy/dist) * 6;
}
}