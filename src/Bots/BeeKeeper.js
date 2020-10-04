/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,pointAfterRotation} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class BeeKeeper{
    constructor({x=0,y=20, angle=0, id, speed=1, targetObj, health= 50, damage=20}){
        this.props = {
			gliderImg: gameInstance.props.beeKeeperImg,
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
			
			beeSpawn:5,
			beeSpawnCount:0,
			
			beeInterval:5,
			beeIntervalCount:0,
			
			beeTimer:120,
			beeCount:0,
			
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
        }

        this.props.movementAnimation.setSheet({sheet:gameInstance.props.keeperMovementImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});

		
    }

	
	update({botManager}){
	    botManager.findClosestGoodGuyTarget({obj:this});
		this.acceleration();
		var p = this.props;
		p.movementAnimation.updateCords({x:this.props.x,y:this.props.y, angle:this.props.angle});
        p.movementAnimation.update({constLoop:true});

		this.generateBee();
		this.checkPosition();
	}
	
	generateBee(){
		let p = this.props
		if(p.beeCount < p.beeTimer){
			p.beeCount++;
		}
		else{
			if(p.beeIntervalCount >= p.beeInterval){
				if(p.beeSpawnCount < p.beeSpawn){
					p.beeSpawnCount++;
					p.beeIntervalCount = 0;
				}
				else{
					p.beeCount = 0;
					p.beeSpawnCount = 0;
				}
			
				let target = p.targetObj.props;
				
				let xw = p.x+p.hWidth;
				let yh = p.y+p.hHeight;
				let mainGun = {x:xw,y:yh};//= pointAfterRotation( xw, yh, p.x + 23,p.y,  p.angle );
				
				
				// at what are we going!
				var dirY = (target.y+target.hHeight)-(mainGun.y);
				var dirX = (target.x+target.hWidth)-(mainGun.x);
				var angle = Math.atan2(dirY,dirX); // bullet angle

				// Normalize the direction
				var len = Math.sqrt(dirX * dirX + dirY * dirY);
				dirY /= len;
				dirX /= len;

				// where on the ship are we generating the laser
				
				pSub.publish(globe.GENERATEBEE,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:6, targetObj:p.targetObj});
			}
			else{
				p.beeIntervalCount++;
			}
		}
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVEBEE,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVEBEE,{id:this.props.id});
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
			pSub.publish(globe.ADDANIMATION,{type:"beeKeeperDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
			pSub.publish(globe.REMOVEKEEPER,{id:this.props.id});
			pSub.publish(globe.ADDTOSCORE,{amount:100});
            pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}

	updateStats({speed=1,health= 50, damage=20, beeSpawn=5, beeInterval=5}){
        var p = this.props;
        p.speed = speed;
        p.health = health;
        p.damage = damage;
        p.beeSpawn = beeSpawn;
        p.beeInterval = beeInterval;
    }
	
}