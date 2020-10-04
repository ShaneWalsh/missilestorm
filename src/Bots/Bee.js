/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,drawBorder} from "../Libs/2dGameLib";

export default class Bee{
    constructor({x=0,y=20, angle=0, id, speed=10, targetObj, health= 1, damage=2}){
        this.props = {
			dasherImg: gameInstance.props.beeImg,
			id,
			x,
			y,
			angle,
			speed,
			targetObj,
			dirX:0,
			dirY:0,
			width:16,
			height:16,
			hWidth:8,
			hHeight:8,
			health,
			damage,
			move:this.moveStraight,
			
			targeting:30,
			targetingCount:31,

			lifeSpan: 1200,
			lifeCounter:0
		}
		
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

	
	update({botManager}){
		this.acceleration();
		var p = this.props;
		
		DrawRotateImage(0,0,16,16,(this.props.x),(this.props.y),16,16,window.ctxNPC,this.props.dasherImg,this.props.angle,this.props.x, this.props.y);
		p.lifeCounter++;
		this.checkPosition();

		if(p.lifeCounter > p.lifeSpan ){
		    pSub.publish(globe.REMOVEBEE,{id:this.props.id});
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
		let p = this.props;
		p.move();
	}
	
	moveStraight() {
		let p = this;
		if(p.targetingCount < p.targeting) { // add a bit of a random element, speed boosts, and timer skipper? just so they dont all bunch up
			p.targetingCount++;
			
			p.x += p.speed * p.dirX;
			p.y += p.speed * p.dirY;
			
			var y = p.targetObj.props.y - (p.y+p.hHeight);
			var x = p.targetObj.props.x - (p.x+p.hWidth);
			p.angle = Math.atan2(y, x);
		}
		else {// re calculate target
			p.targetingCount = 0;
			// Set the speed (move 100 pixels per second)
			let speed = p.speed;

			var y = p.targetObj.props.y - (p.y+p.hHeight);
			var x = p.targetObj.props.x - (p.x+p.hWidth);
			p.angle = Math.atan2(y, x);
			
			var len = Math.sqrt(x * x + y * y);
			x /= len;
			y /= len;
			
			p.dirX = x;
			p.dirY = y;
			// Flag to check if we reached the target

			p.x += speed * x;
			p.y += speed * y;
		}
	}
	
	moveXAxis(){
		let p = this;
		if(p.targetingCount < p.targeting){ // add a bit of a random element, speed boosts, and timer skipper? just so they dont all bunch up
			p.targetingCount++;
			
			let py = p.y+p.hHeight;
			let px = p.x+p.hWidth;
			
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
		}
		else{// re calculate target
			p.targetingCount = 0;
			// Set the speed (move 100 pixels per second)
			let speed = p.speed;
			
			let py = p.y+p.hHeight;
			let px = p.x+p.hWidth;
			
			var y = p.targetObj.props.y - (py);
			var x = p.targetObj.props.x - (px);
			p.angle = Math.atan2(y, x);
			
			p.dirY= p.targetObj.props.y
			p.dirX= p.targetObj.props.x
			
			
			// is our x-axis inline with theirs?
			// if not move that way
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
			
			let py = p.y+p.hHeight;
			let px = p.x+p.hWidth;
			
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
			
			
		}
		else{		// re calculate target
			p.targetingCount = 0;
			// Set the speed (move 100 pixels per second)
			let speed = p.speed;
			
			let py = p.y+p.hHeight;
			let px = p.x+p.hWidth;
			
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
			pSub.publish(globe.REMOVEBEE,{id:this.props.id});
			// maybe play a death animation?
			// add to score?
			//pSub.publish(globe.ADDTOSCORE,{amount:5}); // no score for bees, or people could just harvest them.
			// check if this death should drop a consumable
		}
	}
	
}