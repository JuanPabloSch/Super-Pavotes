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
    // SI ESTÁ EN DUELO, SE FRENA LA PELOTA
    if(this.scene.duelMode) return;

    // =========================
    // POSESIÓN CPU
    // =========================
    if(this.owner === "cpu"){
        this.cpuPlay();
        return;
    }

    // =========================
    // CON PELOTA (JUGADOR)
    // =========================
    if(this.hasBall){
        // Usamos logicPlayer para que la pelota vaya al radar
        this.ball.x = this.scene.logicPlayer.x + 14;
        this.ball.y = this.scene.logicPlayer.y;
    }

    // =========================
    // SIN PELOTA (PASE O TIRO)
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
        // LLEGADA DEL PASE (En BallController.js)
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

                // ---------------------------------------------------------
                // ¡SOLUCIÓN AQUÍ! Limpiamos los textos de la pantalla 
                // y liberamos el candado de contacto para que la CPU pueda marcarte al toque
                this.scene.commentText.setText(""); 
                this.scene.contactLock = false;
                this.scene.duelCooldown = 0;
                // ---------------------------------------------------------

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
        // RECUPERA JUGADOR (Solo si no está stunned)
        // =====================
        if(this.scene.playerStun === 0) {
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

    // 1. SI LA CPU ESTÁ STUNNED (Mareada porque la gambeteaste)
    // Mantiene la pelota pegada a su cuerpo pero NO avanza ni genera duelos
    if(this.scene.cpuStun > 0){
        this.ball.x = this.cpuCarrier.x - 12;
        this.ball.y = this.cpuCarrier.y;
        return;
    }

    // 2. SI EL JUGADOR ESTÁ STUNNED
    // La CPU ignora los duelos (pasa por al lado) y sigue avanzando libremente
    if (this.scene.playerStun === 0) {
        
        // Si el jugador NO está mareado, calculamos la distancia para ver si hay duelo
        let d = Phaser.Math.Distance.Between(
            this.scene.logicPlayer.x,
            this.scene.logicPlayer.y,
            this.cpuCarrier.x,
            this.cpuCarrier.y
        );

        if(d < 28 && !this.scene.duelMode && !this.scene.contactLock){
            this.scene.contactLock = true; 
            this.scene.openDuelMenu(); 
            return;
        }
    }

    // ==========================================
    // 3. MOVIMIENTO DE AVANCE DE LA CPU
    // ==========================================
    // El portador de la pelota de la CPU corre hacia la izquierda (tu arco)
    this.cpuCarrier.x -= 1.8; // Podés ajustar este número para cambiar su velocidad

    // La pelota sigue perfectamente el punto del rival en el radar
    this.ball.x = this.cpuCarrier.x - 12;
    this.ball.y = this.cpuCarrier.y;

    // ==========================================
    // 4. CONDICIÓN DE GOL DE LA CPU
    // ==========================================
    // Si el rival llega al extremo izquierdo del radar, mete gol
    if(this.cpuCarrier.x < 80){
        console.log("¡GOL DE LA CPU!");
        
        // Reiniciamos la jugada como en el Captain Tsubasa original
        this.scene.resetPlay();

        this.owner = "player";
        this.hasBall = true;
        this.cpuCarrier = null;
    }
}
}

window.BallController = BallController;