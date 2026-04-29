class BallController {

constructor(scene, spaceKey){
    this.scene = scene;
    this.spaceKey = spaceKey;

    this.hasBall = true;

    this.vx = 0;
    this.vy = 0;

    this.isPassing = false;
    this.passTarget = null;
}

create(){
    this.ball = this.scene.logicBall;
    this.player = this.scene.logicPlayer;
}

update(){

    if(this.scene.isPaused) return;

    // disparo directo con espacio
    // if(this.hasBall && Phaser.Input.Keyboard.JustDown(this.spaceKey)){
    //     this.shoot();
    // }

    // =========================
    // CON PELOTA
    // =========================
    if(this.hasBall){

        this.ball.x = this.player.x + 14;
        this.ball.y = this.player.y;
    }

    // =========================
    // SIN PELOTA
    // =========================
    else{

    this.ball.x += this.vx;
    this.ball.y += this.vy;

    if(!this.isPassing){
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    // =====================
    // LLEGADA DEL PASE
    // =====================
    if(this.isPassing){

        let d = Phaser.Math.Distance.Between(
            this.ball.x,
            this.ball.y,
            this.passTarget.x,
            this.passTarget.y
        );

        if(d < 18){

            this.hasBall = true;
            this.isPassing = false;

            let oldX = this.scene.logicPlayer.x;
            let oldY = this.scene.logicPlayer.y;

            this.scene.logicPlayer.x = this.passTarget.x;
            this.scene.logicPlayer.y = this.passTarget.y;

            this.scene.teammate.x = oldX;
            this.scene.teammate.y = oldY;

            this.vx = 0;
            this.vy = 0;

            return;
        }
    }

    // =====================
    // RECUPERAR JUGADOR
    // =====================
    let dPlayer = Phaser.Math.Distance.Between(
        this.ball.x,
        this.ball.y,
        this.scene.logicPlayer.x,
        this.scene.logicPlayer.y
    );

    if(dPlayer < 16){
        this.hasBall = true;
        this.vx = 0;
        this.vy = 0;
        return;
    }

    // =====================
    // RECUPERAR CPU
    // =====================
    let dDef1 = Phaser.Math.Distance.Between(
        this.ball.x,
        this.ball.y,
        this.scene.def1.x,
        this.scene.def1.y
    );

    if(dDef1 < 16){
        this.owner = "cpu";
        this.cpuCarrier = this.scene.def1;
        this.vx = 0;
        this.vy = 0;
        return;
    }
}
}

// =========================
// PATEAR
// =========================
shoot(){

    if(!this.hasBall) return;

    this.hasBall = false;
    this.isPassing = false;

    this.vx = 7;
    this.vy = 0;
}

// =========================
// PASAR
// =========================
pass(){

    if(!this.hasBall) return;

    this.hasBall = false;
    this.isPassing = true;

    this.passTarget = this.scene.teammate;

    let dx = this.passTarget.x - this.ball.x;
    let dy = this.passTarget.y - this.ball.y;

    let dist = Math.sqrt(dx * dx + dy * dy);

    this.vx = (dx / dist) * 6;
    this.vy = (dy / dist) * 6;
}
}

window.BallController = BallController;