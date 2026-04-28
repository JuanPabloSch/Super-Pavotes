class UIController {

constructor(scene){
    this.scene = scene;
    this.menuOpen = false;
    this.menuIndex = 0;

    this.options = ["DRIBLAR","PATEAR","PASAR"];
}

create(){

    this.menuText = this.scene.menuText;
    this.commentText = this.scene.commentText;

    this.cursors = this.scene.cursors;
    this.enterKey = this.scene.enterKey;
    this.escKey = this.scene.escKey;
    this.spaceKey = this.scene.spaceKey;
}

update(){

    if(Phaser.Input.Keyboard.JustDown(this.enterKey)){
        this.menuOpen = !this.menuOpen;
        this.commentText.setText("¿Qué harás?");
    }

    if(!this.menuOpen) return;

    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        this.menuIndex--;
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        this.menuIndex++;
    }

    if(this.menuIndex < 0) this.menuIndex = this.options.length-1;
    if(this.menuIndex >= this.options.length) this.menuIndex = 0;

    let txt = "";

    for(let i=0;i<this.options.length;i++){
        txt += (i===this.menuIndex ? "▶ " : "   ") + this.options[i] + "\n";
    }

    this.menuText.setText(txt);

    if(Phaser.Input.Keyboard.JustDown(this.escKey)){
        this.menuOpen = false;
        this.menuText.setText("");
    }

    if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){

        let opt = this.options[this.menuIndex];

        if(opt==="DRIBLAR"){
            this.scene.mapPlayer.x += 45;
        }

        if(opt==="PASAR"){
            this.scene.ballController.hasBall = true;
        }

        if(opt==="PATEAR"){
            this.scene.ballController.hasBall = false;
            this.scene.ballController.vx = 7;
        }

        this.menuOpen = false;
        this.menuText.setText("");
    }
}
}