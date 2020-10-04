/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,DrawPreRenderSprite,totalDistance} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class Transport{
    constructor({x=0,y=20, angle=0, id, speed=3, targetObj, health= 400, damage=1}){
        this.props = {
			dasherImg: gameInstance.props.transportImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			dirX:0,
			dirY:0,
			width:48,
			height:48,
			hWidth:24,
			hHeight:24,
			health,
			maxHealth: health,
			damage,
			
			timer:0,
			timerWait:1200,
			atTarget:false,

			movementAnimation: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:3, ctxDraw:ctxNPC,angle})

		}
		this.props.movementAnimation.setSheet({sheet:gameInstance.props.dasherMovementImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});

		this.props.x = 50,
		this.props.y = 50;
		
    }

	
	update({botManager}){
	    var p = this.props;
	    if(!p.atTarget){
		    this.acceleration();
		}

		DrawRotateImage(0,0,48,48,(this.props.x),(this.props.y),48,48,window.ctxNPC,this.props.dasherImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		this.checkPosition();
	}
	
	checkPosition(){
	    var p = this.props;
	    // if we are out location, stop moving and wait for certain time.
	    if(!p.atTarget){
            var dis = totalDistance(this,p.targetObj);
            if(dis < 50){
                p.atTarget = true;
            }
	    }
	    else {    // at target then
            if(p.timer < p.timerWait){
                p.timer++;
            }
	    }
	}
	
	acceleration(){
		let p = this.props;

		let speed = p.speed;
        var y = p.targetObj.props.y - (p.y+p.hHeight);
        var x = p.targetObj.props.x - (p.x+p.hWidth);
        p.angle = Math.atan2(y, x);

        var len = Math.sqrt(x * x + y * y);
        x /= len;
        y /= len;

        p.dirX = x;
        p.dirY = y;

        p.x += speed * x;
        p.y += speed * y;
	}
	
	processDamage({damage}){
		this.props.health -= damage;
		if(this.props.health < 0){ 
			pSub.publish(globe.ADDTOSCORE,{amount:-50});
		}
	}
	
}