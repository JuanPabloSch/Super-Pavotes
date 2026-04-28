// REEMPLAZÁ scenes/GameScene.js COMPLETO
// NUEVO LAYOUT 3 PANELES

class GameScene extends Phaser.Scene {

constructor(){
    super("GameScene");
}

preload(){

    this.load.spritesheet('player','assets/player_run.png',{
        frameWidth:160,
        frameHeight:259
    });

}

create(){

    // =====================================
    // MEDIDAS PANTALLA
    // =====================================
    this.gameW = 800;
    this.gameH = 600;

    // paneles
    this.topH = 210;     // cinemática
    this.midH = 140;     // mensajes / menú
    this.botH = 250;     // radar grande

    // =====================================
    // FONDO GENERAL
    // =====================================
    this.add.rectangle(400,300,800,600,0x111111);

    // =====================================
    // PANEL SUPERIOR
    // =====================================
    this.add.rectangle(400,this.topH/2,800,this.topH,0x000000);

    this.bg1 = this.add.rectangle(400,105,800,210,0x2e8b57);
    this.bg2 = this.add.rectangle(1200,105,800,210,0x2e8b57);

    this.line1 = this.add.rectangle(400,105,6,210,0xffffff);
    this.line2 = this.add.rectangle(1200,105,6,210,0xffffff);

    // =====================================
    // PANEL MEDIO
    // =====================================
    this.midY = this.topH;

    this.add.rectangle(
        400,
        this.midY + this.midH/2,
        800,
        this.midH,
        0x1b1b1b
    );

    // =====================================
    // PANEL INFERIOR
    // =====================================
    this.botY = this.topH + this.midH;

    this.add.rectangle(
        400,
        this.botY + this.botH/2,
        800,
        this.botH,
        0x101010
    );

    // =====================================
    // PLAYER
    // =====================================
    this.anims.create({
        key:'run',
        frames:this.anims.generateFrameNumbers('player',{
            start:0,end:5
        }),
        frameRate:10,
        repeat:-1
    });

    this.player = this.add.sprite(250,145,'player');
    this.player.setScale(0.50);

    this.ball = this.add.circle(300,175,8,0xffffff);

    // =====================================
    // RADAR GRANDE
    // =====================================
    this.radarX = 70;
    this.radarY = this.botY + 25;
    this.radarW = 660;   // mismo largo aprox
    this.radarH = 190;   // más alto

    this.add.rectangle(
        this.radarX + this.radarW/2,
        this.radarY + this.radarH/2,
        this.radarW,
        this.radarH,
        0x228b22
    ).setStrokeStyle(2,0xffffff);

    // mitad cancha
    this.add.line(
        0,0,
        this.radarX + this.radarW/2,this.radarY,
        this.radarX + this.radarW/2,this.radarY+this.radarH,
        0xffffff
    );

    // arco derecho
    this.add.rectangle(
        this.radarX + this.radarW + 12,
        this.radarY + this.radarH/2,
        20,
        60
    ).setStrokeStyle(2,0xffffff);

    // =====================================
    // OBJETOS RADAR
    // =====================================
    this.mapPlayer = this.add.circle(220,this.radarY+95,8,0x00aaff);
    this.mapBall   = this.add.circle(235,this.radarY+95,5,0xffffff);

    this.def1 = this.add.circle(520,this.radarY+70,8,0xff3333);
    this.def2 = this.add.circle(620,this.radarY+130,8,0xff6666);

    this.keeper = this.add.rectangle(
        this.radarX + this.radarW + 3,
        this.radarY + 95,
        8,
        24,
        0xffff00
    );

    this.keeperDir = 1;

    // =====================================
    // UI
    // =====================================
    this.score = 0;

    this.scoreText = this.add.text(20,15,"GOLES: 0",{
        fontSize:"24px",
        fill:"#ffffff"
    });

    this.msg = this.add.text(
        400,
        this.midY + 50,
        "",
        {
            fontSize:"40px",
            fill:"#ffff00",
            fontStyle:"bold"
        }
    ).setOrigin(0.5);

    this.help = this.add.text(
        400,
        this.midY + 100,
        "SPACE = DISPARAR",
        {
            fontSize:"22px",
            fill:"#cccccc"
        }
    ).setOrigin(0.5);

    // =====================================
    // CONTROLES
    // =====================================
    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.facing = "right";
    this.speed = 2.6;

    this.hasBall = true;
    this.ballVX = 0;
    this.ballVY = 0;

    this.cooldown = false;

}

update(){

    let moving = false;

    // =====================================
    // PLAYER MOVE
    // =====================================
    if(this.cursors.right.isDown){
        this.mapPlayer.x += this.speed;
        this.facing = "right";
        this.player.setFlipX(false);
        moving = true;
    }

    if(this.cursors.left.isDown){
        this.mapPlayer.x -= this.speed;
        this.facing = "left";
        this.player.setFlipX(true);
        moving = true;
    }

    if(this.cursors.up.isDown){
        this.mapPlayer.y -= this.speed;
        moving = true;
    }

    if(this.cursors.down.isDown){
        this.mapPlayer.y += this.speed;
        moving = true;
    }

    // límites radar
    this.mapPlayer.x = Phaser.Math.Clamp(
        this.mapPlayer.x,
        this.radarX+8,
        this.radarX+this.radarW-8
    );

    this.mapPlayer.y = Phaser.Math.Clamp(
        this.mapPlayer.y,
        this.radarY+8,
        this.radarY+this.radarH-8
    );

    // =====================================
    // ANIMACIÓN ARRIBA
    // =====================================
    if(moving){

        this.player.play('run',true);

        if(this.facing==="right"){
            this.moveBg(-4);
        }else{
            this.moveBg(4);
        }

    }else{
        this.player.anims.stop();
        this.player.setFrame(0);
    }

    this.loopBg(this.bg1,this.line1);
    this.loopBg(this.bg2,this.line2);

    // =====================================
    // DISPARO
    // =====================================
    if(
        Phaser.Input.Keyboard.JustDown(this.spaceKey)
        && this.hasBall
    ){

        this.hasBall = false;

        let shot = 7;

        this.ballVX = (this.facing==="right") ? shot : -shot;
        this.ballVY = 0;

        if(this.cursors.up.isDown) this.ballVY = -shot;
        if(this.cursors.down.isDown) this.ballVY = shot;
    }

    // =====================================
    // BALÓN
    // =====================================
    if(this.hasBall){

        this.mapBall.x = this.mapPlayer.x + (this.facing==="right" ? 14 : -14);
        this.mapBall.y = this.mapPlayer.y;

    }else{

        this.mapBall.x += this.ballVX;
        this.mapBall.y += this.ballVY;

        this.ballVX *= 0.985;
        this.ballVY *= 0.985;

        let d = Phaser.Math.Distance.Between(
            this.mapPlayer.x,this.mapPlayer.y,
            this.mapBall.x,this.mapBall.y
        );

        if(d < 16){
            this.hasBall = true;
            this.ballVX = 0;
            this.ballVY = 0;
        }
    }

    // =====================================
    // DEFENSORES
    // =====================================
    this.moveDef1();
    this.moveDef2();

    this.checkSteal(this.def1);
    this.checkSteal(this.def2);

    // =====================================
    // ARQUERO
    // =====================================
    this.keeper.y += 1.4 * this.keeperDir;

    if(this.keeper.y < this.radarY+50) this.keeperDir = 1;
    if(this.keeper.y > this.radarY+140) this.keeperDir = -1;

    this.checkSave();
    this.checkGoal();

    // =====================================
    // BALÓN ARRIBA
    // =====================================
    let targetX = this.hasBall
        ? this.player.x + (this.facing==="right" ? 42 : -42)
        : this.player.x + (this.facing==="right" ? 80 : -80);

    this.ball.x = Phaser.Math.Linear(this.ball.x,targetX,0.15);
    this.ball.y = this.player.y + 38;

    if(!this.hasBall){
        this.ball.angle += 15;
    }else{
        this.ball.angle = 0;
    }

}

moveDef1(){

    let angle = Phaser.Math.Angle.Between(
        this.def1.x,this.def1.y,
        this.mapPlayer.x,this.mapPlayer.y
    );

    this.def1.x += Math.cos(angle)*1.2;
    this.def1.y += Math.sin(angle)*1.2;
}

moveDef2(){

    this.def2.y += Math.sin(this.time.now/300)*0.8;

    let d = Phaser.Math.Distance.Between(
        this.def2.x,this.def2.y,
        this.mapPlayer.x,this.mapPlayer.y
    );

    if(d < 110){

        let angle = Phaser.Math.Angle.Between(
            this.def2.x,this.def2.y,
            this.mapPlayer.x,this.mapPlayer.y
        );

        this.def2.x += Math.cos(angle)*0.9;
        this.def2.y += Math.sin(angle)*0.9;
    }

}

checkSteal(enemy){

    if(this.cooldown) return;
    if(!this.hasBall) return;

    let d = Phaser.Math.Distance.Between(
        enemy.x,enemy.y,
        this.mapPlayer.x,this.mapPlayer.y
    );

    if(d < 16){

        this.cooldown = true;
        this.hasBall = false;

        this.mapBall.x = enemy.x + 10;
        this.mapBall.y = enemy.y;

        this.ballVX = -3;
        this.ballVY = Phaser.Math.Between(-1,1);

        this.msg.setText("ROBO!");

        this.time.delayedCall(800,()=>{
            this.msg.setText("");
            this.cooldown = false;
        });
    }

}

checkSave(){

    if(this.hasBall) return;

    let hit =
        Math.abs(this.mapBall.x - this.keeper.x) < 10 &&
        Math.abs(this.mapBall.y - this.keeper.y) < 16;

    if(hit){

        this.ballVX = -4;
        this.ballVY = Phaser.Math.Between(-2,2);

        this.msg.setText("ATAJÓ!");

        this.time.delayedCall(700,()=>{
            this.msg.setText("");
        });
    }

}

checkGoal(){

    let goalX = this.radarX + this.radarW;
    let top = this.radarY + 65;
    let bottom = this.radarY + 125;

    if(
        this.mapBall.x >= goalX &&
        this.mapBall.y >= top &&
        this.mapBall.y <= bottom
    ){

        this.score++;
        this.scoreText.setText("GOLES: " + this.score);

        this.msg.setText("GOOOOL!");

        this.time.delayedCall(1200,()=>{
            this.msg.setText("");
            this.resetPlay();
        });
    }

}

resetPlay(){

    this.mapPlayer.x = 220;
    this.mapPlayer.y = this.radarY+95;

    this.mapBall.x = 235;
    this.mapBall.y = this.radarY+95;

    this.def1.x = 520;
    this.def1.y = this.radarY+70;

    this.def2.x = 620;
    this.def2.y = this.radarY+130;

    this.hasBall = true;
    this.ballVX = 0;
    this.ballVY = 0;
}

moveBg(v){

    this.bg1.x += v;
    this.bg2.x += v;
    this.line1.x += v;
    this.line2.x += v;
}

loopBg(bg,line){

    if(bg.x < -400){
        bg.x = 1200;
        line.x = 1200;
    }

    if(bg.x > 1200){
        bg.x = -400;
        line.x = -400;
    }

}

}

window.GameScene = GameScene;