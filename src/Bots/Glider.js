/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,pointAfterRotation} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class Glider{
    constructor({x=0,y=20, angle=0, id, speed=1, targetObj, health= 15, damage=10}){
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

			movementAnimation: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:3, ctxDraw:ctxNPC,angle})
		};

		this.props.movementAnimation.setSheet({sheet:gameInstance.props.gliderMovementImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});
    }

    updateStats({speed=1,health= 15, damage=10, lazerTimer=120}){
        var p = this.props;
        p.speed = speed;
        p.health = health;
        p.damage = damage;
        p.lazerTimer = lazerTimer;
    }
	
	update({botManager}){
	    botManager.findClosestGoodGuyTarget({obj:this});
		this.acceleration();
		var p = this.props;
		
		p.movementAnimation.updateCords({x:this.props.x,y:this.props.y, angle:this.props.angle});
        p.movementAnimation.update({constLoop:true});

		this.generateLazer();
		this.checkPosition();
	}
	
	generateLazer(){
		let p = this.props
		if(p.lazerCount < p.lazerTimer){
			p.lazerCount++;
		}
		else{
			p.lazerCount = 0;
			let target = p.targetObj.props;
			
			let xw = p.x+p.hWidth;
			let yh = p.y+p.hHeight;
			let mainGun = pointAfterRotation( xw, yh, p.x + 23,p.y+12,  p.angle );
			
			
			// work out direction
			var dirY = (target.y+target.hHeight)-(mainGun.y);
			var dirX = (target.x+target.hWidth)-(mainGun.x);
			var angle = Math.atan2(dirY,dirX);

			// Normalize the direction
			var len = Math.sqrt(dirX * dirX + dirY * dirY);
			dirY /= len;
			dirX /= len;

			pSub.publish(globe.GENERATELAZER,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:4});
		}
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
		
		let speed = p.speed;

		var y = (p.targetObj.props.y+p.targetObj.props.hHeight) - (p.y+16);
		var x = (p.targetObj.props.x+p.targetObj.props.hWidth) - (p.x+16);
		p.angle = Math.atan2(y, x);
		
		var len = Math.sqrt(x * x + y * y);
	    x /= len;
		y /= len;
		
		p.x += p.dirX;
		p.y += p.dirY;
		
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){
			pSub.publish(globe.REMOVEGLIDER,{id:this.props.id, props:this.props});
			pSub.publish(globe.ADDANIMATION,{type:"gliderDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
			pSub.publish(globe.ADDTOSCORE,{amount:100});
            pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}
	
	
}