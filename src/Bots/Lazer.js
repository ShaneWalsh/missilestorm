
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawRotateImage} from "../Libs/2dGameLib";

export default class Lazer{
    constructor({x=200,y=200, angle=0, id, speed=10, dirX, dirY,damage=3}){
        this.props = {
			lazerImg: gameInstance.props.lazerImg,
			id,
			x,
			y,
			angle,
			dirX,
			dirY,
			speed,
			width:16,
			height:8,
			hWidth:8,
			hHeight:4,
			damage,
		};
    }

	
	update(){ // loop through objects and call update on them.
		this.acceleration();
		DrawRotateImage(0,0,16,8,this.props.x,this.props.y,16,8,window.ctxNPC,this.props.lazerImg,this.props.angle,this.props.x, this.props.y);
		
		this.checkPosition();
	}
	
	checkPosition(){
		let p = this.props;
		if(p.x < -50 || p.x > globe.mapWidthPadding){
			pSub.publish(globe.REMOVELAZER,{id:this.props.id});
		}
		else if(p.y < -50 || p.y > globe.mapHeightPadding){
			pSub.publish(globe.REMOVELAZER,{id:this.props.id});
		}
	}
	
	acceleration(){
		let p = this.props;
		let speed = p.speed;

		p.x += speed * p.dirX;
		p.y += speed * p.dirY;
	}
	
	processDamage({pierce,blast,blunt}){
		pSub.publish(globe.REMOVELAZER,{id:this.props.id});
	}
	
}