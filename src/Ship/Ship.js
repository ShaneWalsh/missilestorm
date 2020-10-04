/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage, pointAfterRotation, drawBorder, drawBorderRotate} from "../Libs/2dGameLib";
import Bullet from "./Bullet";
import Blast from "./Blast";
import Missile from "./Missile";
import sheetAnimation from "../Animation/SheetAnimation";

// bulPierce=3,bulBlunt=2, bulBlast=1, speedMain=5, acc = 1, health=200 are the defaults
export default class Ship{
    constructor({x=200,y=200,shipImg=gameInstance.props.shipImg, bulPierce=3,bulBlunt=2, bulBlast=1, speedMain=5,acc=1, health=200, missileAmno=10 }){
        this.props = {
            id:0,
			shipImg,
			x,
			y,
			health,
			maxHealth:health,
			level:0,
			score:0,
			levelScoreCounter: 0, // this will be used to determine when to level up, socre is used in displays and for the scoreboard
			spree:0, // only while you remain undamaged
			
			
			width:32,
			height:32,
			hWidth:16,
			hHeight:16,
			angle:0,
			
			explosions: {},
			
			bullets: {},
			bulletId:1,
			
			frames: 0,
			framesLimit: 2,
			
			bTimer: 0,
			bTimerLimit: 10,
			
			bulletsFiring: false,
			bulletsFired: false,
			
			missiles:{},
			mTimer: 0,
			mTimerLimit: 60,
			missileFiring: false,
			
			xExcel: 0,
			yExcel: 0,
			xSpeed: 0,
			ySpeed: 0,
			maxSpeed:speedMain,
			maxSpeedNeg:-speedMain,
			xExcelAmount: acc,
			xExcelAmountNeg: -acc,
			yExcelAmount: acc,
			yExcelAmountNeg: -acc,
			decelerate: 1, // decelerate will try and bring the speed closer to 0 always, so if you stop pressing keys, you will slowly come to a stop, more realistic would be to float 
			
			targetObj: undefined,

			bulPierce,
			bulBlunt,
			bulBlast,

			missileAmno,
			missileMax: 40,

			shieldAni: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:4, ctxDraw:ctxNPC,angle:0}),
			powerShields: 0,
			powerShieldCap: 5,

