/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder, pointAfterRotation} from "../Libs/2dGameLib";

export default class Titan{
    constructor({x=0,y=20, angle=0, id, speed=2, targetObj, health= 1000, damage=5, turretDamage=7}){
        this.props = {
			titanImg: gameInstance.props.titanImg,
			dasherImg: gameInstance.props.dasherImg,
			turretImg: gameInstance.props.turretImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			width:84, // 48
			height:84, //84
			hWidth:42, // 24
			hHeight:42, // 42
			health,
			maxHealth:health,
			damage,
			
			lazerTimer:30,
			lazerCount:0,
			
			dasherTimer:50,
			dasherCount:0,
			
			forward: true, // used to flip movement
			
			turret:undefined,
			turX:0,
			turY:0,
			tur2X:0,
			tur2Y:0,
			turWidth:32,
			turHeight:32,
			turhWidth:16,
			turhHeight:16,
			turAngle:0,
			tur2Angle:0,
		};
		
        this.props.move = this.rightMove;
        this.props.angle= 0;

    }

    updateStats({speed=2,health= 200, damage=5, turretDamage=5}){
        var p = this.props;
        p.speed = speed;
        p.health = health;
        p.damage = damage;
        p.turretDamage = turretDamage;
    }
	
	update({botManager}){
		this.acceleration();
		var p = this.props;
		
		// draw carrier
		DrawRotateImage(0,0,p.width,p.height,(this.props.x),(this.props.y),p.width,p.height,window.ctxNPC,this.props.titanImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		
		// draw turret
		DrawRotateImage(0,0,p.turWidth,p.turHeight,(p.turX),(p.turY),p.turWidth,p.turHeight,window.ctxNPC,p.turretImg,p.turAngle,p.turX+p.turhWidth, p.turY+p.turhHeight);
		DrawRotateImage(0,0,p.turWidth,p.turHeight,(p.tur2X),(p.tur2Y),p.turWidth,p.turHeight,window.ctxNPC,p.turretImg,p.tur2Angle,p.tur2X+p.turhWidth, p.tur2Y+p.turhHeight);

		if(p.dasherCount < p.dasherTimer){
			p.dasherCount++;
		}
		else{
			p.dasherCount = 0;
			this.generateDasher();
		}
		
		this.generateLazer();
		
		this.checkPosition();
	}
	
	checkPosition(){
	}
	
	acceleration(){ // just want him to move around the outside of the map, simple, keeps firing and generating more dashers.
		this.props.move();
		let p = this.props;
		
		let point = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+62, p.y+24, p.angle);
		
		p.turX = point.x - p.turhWidth;
		p.turY = point.y - p.turhHeight;
		
		let ship = gameInstance.props.ship.props;
		var dirY = (ship.y+ship.hHeight)-(point.y);
		var dirX = (ship.x+ship.hWidth)-(point.x);
		p.turAngle = Math.atan2(dirY,dirX); // bullet angle

		point = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+62, p.y+60, p.angle);

		p.tur2X = point.x - p.turhWidth;
		p.tur2Y = point.y - p.turhHeight;

		dirY = (ship.y+ship.hHeight)-(point.y);
		dirX = (ship.x+ship.hWidth)-(point.x);
		p.tur2Angle = Math.atan2(dirY,dirX); // bullet angle
		
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){
			pSub.publish(globe.REMOVECARRIER,{id:this.props.id});
			pSub.publish(globe.ADDTOSCORE,{amount:250});
			pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}
	
	generateDasher(){
		let p = this.props;

		pSub.publish(globe.GENERATEDASHER,{x:p.x, y:p.y+13,});
		pSub.publish(globe.GENERATEDASHER,{x:p.x, y:p.y+43,});
	}
	
	generateLazer(){
		let p = this.props
		if(p.lazerCount < p.lazerTimer){
			p.lazerCount++;
		}
		else{
			p.lazerCount = 0;
			let target = p.targetObj.props;
			
			// work out direction
			var dirY = (target.y+target.hHeight)-(p.turY+p.turhHeight);
			var dirX = (target.x+target.hWidth)-(p.turX+p.turhWidth);
			var angle = Math.atan2(dirY,dirX);

			// Normalize the direction
			var len = Math.sqrt(dirX * dirX + dirY * dirY);
			dirY /= len;
			dirX /= len;
			
			let mainGun = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+56, p.y+22, p.angle);
			let main2Gun = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+56, p.y+60, p.angle);

			// where on the ship are we generating the laser
			pSub.publish(globe.GENERATELAZER,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:6,damage:p.turretDamage});
			pSub.publish(globe.GENERATELAZER,{dirY,dirX,angle,startX:main2Gun.x, startY:main2Gun.y,speed:6,damage:p.turretDamage});
		}
	}
	
	rightMove(){
		let p = this;
		if(p.x < (globe.mapWidth-85) && p.x > (globe.mapWidth-45)){ // then we are on the x axis, so just move up and down
			// do nothing we are in place
		}
		else if(p.x < (globe.mapWidth-85)){
			p.x++;
		}
		else{
			p.x--;
		}
		
		if(p.forward){ // move down
			p.y += p.speed * 1;
			
			if(p.y > ( globe.mapHeight - (p.height+70))){
				p.forward = false;
			}
		}
		else{ // move up
			p.y -= p.speed * 1;
			
			if(p.y < 20){
				p.forward = true;
			}
		}
	}
	
}