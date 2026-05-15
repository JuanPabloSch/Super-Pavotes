class BallController {

constructor(scene, spaceKey){
    this.scene = scene;
    this.spaceKey = spaceKey;

    this.hasBall = true;
    this.owner = "player";
    this.cpuCarrier = null;

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

    // =========================
    // POSESIÓN CPU
    // =========================
    if(this.owner === "cpu"){
        this.cpuPlay();
        return;
    }

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

        // fricción normal
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

                // cambiás al receptor
                this.scene.logicPlayer.x = this.passTarget.x;
                this.scene.logicPlayer.y = this.passTarget.y;

                // viejo queda de apoyo
                this.scene.teammate.x = oldX;
                this.scene.teammate.y = oldY;

                this.vx = 0;
                this.vy = 0;

                return;
            }
        }

        // =====================
        // RECUPERA JUGADOR
        // =====================
        let dPlayer = Phaser.Math.Distance.Between(
            this.ball.x,
            this.ball.y,
            this.scene.logicPlayer.x,
            this.scene.logicPlayer.y
        );

        if(dPlayer < 16){
            this.hasBall = true;
            this.owner = "player";
            this.vx = 0;
            this.vy = 0;
            return;
        }

        // =====================
        // RECUPERA CPU
        // =====================
        let dDef1 = Phaser.Math.Distance.Between(
            this.ball.x,
            this.ball.y,
            this.scene.def1.x,
            this.scene.def1.y
        );

        if(dDef1 < 16){
            this.hasBall = false;
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
    this.owner = "player";

    this.isPassing = false;
    this.cpuCarrier = null;

    this.vx = 7;
    this.vy = 0;
}

// =========================
// PASAR
// =========================
pass(){

    if(!this.hasBall) return;

    this.hasBall = false;
    this.owner = "player";

    this.isPassing = true;
    this.cpuCarrier = null;

    this.passTarget = this.scene.teammate;

    let dx = this.passTarget.x - this.ball.x;
    let dy = this.passTarget.y - this.ball.y;

    let dist = Math.sqrt(dx * dx + dy * dy);

    this.vx = (dx / dist) * 6;
    this.vy = (dy / dist) * 6;
}

// =========================
// JUEGA LA CPU
// =========================
// REEMPLAZAR cpuPlay()
// en BallController
// =========================
cpuPlay(){
    if(!this.cpuCarrier){
        this.owner = "player";
        this.hasBall = true;
        return;
    }

    // stun cpu
    if(this.scene.cpuStun > 0){
        this.ball.x = this.cpuCarrier.x - 12;
        this.ball.y = this.cpuCarrier.y;
        return;
    }

    // si jugador cerca -> duelo
    let d = Phaser.Math.Distance.Between(
        this.scene.logicPlayer.x,
        this.scene.logicPlayer.y,
        this.cpuCarrier.x,
        this.cpuCarrier.y
    );

    if(d < 28 && !this.scene.duelMode && !this.scene.contactLock){
        this.scene.contactLock = true; // Bloqueamos contactos para que no repita
        this.scene.openDuelMenu(); 
        return;
    }

    // avanzar
    this.cpuCarrier.x -= 2.2;

    this.ball.x = this.cpuCarrier.x - 12;
    this.ball.y = this.cpuCarrier.y;

    // gol cpu
    if(this.cpuCarrier.x < 80){
        this.scene.resetPlay();

        this.owner = "player";
        this.hasBall = true;
        this.cpuCarrier = null;
    }
}
}

window.BallController = BallController;