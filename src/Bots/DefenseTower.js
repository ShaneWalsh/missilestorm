/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,pointAfterRotation,drawLine} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class DefenseTower{
    constructor({x=0,y=20, angle=0, id, speed=1, targetObj, health= 150, damage=11}){
        this.props = {
			gliderImg: gameInstance.props.defenseTowerImg,
			towerBaseImg: gameInstance.props.towerBaseImg,
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
			maxHealth: health,
			damage,
			
			lazerTimer:80,
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

		this.props.movementAnimation.setSheet({sheet:gameInstance.props.defenseTowerImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});
    }

    restoreHealth(){
        this.props.health += 25;
        if(this.props.maxHealth < this.props.health){
            this.props.health = this.props.maxHealth;
        }
    }

    updateStats({health= 15, damage=10, lazerTimer=120}){
        var p = this.props;
        p.health = health;
        p.damage = damage;
        p.lazerTimer = lazerTimer;
    }
	
	update({botManager}){
	    botManager.findClosestBadGuyTarget({obj:this});
		this.acceleration();
		var p = this.props;
		
		p.movementAnimation.updateCords({x:this.props.x,y:this.props.y, angle:this.props.angle});
        p.movementAnimation.update({constLoop:true});

		this.generateLazer();
	}
	
	generateLazer(){
		let p = this.props
		if(p.lazerCount < p.lazerTimer){
			p.lazerCount++;
		}
		else{
			p.lazerCount = 0;
			let target = p.targetObj.props;
			if(target.health > -1){
                let xw = p.x+p.hWidth;
                let yh = p.y+p.hHeight;
                let mainGun = pointAfterRotation( xw, yh, p.x + 32,p.y+12,  p.angle );

                var dirY = (target.y+target.hHeight)-(mainGun.y);
                var dirX = (target.x+target.hWidth)-(mainGun.x);
                var angle = Math.atan2(dirY,dirX);

                // Normalize the direction
                var len = Math.sqrt(dirX * dirX + dirY * dirY);
                dirY /= len;
                dirX /= len;

                pSub.publish(globe.GENERATEGOODBULLET,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:7});
			}
			else{
			    p.targetObj = undefined;
			}
		}
	}
	
	acceleration(){
		let p = this.props;
		if(p.targetObj){
            var y = (p.targetObj.props.y+p.targetObj.props.hHeight) - (p.y+16);
            var x = (p.targetObj.props.x+p.targetObj.props.hWidth) - (p.x+16);
            p.angle = Math.atan2(y, x);
		}
	}
	
	processDamage({damage}){
		this.props.health -= damage;
		if(this.props.health < 0){
			pSub.publish(globe.REMOVEDTOWER,{id:this.props.id, props:this.props});
			pSub.publish(globe.ADDANIMATION,{type:"defenceTowerDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
		}
	}
	
	
}