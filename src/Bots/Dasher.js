/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder,DrawPreRenderSprite} from "../Libs/2dGameLib";
import sheetAnimation from "../Animation/SheetAnimation";

export default class Dasher{
    constructor({x=0,y=20, angle=0, id, speed=3, targetObj, health= 10, damage=10, carrier= false}){
        this.props = {
			dasherImg: gameInstance.props.dasherImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			dirX:0,
			dirY:0,
			width:32,
			height:32,
			hWidth:16,
			hHeight:16,
			health,
			damage,
			carrier,// just to mark whether it came from a bot manager or a carrier
			move:this.moveStraight,
			
			targeting:30,
			targetingCount:31,
			movementAnimation: new sheetAnimation({id:0,x:x,y:y,framesPerAnimation:3, ctxDraw:ctxNPC,angle})

		}
		this.props.movementAnimation.setSheet({sheet:gameInstance.props.dasherMovementImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:2});
		
		// decide on the dasher type
		// the type that moves in both axis at the same time or the type that moves along bottom first or top first
		var rand = Math.random();
		var side = Math.floor(( rand* 3) + 1);
		rand = Math.random();
		
		var x = 0,
			y = 0;
		
		if(side == 1){ // straight
			this.props.move = this.moveStraight;
		}
		else if(side == 2){ // x axis
			this.props.move = this.moveXAxis;
		}
		else if(side == 3){ // y axis
			this.props.move = this.moveYAxis;
		}
		
    }

    updateStats({speed=3,health= 10, damage=10}){
        var p = this.props;
        p.speed = speed;
        p.health = health;
        p.damage = damage;
    }
	
	update({botManager}){
	    botManager.findClosestGoodGuyTarget({obj:this});

		this.acceleration();
		var p = this.props;
        p.movementAnimation.updateCords({x:this.props.x,y:this.props.y, angle:this.props.angle});
        p.movementAnimation.update({constLoop:true});

		this.checkPosition();
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
		}
	}
	
	acceleration(){
		let p = this.props;
		p.move();
	}
	
	moveStraight(){
		let p = this;
		if(p.targetingCount < p.targeting){ // add a bit of a random element, speed boosts, and timer skipper? just so they dont all bunch up
			p.targetingCount++;
			
			p.x += p.speed * p.dirX;
			p.y += p.speed * p.dirY;
			
			var y = p.targetObj.props.y - (p.y+16);
			var x = p.targetObj.props.x - (p.x+16);
			p.angle = Math.atan2(y, x);
		}
		else{		// re calculate target
			p.targetingCount = 0;
			// Set the speed (move 100 pixels per second)
			let speed = p.speed;

			var y = p.targetObj.props.y - (p.y+16);
			var x = p.targetObj.props.x - (p.x+16);
			p.angle = Math.atan2(y, x);
			
			var len = Math.sqrt(x * x + y * y);
			x /= len;
			y /= len;
			
			p.dirX = x;
			p.dirY = y;

			p.x += speed * x;
			p.y += speed * y;
		}
	}
	
	moveXAxis(){
		let p = this;
		if(p.targetingCount < p.targeting){ // add a bit of a random element, speed boosts, and timer skipper? just so they dont all bunch up
			p.targetingCount++;
			
			let py = p.y+16;
			let px = p.x+16;
			
			var y = p.dirY - (py);
			var x = p.dirX - (px);
			p.angle = Math.atan2(y, x);
			
			if(!(x > -5 && x < 5)){ // then they are not equal
				if(x < 0)
					p.x -= p.speed * 1;
				else{
					p.x += p.speed * 1;
				}
			}
			if(y < 0)
				p.y -= p.speed * 1;
			else{
				p.y += p.speed * 1;
			}
		} else { // re calculate target
			p.targetingCount = 0;
			let speed = p.speed;
			
			let py = p.y+16;
			let px = p.x+16;
			
			var y = p.targetObj.props.y - (py);
			var x = p.targetObj.props.x - (px);
			p.angle = Math.atan2(y, x);
			
			p.dirY= p.targetObj.props.y
			p.dirX= p.targetObj.props.x
			
			
			// is our x-axis inline with theirs?
			if(!(x > -5 && x < 5)){ // then they are not equal
				if(x < 0)
					p.x -= p.speed * 1;
				else{
					p.x += p.speed * 1;
				}
			}
			if(y < 0)
				p.y -= p.speed * 1;
			else{
				p.y += p.speed * 1;
			}
		}
	}	
	
	moveYAxis(){
		let p = this;
		if(p.targetingCount < p.targeting){ // add a bit of a random element, speed boosts, and timer skipper? just so they dont all bunch up
			p.targetingCount++;
			
			let py = p.y+16;
			let px = p.x+16;
			
			var y = p.dirY - (py);
			var x = p.dirX - (px);
			p.angle = Math.atan2(y, x);
			
			if(!(y > -5 && y < 5)){ // then they are not equal
				if(y < 0)
					p.y -= p.speed * 1;
				else{
					p.y += p.speed * 1;
				}
			}
			if(x < 0)
				p.x -= p.speed * 1;
			else{
				p.x += p.speed * 1;
			}
			
			
		} else {// re calculate target
			p.targetingCount = 0;
			let speed = p.speed;
			
			let py = p.y+16;
			let px = p.x+16;
			
			var y = p.targetObj.props.y - (py);
			var x = p.targetObj.props.x - (px);
			p.angle = Math.atan2(y, x);
			
			p.dirY= p.targetObj.props.y
			p.dirX= p.targetObj.props.x
			
			if(!(y > -5 && y < 5)){ // then they are not equal
				if(y < 0)
					p.y -= p.speed * 1;
				else{
					p.y += p.speed * 1;
				}
			}
			if(x < 0)
				p.x -= p.speed * 1;
			else{
				p.x += p.speed * 1;
			}
		}
	}
	
	processDamage({pierce,blast,blunt}){
		this.props.health -= pierce;
		if(this.props.health < 0){
			pSub.publish(globe.ADDANIMATION,{type:"dasherDeath",x:this.props.x,y:this.props.y,angle: this.props.angle});
			pSub.publish(globe.REMOVEDASHER,{id:this.props.id});
			
			pSub.publish(globe.ADDTOSCORE,{amount:50});
			pSub.publish(globe.GENITEM,{x: this.props.x, y:this.props.y});
		}
	}
	
}