/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder, pointAfterRotation} from "../Libs/2dGameLib";


// idea for a connector is that they should slow you down, draw a beam from them to player, as more are spawned, they will connect up and slow you down even more.
export default class Connector{
    constructor({x=0,y=20, angle=0, id, speed=2, targetObj, health= 200, damage=200, turretDamage=5}){
        this.props = {
			carrierImg: gameInstance.props.carrierImg,
			dasherImg: gameInstance.props.dasherImg,
			turretImg: gameInstance.props.turretImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			width:48, // 48
			height:84, //84
			hWidth:24, // 24
			hHeight:42, // 42
			health,
			damage,
			
			turret:undefined,
			turX:0,
			turY:0,
			turWidth:32,
			turHeight:32,
			turhWidth:16,
			turhHeight:16,
			turAngle:0,
		};
    }

	
	update(){
		this.acceleration();
		var p = this.props;
		
		// draw carrier
		DrawRotateImage(0,0,p.width,p.height,(this.props.x),(this.props.y),p.width,p.height,window.ctxNPC,this.props.carrierImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		
		// draw turret
		DrawRotateImage(0,0,p.turWidth,p.turHeight,(p.turX),(p.turY),p.turWidth,p.turHeight,window.ctxNPC,p.turretImg,p.angle,p.turX+p.turhWidth, p.turY+p.turhHeight);
		
		
		this.checkPosition();
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
		}
		if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
		}
	}
	
	acceleration(){ // just want him to move around the outside of the map, simples, keeps firing and generating more dashers.
		// move me !
		let p = this.props;
		// Set the speed (move 100 pixels per second)
		let speed = p.speed;

		var y = p.targetObj.props.y - (p.y+p.hHeight);
		var x = p.targetObj.props.x - (p.x+p.hWidth);
		p.angle = Math.atan2(y, x);
		
		var len = Math.sqrt(x * x + y * y);
	    x /= len;
		y /= len;
		// Flag to check if we reached the target

		p.x += speed * x;
		p.y += speed * y;
		
		let point = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+24, p.y+61, p.angle);
		
		p.turX = point.x - p.turhWidth;
		p.turY = point.y - p.turhHeight;
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){ // im dead
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
			
			pSub.publish(globe.ADDTOSCORE,{amount:250});
			
			
		}
	}
	
}