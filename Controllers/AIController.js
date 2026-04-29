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

    this.moveTeammate();
    this.moveDefenders();
    this.moveKeeper();

    this.checkSteal();
    this.checkSave();
}

// =========================
// COMPAÑERO
// =========================

moveTeammate(){

    let targetX = this.scene.logicPlayer.x + 90;
    let targetY = this.scene.logicPlayer.y - 40;

    this.moveToward(this.teammate, targetX, targetY, 1.2);
}

// =========================
// DEFENSORES
// =========================
moveDefenders(){

    let px = this.scene.logicPlayer.x;
    let py = this.scene.logicPlayer.y;

    this.moveToward(this.def1, px, py, 1.0);

    // segundo defensor cubre zona
    this.moveToward(this.def2, px + 80, py + 30, 0.8);
}

// =========================
// ARQUERO
// =========================
moveKeeper(){

    this.keeper.y += this.keeperDir * 1.4;

    if(this.keeper.y < 430){
        this.keeperDir = 1;
    }

    if(this.keeper.y > 515){
        this.keeperDir = -1;
    }
}

checkSteal(){

    if(!this.scene.ballController.hasBall) return;

    let p = this.scene.logicPlayer;

    let d1 = Phaser.Math.Distance.Between(
        p.x, p.y,
        this.def1.x, this.def1.y
    );

    let d2 = Phaser.Math.Distance.Between(
        p.x, p.y,
        this.def2.x, this.def2.y
    );

    if(d1 < 20 || d2 < 20){

        this.scene.ballController.hasBall = false;

        this.scene.logicBall.x = p.x - 20;
        this.scene.logicBall.y = p.y;

        this.scene.ballController.vx = -3;
        this.scene.ballController.vy = 0;
    }
}

checkSave(){

    if(this.scene.ballController.hasBall) return;

    let b = this.scene.logicBall;

    let dist = Phaser.Math.Distance.Between(
        b.x, b.y,
        this.keeper.x, this.keeper.y
    );

    if(dist < 22){

        this.scene.ballController.vx = -4;
        this.scene.ballController.vy = Phaser.Math.Between(-2,2);
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