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
    if(d > 45){
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
// =========================
// DEFENSORES (CON VELOCIDAD REDUCIDA PARA TESTEO)
// =========================
moveDefenders(){
    let ball = this.scene.ballController;
    
    // Por defecto, asumimos que el objetivo es el jugador
    let targetX = this.scene.logicPlayer.x;
    let targetY = this.scene.logicPlayer.y;

    // SI LA PELOTA ESTÁ SUELTA (En un pase, tiro o rebote)
    if (!ball.hasBall && ball.owner === "player") {
        targetX = this.scene.logicBall.x;
        targetY = this.scene.logicBall.y;
    }
    
    // SI LA CPU TIENE LA PELOTA
    if (ball.owner === "cpu") {
        this.moveToward(this.def1, this.def1.x, this.def1.y, 0); 
        
        // ANTES: 0.8 -> AHORA: 0.4 (El defensor 2 te presiona más lento)
        this.moveToward(this.def2, this.scene.logicBall.x - 30, this.scene.logicBall.y + 20, 0.4);
        return;
    }

    // MOVIMIENTO NORMAL DE MARCA (Cuando el jugador tiene la pelota)
    
    // ANTES: 1.0 -> AHORA: 0.5 (El Defensor 1 va al trote hacia vos)
    this.moveToward(this.def1, targetX, targetY, 0.5);
    
    // ANTES: 0.8 -> AHORA: 0.4 (El Defensor 2 se escalona más lento)
    this.moveToward(this.def2, targetX + 60, targetY + 30, 0.4);
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