
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawImage} from "../Libs/2dGameLib";

// GameInstance will be unique for every game, this is where all of the game specific logic will be, all of the default stuff I can reuse will be in the javascriptmain
export default class Blast{
    constructor({x=200,y=200, angle=0, id}){
        this.props = {
			blastSprite: gameInstance.props.blastSprite,
			id,
			x,
			y,
			angle,
			speed:1,
			width:64,
			height:64,
			hWidth:32,
			hHeight:32,
			posX:0,
			posY:0,
			frames:6,
			frame:0,
			
			frameTimer: 0,
			frameTick: 3,
			// damage types?
			pierce:1,
			blunt:1,
			blast:1,
			
			active: true
		};
		this.setupMoveListeners();
    }

	setupMoveListeners(){
		
	}
	
	
	update(){ // loop through objects and call update on them.
		if(this.props.frame <= this.props.frames){
			this.acceleration();
			DrawImage(this.props.posX,this.props.posY,this.props.width,this.props.height,this.props.x,this.props.y,this.props.width,this.props.height,window.ctxAnimation,this.props.blastSprite);
		}
		else{ // remove explosion
			pSub.publish(globe.REMOVEBLAST,{id:this.props.id});
		}
	}
	
	acceleration(){
		// move through the blast animations
		if(this.props.frameTimer < this.props.frameTick){
			this.props.frameTimer++;
			this.props.active = false;
		}
		else{
			this.props.frameTimer = 0;
			this.props.posX += this.props.width;
			this.props.frame++;
			this.props.active = true;
		}
		
		
	}
	
	cleanTarget(topic,{target}){
		if(this.props.targetObj === target){ // object is no more, so just fly solo
			this.props.targetObj = undefined;
			
		}
	}
}