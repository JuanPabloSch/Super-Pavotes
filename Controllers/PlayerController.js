class PlayerController {

constructor(scene){
    this.scene = scene;
    this.speed = 2.6;
    this.moving = false;
    this.facing = "right";
}

create(){
    this.sprite = this.scene.player;
    this.logic = this.scene.logicPlayer;
    this.cursors = this.scene.cursors;
}

update(){
    // 1. REEMPLAZÁS EL COMIENZO CON ESTO:
    if(this.scene.isPaused) {
        this.sprite.anims.stop();
        this.sprite.setFrame(0);
        return;
    }

    let dx = 0;
    let dy = 0;
    this.moving = false;

    if(this.cursors.up.isDown){
        dy = -this.speed;
        this.moving = true;
    }

    if(this.cursors.down.isDown){
        dy = this.speed;
        this.moving = true;
    }

    if(this.cursors.left.isDown){
        dx = -this.speed;
        this.facing = "left";
        this.moving = true;
    }

    if(this.cursors.right.isDown){
        dx = this.speed;
        this.facing = "right";
        this.moving = true;
    }

    // <-- ACÁ ESTABA EL BLOQUE DUPLICADO QUE TENÉS QUE BORRAR completamente

    // =========================
    // MOVIMIENTO REAL (LOGIC)
    // =========================
    this.logic.x += dx;
    this.logic.y += dy;

    this.logic.x = Phaser.Math.Clamp(this.logic.x, 78, 722);
    this.logic.y = Phaser.Math.Clamp(this.logic.y, 383, 557);

    // =========================
    // SPRITE FIJO
    // =========================
    this.sprite.x = 400;
    this.sprite.y = 110;

    this.sprite.setFlipX(this.facing === "left");

    if(this.moving){
        this.sprite.play('run', true);
    } else {
        this.sprite.anims.stop();
        this.sprite.setFrame(0);
    }


    // =========================
    // MOVIMIENTO REAL (LOGIC)
    // =========================
    this.logic.x += dx;
    this.logic.y += dy;

    this.logic.x = Phaser.Math.Clamp(this.logic.x, 78, 722);
    this.logic.y = Phaser.Math.Clamp(this.logic.y, 383, 557);

    // =========================
    // SPRITE FIJO
    // =========================
    this.sprite.x = 400;
    this.sprite.y = 110;

    this.sprite.setFlipX(this.facing === "left");

    if(this.moving){
        this.sprite.play('run', true);
    } else {
        this.sprite.anims.stop();
        this.sprite.setFrame(0);
    }
}
}