
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawRotateImage} from "../Libs/2dGameLib";

// GameInstance will be unique for every game, this is where all of the game specific logic will be, all of the default stuff I can reuse will be in the javascriptmain
export default class Missile{
    constructor({x=200,y=200, angle=0, id, speed=5, targetObj=undefined, dirX, dirY}){
        this.props = {
			missileImg: gameInstance.props.missileImg,
			id,
			x,
			y,
			angle,
			dirX,
			dirY,
			targetObj,
			speed,
			width:16,
			height:8,
			hWidth:8,
			hHeight:4,
			pierce:3,
			blunt:1,
			blast:5
		};
		this.setupMoveListeners();
    }

	setupMoveListeners(){
		pSub.subscribe(globe.CLEARTARGET,this.cleanTarget,this);
	}
	
	clearListeners(){

	}
	
	
	update(){ // loop through objects and call update on them.
		
		this.acceleration();
		DrawRotateImage(0,0,16,8,this.props.x,this.props.y,16,8,window.ctxNPC,this.props.missileImg,this.props.angle,this.props.x, this.props.y);
		
		this.checkPosition();
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVEMISSILE,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVEMISSILE,{id:this.props.id});
		}
	}
	
	acceleration(){
		let p = this.props;
		if(p.targetObj != undefined){
			let speed = p.speed;

			var y = (p.targetObj.props.y+p.targetObj.props.hHeight)  - (p.y+p.hHeight);
			var x = (p.targetObj.props.x+p.targetObj.props.hWidth) - (p.x+p.hWidth);
			p.angle = Math.atan2(y, x);
			
			var len = Math.sqrt(x * x + y * y);
			x /= len;
			y /= len;
			p.dirX = x;
			p.dirY = y;

			p.x += speed * x;
			p.y += speed * y;
		}
		else{
			this.accelerationNoTarget();
		}
	}
	
	accelerationNoTarget(){
		let p = this.props;
		if(!p.dirX){ // then there is no target or direction, remove the missile
			pSub.publish(globe.REMOVEMISSILE,{id:p.id});
			return;
		}

		let speed = p.speed;

		
		p.x += speed * p.dirX;
		p.y += speed * p.dirY;
	}
	
	cleanTarget(topic,{target}){
		if(this.props.targetObj === target){
			this.props.targetObj = undefined;
			
		}
	}
}