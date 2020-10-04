/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,pointAfterRotation} from "../Libs/2dGameLib";

export default class Controller{
    constructor({x=0,y=20, angle=0, id, speed=1, targetObj, health= 55, damage=10}){
        this.props = {
			gliderImg: gameInstance.props.gliderImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			width:32,
			height:32,
			hWidth:16,
			hHeight:16,
			health,
			damage,
			
			lazerTimer:120,
			lazerCount:0,
			
			glidTimer:240,
			glidCount:241,
			locX:0,
			locY:0,
			dirX:0,
			dirY:0,
			
			top: 30,
			bottom: globe.mapHeight - 30,
			left: 30,
			right: globe.mapWidth - 30,
		};
		
    }

	
	update(){
		this.acceleration();
		var p = this.props;
		
		DrawRotateImage(0,0,32,32,(this.props.x),(this.props.y),32,32,window.ctxNPC,this.props.gliderImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		
		this.targetComet();
		
		this.checkPosition();
	}
	
	targetComet(){
		//todo do we have a comet yet? if not, then target one
		
		//todo then send it at the player.
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVEGLIDER,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVEGLIDER,{id:this.props.id});
		}
	}
	
	acceleration(){
		// move me !
		let p = this.props;
		
		if(p.glidCount < p.glidTimer){
				p.glidCount++;
		}
		else{
			
			p.glidCount = 0;
			p.locX = Math.floor((Math.random() * (globe.mapWidth-100)) + 50);
			p.locY = Math.floor((Math.random() * (globe.mapHeight-100)) + 50);
			
			var y = p.locY - (p.y+16);
			var x = p.locX - (p.x+16);
			
			var len = Math.sqrt(x * x + y * y);
			x /= len;
			y /= len;
			
			p.dirX = p.speed * x;
			p.dirY = p.speed * y;
		}
		
		// Set the speed (move 100 pixels per second)
		let speed = p.speed;

		var y = p.targetObj.props.y - (p.y+16);
		var x = p.targetObj.props.x - (p.x+16);
		p.angle = Math.atan2(y, x);
		
		var len = Math.sqrt(x * x + y * y);
	    x /= len;
		y /= len;
		
		
		p.x += p.dirX;
		p.y += p.dirY;
		
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){ // im dead
			pSub.publish(globe.REMOVEGLIDER,{id:this.props.id});
			// add to score?
			pSub.publish(globe.ADDTOSCORE,{amount:100});

		}
	}
	
	
}