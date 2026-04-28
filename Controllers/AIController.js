class AIController {

constructor(scene){
    this.scene = scene;
    this.keeperDir = 1;
}

create(){

    this.def1 = this.scene.def1;
    this.def2 = this.scene.def2;
    this.keeper = this.scene.keeper;
}

update(){

    let p = this.scene.mapPlayer;

    let angle = Phaser.Math.Angle.Between(
        this.def1.x,this.def1.y,
        p.x,p.y
    );

    this.def1.x += Math.cos(angle)*1.1;
    this.def1.y += Math.sin(angle)*1.1;

    this.def2.y += Math.sin(this.scene.time.now/300)*0.8;

    this.keeper.y += this.keeperDir * 1.4;

    if(this.keeper.y < 430) this.keeperDir = 1;
    if(this.keeper.y > 515) this.keeperDir = -1;
}
}