			movementAnimation: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:3, ctxDraw:ctxNPC,angle:0})
		};
        this.props.shieldAni.setSheet({sheet:gameInstance.props.shieldAnimImg,startx:0,starty:0,sizex:48,sizey:48,movex:48,movey:0,steps:3});
		this.props.movementAnimation.setSheet({sheet:gameInstance.props.shipMovementImg,startx:0,starty:0,sizex:48,sizey:48,movex:48,movey:0,steps:3});


		this.setupMoveListeners();
    }

    setStats({health=200,damage=3,powerShield=5,missileCap=20,missileAmount=10}){
        this.props.health = health;
        this.props.maxHealth = health;

        this.props.powerShieldCap = powerShield;

        this.props.bulPierce=damage;
        this.props.bulBlunt=damage-1;
        this.props.bulBlast=damage-2;

        this.props.missileAmno = missileAmount;
        this.props.missileMax = missileCap;
    }
	
	update(){ 
		this.acceleration();
		let p = this.props;
		
		let centerY = (this.props.y+p.hHeight);
		let centerX = (this.props.x+p.hWidth);

		var y = getMouseYOff()- this.props.y;
		var x = getMouseXOff()- this.props.x;
		this.props.angle = Math.atan2(y, x);
		
		DrawRotateImage(0,0,32,32,this.props.x,this.props.y,32,32,window.ctxNPC,this.props.shipImg,this.props.angle,centerX, centerY);

		if(p.powerShields > 0){
		    p.shieldAni.updateCords({x:p.x-8,y:p.y-8, angle:p.angle})
		    p.shieldAni.update({constLoop:true});
		}

		//draw movement flames
		p.movementAnimation.updateCords({x:p.x-8,y:p.y-8, angle:p.angle})
        p.movementAnimation.update({constLoop:true});

		// draw target on target
		if(p.targetObj){ // draw a targeting box around the target then!
		    if(p.targetObj.props.width != p.targetObj.props.height){
		        drawBorderRotate(p.targetObj.props.x,p.targetObj.props.y,p.targetObj.props.width,p.targetObj.props.height,ctxNPC,globe.TARGETEDCOLOR,p.targetObj.props.angle,p.targetObj.props.x+p.targetObj.props.hWidth,p.targetObj.props.y+p.targetObj.props.hHeight);
		    }else{
			    drawBorder(p.targetObj.props.x,p.targetObj.props.y,p.targetObj.props.width,p.targetObj.props.height,ctxNPC,globe.TARGETEDCOLOR);
			}
		}
		
		// need to put some kind of timer around this, may have to bring back the timer pubsub
		if(this.props.bulletsFiring || !this.props.bulletsFired){
			if(this.props.bTimer >= this.props.bTimerLimit){
				this.props.bTimer = 0;
				this.fireBullet();
			}
			else{
				this.props.bTimer++;
			}
		}
		
		if(this.props.missileFiring == true){// dont have to have a target this.props.targetObj && 
			if(this.props.mTimer >= this.props.mTimerLimit){
				this.props.mTimer = 0;
				this.fireMissile({normalMissile:true});
			}
			else{
				this.props.mTimer++;
			}
		}
		else if(this.props.mTimer < this.props.mTimerLimit){ // we want to keep reloading the missiles so you can just pop one off
			this.props.mTimer++;
		}
		
		for (let key in this.props.bullets) {
			if (this.props.bullets.hasOwnProperty(key)) {
				this.props.bullets[key].update();
			}
		}
		
		for (let key in this.props.missiles) {
			if (this.props.missiles.hasOwnProperty(key)) {
				this.props.missiles[key].update();
			}
		}
	}
	
	updateBlast(){
		for (let key in this.props.explosions) {
			if (this.props.explosions.hasOwnProperty(key)) {
				this.props.explosions[key].update();
			}
		}
	}
	
	acceleration(){
		var p = this.props;
		p.xSpeed += p.xExcel;
		p.ySpeed += p.yExcel;
		
		// acceleration extract into function?
		if(p.xSpeed > p.maxSpeed){p.xSpeed =  p.maxSpeed;}
		else if(p.xSpeed < p.maxSpeedNeg){p.xSpeed =  p.maxSpeedNeg;}
		
		if(p.ySpeed > p.maxSpeed){p.ySpeed =  p.maxSpeed;}
		else if(p.ySpeed < p.maxSpeedNeg){p.ySpeed =  p.maxSpeedNeg;}
		
		// apply movement
		p.x += p.xSpeed;
		p.y += p.ySpeed;
		
		if(p.x + p.width > globe.mapWidth){
			p.x = globe.mapWidth -  p.width;
		}
		else if(p.x < 0){
			p.x = 0;
		}
		
		if(p.y + p.height > globe.mapHeight){
			p.y = globe.mapHeight -  p.height;
		}
		else if(p.y < 0){
			p.y = 0;
		}
			
		if(this.props.frames == this.props.framesLimit ){
			this.props.frames = 0;
			if(p.xSpeed > 0){ p.xSpeed -= p.decelerate; }
			else if(p.xSpeed < 0){ p.xSpeed += p.decelerate; }
			
			if(p.ySpeed > 0){ p.ySpeed -= p.decelerate; }
			else if(p.ySpeed < 0){ p.ySpeed += p.decelerate; }
		}
		else{
			this.props.frames++;
		}
		this.updateOffset();
	}

	updateOffset(){
	    var g = globe;
	    var p = this.props;

	    var xOffset = g.mapOffsetX;
	    var yOffset = g.mapOffsetY;

        if(p.x > g.mapOffsetXMin && p.x < g.mapOffsetXMax){ // so we have moved past the min but are less than the max, so move forward
            xOffset = g.mapOffsetXMin - p.x;
        }else if(p.x < g.mapOffsetXMin) {
            xOffset = 0;
        }

        if(p.y > g.mapOffsetYMin && p.y < g.mapOffsetYMax){ // so we have moved past the min but are less than the max, so move forward
            yOffset = g.mapOffsetYMin - p.y;
        }else if(p.y < g.mapOffsetYMin) {
            yOffset = 0;
        }

        g.mapOffsetX = xOffset;
        g.mapOffsetY = yOffset;
	}

	// setup listeners for the published key presses
	setupMoveListeners(){
		pSub.subscribe(globe.D_PRESSED,this.moveRight,this);
		pSub.subscribe(globe.A_PRESSED,this.moveLeft,this);
		pSub.subscribe(globe.S_PRESSED,this.moveDown,this);
		pSub.subscribe(globe.W_PRESSED,this.moveUp,this);
		
		pSub.subscribe(globe.D_RELEASE,this.slowRight,this);
		pSub.subscribe(globe.A_RELEASE,this.slowLeft,this);
		pSub.subscribe(globe.S_RELEASE,this.slowDown,this);
		pSub.subscribe(globe.W_RELEASE,this.slowUp,this);
		
		// listen to left and double click for bullets and missiles
		pSub.subscribe(globe.LEFTCLICK,this.setFireBullet,this);
		pSub.subscribe(globe.LEFTCLICKRELEASE,this.stopFireBullet,this);
		
		pSub.subscribe(globe.SPACE_RELEASE,this.setFireMissile,this); // if there is no target then then just fire it straight
		pSub.subscribe(globe.RIGHTCLICKRELEASE,this.setFireMissile,this); // if there is no target then then just fire it straight
		pSub.subscribe(globe.TARGETFOUND,this.targetEnemy,this);
		pSub.subscribe(globe.CLEARTARGET,this.cleanTarget,this);
		
		pSub.subscribe(globe.REMOVEBLAST,this.removeBlast,this);
		pSub.subscribe(globe.REMOVEMISSILE,this.removeMissile,this);
		pSub.subscribe(globe.REMOVEBULLET,this.removeBullet,this);
		pSub.subscribe(globe.ADDTOSCORE,this.updateScore,this);
		
		
		pSub.subscribe(globe.GENERATEMISSILESTORM,this.missileStorm,this);
		
	}
	
	targetEnemy(tpoic,{target}){
		// target found
		this.props.targetObj = target;
	}
	
	setFireBullet(){
		this.props.bulletsFiring = true;
		this.props.bulletsFired = false;
	}
	stopFireBullet(){
		this.props.bulletsFiring = false;
	}
	
	fireBullet(){
		let p = this.props;
		p.bulletsFired = true;
		let xw = this.props.x+this.props.hWidth;
		let yh = this.props.y+this.props.hHeight;
		
		
		var directionY = getMouseYOff()-yh;
		var directionX = getMouseXOff()-xw;
		var angle = Math.atan2(directionY,directionX);

		// Normalize the direction
		var len = Math.sqrt(directionX * directionX + directionY * directionY);
	    directionX /= len;
		directionY /= len;
		
		let leftGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y-2,  this.props.angle );
		let rightGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y+26,  this.props.angle );
		
		
		
		let id = this.getNewId();
		this.props.bullets[id]=new Bullet({x:leftGun.x,y:leftGun.y,angle,id, speed:10, dirX:directionX, dirY:directionY, pierce:p.bulPierce, blast:p.bulBlast,blunt:p.bulBlunt});
		id = this.getNewId();
		this.props.bullets[id]=new Bullet({x:rightGun.x,y:rightGun.y,angle,id, speed:10, dirX:directionX, dirY:directionY, pierce:p.bulPierce, blast:p.bulBlast,blunt:p.bulBlunt});
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"lazersound1"});
	}
	
	setFireMissile(){
		this.props.missileFiring = true;
	}
	
	missileStorm(){
		let p = this.props;
		let g = gameInstance.props.botManager.props
		let enemies = [g.carriers,g.dashers,g.gliders,g.keepers];
		
		for(let i = 0; i < enemies.length; i++){
			let bots = enemies[i];
			for (let keyd in bots) {
				if (bots.hasOwnProperty(keyd)) {
					p.targetObj = bots[keyd];
					this.fireMissile({});
				}
			}
		}
	}
	
	fireMissile({normalMissile=false}){
	    let p = this.props;
		if(normalMissile == false || (p.missileAmno > 1)){
            this.props.missileFiring = false;
            if(p.targetObj){ // then there is a target, so we fire!
                var directionY = this.props.targetObj.props.y-this.props.y;
                var directionX = this.props.targetObj.props.x-this.props.x;
                var angle = Math.atan2(directionY,directionX);

                // Normalize the direction
                var len = Math.sqrt(directionX * directionX + directionY * directionY);
                directionX /= len;
                directionY /= len;

                let xw = this.props.x+this.props.hWidth;
                let yh = this.props.y+this.props.hHeight;
                let leftGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y+5,  this.props.angle );
                let rightGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y+27,  this.props.angle );

                let id = this.getNewId();
                this.props.missiles[id]=new Missile({x:leftGun.x,y:leftGun.y,angle,id, speed:6, dirX:directionX, dirY:directionY, targetObj:p.targetObj});
                id = this.getNewId();
                this.props.missiles[id]=new Missile({x:rightGun.x,y:rightGun.y,angle,id, speed:6, dirX:directionX, dirY:directionY, targetObj:p.targetObj});
            }
            else{ // aim at the mouse and go
                var directionY = getMouseYOff()-this.props.y;
                var directionX = getMouseXOff()-this.props.x;
                var angle = Math.atan2(directionY,directionX); 
                var len = Math.sqrt(directionX * directionX + directionY * directionY);
                directionX /= len;
                directionY /= len;

                let xw = this.props.x+this.props.hWidth;
                let yh = this.props.y+this.props.hHeight;
                let leftGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y+5,  this.props.angle );
                let rightGun = pointAfterRotation( xw, yh, this.props.x + 16,this.props.y+27,  this.props.angle );


                let id = this.getNewId();
                this.props.missiles[id]=new Missile({x:leftGun.x,y:leftGun.y,angle,id, speed:6, dirX:directionX, dirY:directionY, targetObj:undefined});
                id = this.getNewId();
                this.props.missiles[id]=new Missile({x:rightGun.x,y:rightGun.y,angle,id, speed:6, dirX:directionX, dirY:directionY, targetObj:undefined});

            }
            if(normalMissile == true){
                p.missileAmno -= 2;
                if(p.missileAmno == 0){
                    pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missilesDepleted"});
                }
            }
            // sound
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missileLaunch"});

        }
        else{
            p.missileFiring = false;
            pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x:this.props.x,y:this.props.y,params:{driftX:0,driftY:-0.5,text:"NO MISSILES",fontSize:11, color:"#FFFFFF"}});
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missfire"});
        }
	}
	
	addBlast({x,y}){
		//explosions
		let id = this.getNewId();
		this.props.explosions[id] = new Blast({x,y,id});
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"exp"});
	}
	removeBlast(topic, {id}){
		delete this.props.explosions[id];
	}
	
	getNewId(){
		var id =  this.props.bulletId++;
		if(id > 100000000){ // just incase it tries to run out of bullets
			this.props.bulletId = 1;
		}
		return id;
	}
	
	removeMissile(topic, {id}){
		if(this.props.missiles[id]){ // check for null
			this.props.missiles[id].clearListeners();
			delete this.props.missiles[id];
		}
	}
	
	removeBullet(topic, {id}){
		delete this.props.bullets[id];
	}
	updateScore(topic, {amount}){
		this.props.score+=amount;
		this.props.levelScoreCounter+=amount;
	}
	
	cleanTarget(topic, {target}){
		if(this.props.targetObj === target){ // object is no more, so just fly solo
			this.props.targetObj = undefined;
		}
	}

	processDamage({damage}){
	    if(this.props.powerShields > 0){
	        if(damage > 2){ // want to not lose shields to bees :D
	            this.props.powerShields--;
	        }
	    }
	    else{
	        var damaged = false;
	        if(this.props.health > 50){
	            damaged = true
	        }
	        this.props.health -= damage;
	        if(this.props.health < 50 && damaged == true){
	            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"systemsCritical"});
	        }
	    }
	}

	moveRight(){
		this.props.xExcel = this.props.xExcelAmount;
	}
	moveLeft(){
		this.props.xExcel = this.props.xExcelAmountNeg;
	}
	moveDown(){
		this.props.yExcel = this.props.yExcelAmount;
	}
	moveUp(){
		this.props.yExcel = this.props.yExcelAmountNeg;
	}
	
	slowRight(){
		if(this.props.xExcel > 0){
			this.props.xExcel = 0;
		}
	}
	slowLeft(){
		if(this.props.xExcel < 0){ // I do this check, because the user could have clicked another button without releasing the last one, so they could switch from left to right and then release left I dont want this to slow the right
			this.props.xExcel = 0;
		}
	}
	slowDown(){
		if(this.props.yExcel > 0){
			this.props.yExcel = 0;
		}
	}
	slowUp(){
		if(this.props.yExcel < 0){
			this.props.yExcel = 0;
		}
	}
	
}