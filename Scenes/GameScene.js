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

    // =========================
    // CONFIG
    // =========================
    this.speed = 2.6;
    this.facing = "right";
    
    // =========================
    // INPUT
    // =========================
    this.cursors = this.input.keyboard.createCursorKeys();

    // =========================
    // ANIM
    // =========================
    this.anims.create({
        key:'run',
        frames:this.anims.generateFrameNumbers('player',{start:0,end:5}),
        frameRate:10,
        repeat:-1
    });
    this.radarField = this.add.rectangle(
    410, 490,
    660,
    190,
    0x1f7a1f
).setStrokeStyle(2, 0xffffff);
    // =========================
    // WORLD (VISUAL)
    // =========================
    this.bg1 = this.add.rectangle(400,105,800,210,0x2e8b57);
    this.bg2 = this.add.rectangle(1200,105,800,210,0x2e8b57);

    this.line1 = this.add.rectangle(400,105,6,210,0xffffff);
    this.line2 = this.add.rectangle(1200,105,6,210,0xffffff);

    this.teammate = this.add.circle(340,430,8,0x44ddff);
    this.def1 = this.add.circle(520,430,8,0xff3333);
    this.def2 = this.add.circle(620,520,8,0xff6666);
    this.keeper = this.add.rectangle(733,470,8,24,0xffff00);

    this.mapBall = this.add.circle(235,470,5,0xffffff);

    // =========================
    // LOGIC (RADAR / POSICIÓN REAL)
    // =========================
    this.logicPlayer = { x: 220, y: 470 };
    this.logicBall = { x: 235, y: 470 };

    this.mapPlayer = this.add.circle(220,470,8,0x00aaff);

    // =========================
    // SPRITE FIJO (CAMARA)
    // =========================
    this.player = this.add.sprite(400,110,'player').setScale(0.7);

    // =========================
    // UI
    // =========================
    this.score = 0;
    this.scoreText = this.add.text(20,15,"GOLES: 0",{fontSize:"24px",fill:"#fff"});
    this.aiController = new AIController(this);
    this.aiController.create();
    // =========================
    // CONTROLLERS
    // =========================
    this.playerController = new PlayerController(this);
    this.ballController = new BallController(this, this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE));

        // =========================
    // PEGAR EN GameScene create()
    // =========================
    this.isPaused = false;
    this.duelMode = false;

    this.playerStun = 0;
    this.cpuStun = 0;

    this.duelOptions = ["TACKLEAR", "HACER FRENTE"];
    this.duelIndex = 0;

    this.menuText = this.add.text(
        60, 245, "",
        { fontSize:"24px", fill:"#ffffff" }
    );

    this.commentText = this.add.text(
        420, 245, "",
        { fontSize:"22px", fill:"#ffff66" }
    );

    this.enterKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.duelCooldown = 0;
    this.playerController.create();
    this.ballController.create();
    this.uiController = new UIController(this);
    this.uiController.create();
}

update(){

        // =========================
    // PEGAR EN GameScene update()
    // al principio de todo
    // =========================
    if(this.playerStun > 0) this.playerStun--;
    if(this.cpuStun > 0) this.cpuStun--;

    if(this.duelMode){
        this.handleDuelMenu();
        return;
    }

    this.playerController.update();
    this.ballController.update();
    this.aiController.update();
    this.uiController.update();
    // =========================
    // RADAR UPDATE (IMPORTANTE)
    // =========================
    this.mapPlayer.x = this.logicPlayer.x;
    this.mapPlayer.y = this.logicPlayer.y;

    this.mapBall.x = this.logicBall.x;
    this.mapBall.y = this.logicBall.y;

    this.checkGoal();
    this.moveBg();

    if(this.duelCooldown > 0){
    this.duelCooldown--;
}
}

// =========================
// GOLES
// =========================
checkGoal(){

    if(
        this.logicBall.x > 730 &&
        this.logicBall.y > 440 &&
        this.logicBall.y < 500
    ){
        this.score++;
        this.scoreText.setText("GOLES: " + this.score);
        this.resetPlay();
    }
}

