/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder, pointAfterRotation} from "../Libs/2dGameLib";

export default class Comet{
    constructor({x=0,y=20, angle=0, id, speed=1, health= 200, damage=5}){
        this.props = {
			cometImg: gameInstance.props.cometImg,
			id,
			x,
			y,
			angle,
			speed,
			width:32, 
			height:32, 
			hWidth:16, 
			hHeight:16,
			health,
			damage,
			dirX: 0,
			dirY: 0,
		};
		
		let result = {};
		// work out which axis we need to align to based on the starting position
		if(this.props.x  < 0){ // left
			result = this.getRandomStartCords(2);
		}
		else if(this.props.x > globe.mapWidth){ // right
			result = this.getRandomStartCords(1);
		}
		else if(this.props.y < 0){
			result = this.getRandomStartCords(4);
		}
		else{
			result = this.getRandomStartCords(3);
		}
		
		
		result = this.getDirectionMovements(result);
		
		this.props.dirY = result.dirY;
		this.props.dirX = result.dirX;
    }

	getDirectionMovements({tarX,tarY}){
		let p = this.props;
		var dirX = (tarX)-(p.x);
		var dirY = (tarY)-(p.y);

		var len = Math.sqrt(dirX * dirX + dirY * dirY);
		dirY /= len;
		dirX /= len;
		
		return {dirX,dirY}
	}
	
	getRandomStartCords(side){
		var x = 0,
			y = 0;
			
		var rand = Math.random();
		
		if(side == 1){ // left
			x = -20;
			y = Math.floor((rand * globe.mapHeight) + 1);
		}
		else if(side == 2){ // right
			x = globe.mapWidth+20;
			y = Math.floor((rand * globe.mapHeight) + 1);
		}
		else if(side == 3){ // top
			y = -20;
			x = Math.floor((rand * globe.mapWidth) + 1);
		}
		else if(side == 4){
			y = globe.mapHeight+20;
			x = Math.floor((rand * globe.mapWidth) + 1);
		}
		return {tarX:x,tarY:y};
	}
	
	update(){
		this.acceleration();
		var p = this.props;
	
		DrawRotateImage(0,0,p.width,p.height,(this.props.x),(this.props.y),p.width,p.height,window.ctxNPC,this.props.cometImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		p.angle+= .01;
		if(p.angle > 355){
			p.angle = 0;
		}
		
		this.checkPosition();
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVECOMET,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVECOMET,{id:this.props.id});
		}
	}
	
	acceleration(){ // just want him to move around the outside of the map, simple, keeps firing and generating more dashers.
		let p = this.props;

		p.y += p.dirY * p.speed;
		p.x += p.dirX * p.speed;
	}
	
}
