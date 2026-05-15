class AIController {

constructor(scene){
    this.scene = scene;
    this.speed = 1.2;
    this.keeperDir = 1;
}

create(){
    this.teammate = this.scene.teammate;
    this.def1 = this.scene.def1;
    this.def2 = this.scene.def2;
    this.keeper = this.scene.keeper;
}

update(){

    if(this.scene.isPaused) return;

    let ball = this.scene.ballController;

    // distancia jugador / defensor
    let d = Phaser.Math.Distance.Between(
        this.scene.logicPlayer.x,
        this.scene.logicPlayer.y,
        this.def1.x,
        this.def1.y
    );

    // liberar lock
    if(d > 90){
    this.scene.contactLock = false;
}

    // duelo
    if(
        d < 28 &&
        !this.scene.duelMode &&
        !this.scene.contactLock
    ){

        this.scene.contactLock = true;

        if(ball.owner === "player" && ball.hasBall){
            this.scene.openAttackMenu();
            return;
        }

        if(ball.owner === "cpu"){
            this.scene.openDuelMenu();
            return;
        }
    }

    this.moveTeammate();
    this.moveDefenders();
    this.moveKeeper();

    // this.checkSteal();
    this.checkSave();
}

// =========================
// COMPAÑERO
// =========================
moveTeammate(){

    let tx = this.scene.logicPlayer.x + 90;
    let ty = this.scene.logicPlayer.y - 40;

    this.moveToward(this.teammate, tx, ty, 1.2);
}

// =========================
// DEFENSORES
// =========================
moveDefenders(){

    let px = this.scene.logicPlayer.x;
    let py = this.scene.logicPlayer.y;

    this.moveToward(this.def1, px, py, 1.0);
    this.moveToward(this.def2, px + 80, py + 30, 0.8);
}

// =========================
// ARQUERO
// =========================
moveKeeper(){

    this.keeper.y += this.keeperDir * 1.4;

    if(this.keeper.y < 430) this.keeperDir = 1;
    if(this.keeper.y > 515) this.keeperDir = -1;
}

// =========================
// ROBOS SUELTOS
// =========================
checkSteal(){

    if(!this.scene.ballController.hasBall) return;

    let p = this.scene.logicPlayer;

    let d1 = Phaser.Math.Distance.Between(
        p.x, p.y,
        this.def1.x, this.def1.y
    );

    if(d1 < 18){
        this.scene.ballController.hasBall = false;
        this.scene.ballController.owner = "cpu";
        this.scene.ballController.cpuCarrier = this.def1;
    }
}

// =========================
// ATAJADAS
// =========================
checkSave(){

    if(this.scene.ballController.hasBall) return;

    let b = this.scene.logicBall;

    let d = Phaser.Math.Distance.Between(
        b.x, b.y,
        this.keeper.x, this.keeper.y
    );

    if(d < 22){
        this.scene.ballController.vx = -4;
        this.scene.ballController.vy = 0;
    }
}

// =========================
// UTILIDAD
// =========================
moveToward(obj, tx, ty, speed){

    let dx = tx - obj.x;
    let dy = ty - obj.y;

    let dist = Math.sqrt(dx*dx + dy*dy);

    if(dist > 2){
        obj.x += (dx / dist) * speed;
        obj.y += (dy / dist) * speed;
    }
}

}

window.AIController = AIController;