class UIController {

constructor(scene){
    this.scene = scene;

    this.menuOpen = false;
    this.menuIndex = 0;

    this.options = [
        "PATEAR",
        "PASAR"
    ];
}

create(){

    this.enterKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.spaceKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.escKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this.cursors = this.scene.cursors;

    this.text = this.scene.add.text(
        40, 240, "",
        {
            fontSize:"28px",
            fill:"#ffffff"
        }
    );
}

update(){

    // SI ESTÁ EN DUELO, EL MENÚ MANUAL NO DEBE HACER NADA
    if (this.scene.duelMode) return; 

    // ABRE EL MENÚ MANUAL (Solo si tenés la pelota y no está abierto ya)
    if(
        Phaser.Input.Keyboard.JustDown(this.enterKey)
        && !this.menuOpen
    ){
        let ball = this.scene.ballController;

        if (ball.hasBall && ball.owner === "player") {
            this.openMenu();
        }
    }

    // SI EL MENÚ NO ESTÁ ABIERTO, SE DETIENE ACÁ (No lee las flechas ni el espacio)
    if(!this.menuOpen) return;

    // NAVEGAR OPCIONES
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        this.menuIndex--;
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        this.menuIndex++;
    }

    if(this.menuIndex < 0){
        this.menuIndex = this.options.length - 1;
    }

    if(this.menuIndex >= this.options.length){
        this.menuIndex = 0;
    }

    this.draw();

    // CERRAR CON ESC
    if(Phaser.Input.Keyboard.JustDown(this.escKey)){
        this.closeMenu();
    }

    // ELEGIR OPCIÓN CON ESPACIO
    if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){

        let op = this.options[this.menuIndex];

        if(op === "PATEAR"){
            this.scene.ballController.shoot();
        }

        if(op === "PASAR"){
            this.scene.ballController.pass();
        }

        this.closeMenu();
    }
}

openMenu(){

    this.menuOpen = true;
    this.menuIndex = 0;

    this.scene.isPaused = true;

    this.draw();
}

closeMenu(){

    this.menuOpen = false;
    this.text.setText("");

    this.scene.isPaused = false;
}

draw(){

    let txt = "";

    for(let i=0;i<this.options.length;i++){

        if(i === this.menuIndex){
            txt += "▶ " + this.options[i] + "\n";
        }else{
            txt += "   " + this.options[i] + "\n";
        }
    }

    this.text.setText(txt);
}
}

window.UIController = UIController;