// =========================
// PEGAR EN GameScene class
// =========================
openDuelMenu(){
    this.duelMode = true;
    this.isPaused = true;
    this.menuType = "defense"; // <-- Forzamos que por defecto sea defensa si entra acá
    this.duelIndex = 0;
    this.contactLock = false;

    this.duelOptions = ["TACKLEAR", "HACER FRENTE"]; // <-- Aseguramos las opciones defensivas

    this.commentText.setText("¡ENFRENTAMIENTO!");
    this.drawDuelMenu();
}

drawDuelMenu(){

    let txt = "";

    for(let i=0;i<this.duelOptions.length;i++){

        if(i === this.duelIndex){
            txt += "▶ " + this.duelOptions[i] + "\n";
        }else{
            txt += "   " + this.duelOptions[i] + "\n";
        }
    }

    this.menuText.setText(txt);
}

handleDuelMenu(){

    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        this.duelIndex--;
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        this.duelIndex++;
    }

    if(this.duelIndex < 0){
        this.duelIndex = this.duelOptions.length - 1;
    }

    if(this.duelIndex >= this.duelOptions.length){
        this.duelIndex = 0;
    }

    this.drawDuelMenu();

    if(Phaser.Input.Keyboard.JustDown(this.enterKey)){
        this.resolveDuel();
    }
}

// =========================
// REEMPLAZAR resolveDuel()
// =========================
resolveDuel(){

    let action = this.duelOptions[this.duelIndex];
    let roll = Math.random();

    // =====================================
    // MENU OFENSIVO
    // =====================================
    if(this.menuType === "attack"){

        if(action === "ESQUIVAR"){

            if(roll < 0.55){

                this.commentText.setText("¡LO PASASTE!");

                this.logicPlayer.x += 55;
                this.def1.x -= 35;
                this.cpuStun = 90;
                

            }else{

                this.commentText.setText("¡TE LA ROBARON!");

                this.ballController.hasBall = false;
                this.ballController.owner = "cpu";
                this.ballController.cpuCarrier = this.def1;

                this.playerStun = 90;
            }
        }

        if(action === "PASAR"){

            this.commentText.setText("¡BUEN PASE!");
            this.ballController.pass();
        }
    }

    // =====================================
    // MENU DEFENSIVO
    // =====================================
    if(this.menuType === "defense"){

        if(action === "TACKLEAR"){

            if(roll < 0.55){

                this.commentText.setText("¡ROBÓ LA PELOTA!");

                this.ballController.owner = "player";
                this.ballController.hasBall = true;
                this.ballController.cpuCarrier = null;

                this.cpuStun = 120;

            }else{

                this.commentText.setText("¡TE SUPERÓ!");
                this.playerStun = 120;
            }
        }

        if(action === "HACER FRENTE"){

            if(roll < 0.45){

                this.commentText.setText("¡RECUPERASTE!");

                this.ballController.owner = "player";
                this.ballController.hasBall = true;
                this.ballController.cpuCarrier = null;

                this.cpuStun = 90;

            }else{

                this.commentText.setText("PASÓ DE LARGO");
                this.playerStun = 60;
            }
        }
    this.duelCooldown = 90;

    }

    this.duelMode = false;
    this.isPaused = false;
    this.menuText.setText("");
}

resetPlay(){

    this.logicPlayer.x = 220;
    this.logicPlayer.y = 470;

    this.logicBall.x = 235;
    this.logicBall.y = 470;

    this.ballController.hasBall = true;
}
// =========================
// PEGAR EN GameScene class
// NUEVA FUNCIÓN
// =========================
    openAttackMenu(){

        this.duelMode = true;
        this.isPaused = true;

        this.menuType = "attack";
        this.duelIndex = 0;

        this.duelOptions = [
            "ESQUIVAR",
            "PASAR"
        ];

        this.commentText.setText("¡TE MARCAN!");
        this.drawDuelMenu();
    }
    // =========================
    // SCROLL BACKGROUND (VISUAL ONLY)
    // =========================
    moveBg(){

    let v = this.playerController.moving ? -4 : 0;

    this.bg1.x += v;
    this.bg2.x += v;
    this.line1.x += v;
    this.line2.x += v;

    // =========================
    // LOOP INFINITO
    // =========================
    if(this.bg1.x <= -400){
        this.bg1.x = this.bg2.x + 800;
        this.line1.x = this.line2.x + 800;
    }

    if(this.bg2.x <= -400){
        this.bg2.x = this.bg1.x + 800;
        this.line2.x = this.line1.x + 800;
    }
}
}

window.GameScene = GameScene;