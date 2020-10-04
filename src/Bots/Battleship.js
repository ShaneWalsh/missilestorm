/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,pointAfterRotation,totalDistance} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class Battleship{
    constructor({x=0,y=20, angle=0, id, speed=3, targetObj,moveTargetObj, health= 800, damage=15}){
        this.props = {
			dasherImg: gameInstance.props.battleshipImg,
			turretImg: gameInstance.props.bsTowerImg,
			id,
			x,
			y,
			angle,		// angle of the bullets rotation
			speed,
			targetObj,
			moveTargetObj,
			dirX:0,
			dirY:0,
			width:48,
			height:48,
			hWidth:24,
			hHeight:24,
			health,
			maxHealth: health,
			damage,

			lazerTimer:20,
            lazerCount:0,

            glidTimer:240,
            glidCount:241,

			timer:0,
			timerWait:1200,
			atTarget:false,

			turret:undefined,
            turX:0,
            turY:0,
            turWidth:32,
            turHeight:32,
            turhWidth:16,
            turhHeight:16,
            turAngle:0,

			movementAnimation: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:3, ctxDraw:ctxNPC,angle})

		}
		this.props.movementAnimation.setSheet({sheet:gameInstance.props.dasherMovementImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});

    }

	
	update({botManager}){
	    botManager.findClosestBadGuyTarget({obj:this});
	    var p = this.props;

        this.acceleration();
		this.calTurret();

		DrawRotateImage(0,0,48,48,(this.props.x),(this.props.y),48,48,window.ctxNPC,this.props.dasherImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);

        // draw turret
        DrawRotateImage(0,0,p.turWidth,p.turHeight,(p.turX),(p.turY),p.turWidth,p.turHeight,window.ctxNPC,p.turretImg,p.turAngle,p.turX+p.turhWidth, p.turY+p.turhHeight);


        //p.movementAnimation.updateCords({x:this.props.x,y:this.props.y, angle:this.props.angle});
        //p.movementAnimation.update({constLoop:true});
        this.generateBullet();

		this.checkPosition();
	}

	generateBullet(){
        let p = this.props
        if(p.lazerCount < p.lazerTimer){
            p.lazerCount++;
        }
        else{
            p.lazerCount = 0;
            if(p.targetObj && p.targetObj.props.health > 0){
                let target = p.targetObj.props;


                // at what are we going!
                var dirY = (target.y+target.hHeight)-(p.turY+p.turhHeight);
                var dirX = (target.x+target.hWidth)-(p.turX+p.turhWidth);
                var angle = Math.atan2(dirY,dirX); // bullet angle

                // Normalize the direction
                var len = Math.sqrt(dirX * dirX + dirY * dirY);
                dirY /= len;
                dirX /= len;

                let mainGun = pointAfterRotation((p.turX+p.turhWidth),(p.turY+p.turhHeight),p.turX+28, p.turY+12, angle);
                // where on the ship are we generating the laser
                pSub.publish(globe.GENERATEGOODBULLET,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:7});
            }
            else{

            }
        }
    }

	checkPosition(){
	    var p = this.props;
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

            var y = p.locY - (p.y+p.hHeight);
            var x = p.locX - (p.x+p.hWidth);

            p.moveTargetObj = {props:{x:p.locX, y:p.locY}};
            p.angle = Math.atan2(y, x);

            var len = Math.sqrt(x * x + y * y);
            x /= len;
            y /= len;

            p.dirX = p.speed * x;
            p.dirY = p.speed * y;
        }
        if(p.moveTargetObj){
            p.x += p.dirX;
            p.y += p.dirY;
        }
	}

	calTurret(){
	    let p = this.props;
        if(p.targetObj){
            let point = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+24, p.y+24, p.angle);

            p.turX = point.x - p.turhWidth;
            p.turY = point.y - p.turhHeight;

            let ship = gameInstance.props.ship.props;
            var dirY = (p.targetObj.props.y+p.targetObj.props.hHeight)-(point.y);
            var dirX = (p.targetObj.props.x+p.targetObj.props.hWidth)-(point.x);
            p.turAngle = Math.atan2(dirY,dirX); // bullet angle
        }
	}
	
	processDamage({damage}){
		this.props.health -= damage;
		if(this.props.health < 0){ // im dead
			pSub.publish(globe.ADDANIMATION,{type:"battleshipDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
			pSub.publish(globe.REMOVETRANSPORT,{id:this.props.id});
			
			pSub.publish(globe.ADDTOSCORE,{amount:-50});
			//pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}
	
}