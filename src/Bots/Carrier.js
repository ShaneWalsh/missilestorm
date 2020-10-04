/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder, pointAfterRotation} from "../Libs/2dGameLib";

export default class Carrier{
    constructor({x=0,y=20, angle=0, id, speed=2, targetObj, health= 200, damage=5, turretDamage=5}){
        this.props = {
			carrierImg: gameInstance.props.carrierImg,
			dasherImg: gameInstance.props.dasherImg, // when a dasher is generated hide the original dasher sprite for an empty one.
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
			
			lazerTimer:40,
			lazerCount:0,
			
			dasherTimer:110,
			dasherCount:0,
			
			forward: true, // used to flip movement
			
			turret:undefined,
			turX:0,
			turY:0,
			turWidth:32,
			turHeight:32,
			turhWidth:16,
			turhHeight:16,
			turAngle:0,
		};
		
		// work out which axis we need to align to based on the starting position
		if(this.props.x  == -20){ // left
			this.props.move = this.leftMove;
			this.props.angle= 0;
		}
		else if(this.props.x == globe.mapWidth+20){ // right
			this.props.move = this.rightMove;
			this.props.angle= (180) / 360 * (2*Math.PI);
		}
		else if(this.props.y == -20){
			this.props.move = this.topMove;
			this.props.angle= (90) / 360 * (2*Math.PI);
		}
		else{
			this.props.move = this.bottomMove;
			this.props.angle= (270) / 360 * (2*Math.PI);
		}
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
		DrawRotateImage(0,0,p.width,p.height,(this.props.x),(this.props.y),p.width,p.height,window.ctxNPC,this.props.carrierImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
		
		// draw turret
		DrawRotateImage(0,0,p.turWidth,p.turHeight,(p.turX),(p.turY),p.turWidth,p.turHeight,window.ctxNPC,p.turretImg,p.turAngle,p.turX+p.turhWidth, p.turY+p.turhHeight);
		
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
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVECARRIER,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVECARRIER,{id:this.props.id});
		}
	}
	
	acceleration(){ // just want him to move around the outside of the map, simple, keeps firing and generating more dashers.
		this.props.move();
		let p = this.props;
		
		let point = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+24, p.y+61, p.angle);
		
		p.turX = point.x - p.turhWidth;
		p.turY = point.y - p.turhHeight;
		
		let ship = gameInstance.props.ship.props;
		var dirY = (ship.y+ship.hHeight)-(point.y);
		var dirX = (ship.x+ship.hWidth)-(point.x);
		p.turAngle = Math.atan2(dirY,dirX); // bullet angle
		
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){
			pSub.publish(globe.REMOVECARRIER,{id:this.props.id});
			pSub.publish(globe.ADDANIMATION,{type:"carrierDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
			pSub.publish(globe.ADDTOSCORE,{amount:250});
			pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}
	
	generateDasher(){
		let p = this.props;
		let mainGun = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+32, p.y+23, p.angle);

		pSub.publish(globe.GENERATEDASHER,{x:mainGun.x-16, y:mainGun.y-16,});
	}
	
	generateLazer(){
		let p = this.props
		if(p.lazerCount < p.lazerTimer){
			p.lazerCount++;
		}
		else{
			p.lazerCount = 0;
			let target = p.targetObj.props;
			
			var dirY = (target.y+target.hHeight)-(p.turY+p.turhHeight);
			var dirX = (target.x+target.hWidth)-(p.turX+p.turhWidth);
			var angle = Math.atan2(dirY,dirX); // bullet angle

			// Normalize the direction
			var len = Math.sqrt(dirX * dirX + dirY * dirY);
			dirY /= len;
			dirX /= len;
			
			let mainGun = pointAfterRotation((p.x+p.hWidth),(p.y+p.hHeight),p.x+24, p.y+61, p.angle);
			
			pSub.publish(globe.GENERATELAZER,{dirY,dirX,angle,startX:mainGun.x, startY:mainGun.y,speed:6});
		}
	}
	
	leftMove(){
		let p = this;
		if(p.x < 25 && p.x > 15){ // then we are on the x axis, so just move up and down
			// do nothing we are in place
		}
		else{ // should only be on the left
			p.x++;
		}
		
		if(p.forward){ // move down
			p.y += p.speed * 1;
			
			if(p.y > ( globe.mapHeight - p.height)){
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
	
	rightMove(){
		let p = this;
		if(p.x < (globe.mapWidth-55) && p.x > (globe.mapWidth-45)){ // then we are on the x axis, so just move up and down
			// do nothing we are in place
		}
		else if(p.x < (globe.mapWidth-55)){
			p.x++;
		}
		else{
			p.x--;
		}
		
		if(p.forward){ // move down
			p.y += p.speed * 1;
			
			if(p.y > ( globe.mapHeight - p.height)){
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
	
	topMove(){
		let p = this;
		if(p.y < 25 && p.y > 15){ // then we are on the x axis, so just move up and down
			// do nothing we are in place
		}
		else{
			p.y++;
		}
		
		if(p.forward){ // move down
			p.x += p.speed * 1;
			
			if(p.x > ( globe.mapWidth - p.width)){
				p.forward = false;
			}
		}
		else{ // move up
			p.x -= p.speed * 1;
			
			if(p.x < 20){
				p.forward = true;
			}
		}
	}
	
	bottomMove(){
		let p = this;
		if(p.y < (globe.mapHeight-65) && p.x > (globe.mapHeight-55)){ // then we are on the x axis, so just move up and down
			// do nothing we are in place
		}
		else if (p.y < (globe.mapHeight-65)){
			p.y++;
		}
		else{
			p.y--;
		}
		
		if(p.forward){ // move down
			p.x += p.speed * 1;
			
			if(p.x > ( globe.mapWidth - p.width)){
				p.forward = false;
			}
		}
		else{ // move up
			p.x -= p.speed * 1;
			
			if(p.x < 20){
				p.forward = true;
			}
		}
	}
	
}