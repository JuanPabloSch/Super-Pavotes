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

    // abrir menú
    if(
        Phaser.Input.Keyboard.JustDown(this.enterKey)
        && !this.menuOpen
    ){
        this.openMenu();
    }

    if(!this.menuOpen) return;

    // navegar
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

    // cerrar
    if(Phaser.Input.Keyboard.JustDown(this.escKey)){
        this.closeMenu();
    }

    // elegir
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