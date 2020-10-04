
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawImage} from "../Libs/2dGameLib";

export default class MissileAmnoItem{
    constructor({x=200,y=200, angle=0, id,width=16, height=16}){
        this.props = {
			ItemImg: gameInstance.props.missileAmnoItemImg,
			id,
			x,
			y,
			angle,
			width,
			height,
			hWidth:width>>1,
			hHeight:height>>1,
			
			lifespawn:420,
			lifespawnCounter:0,
			
		};
    }

	
	update(){
		let p = this.props;
		DrawImage(0,0,p.width,p.height,p.x,p.y,p.width,p.height,window.ctxHighlight,p.ItemImg);
		if(p.lifespawnCounter < p.lifespawn){
			p.lifespawnCounter++;
		}
		else{
			pSub.publish(globe.REMOVEITEM,{id:p.id});
		}
	}
	
	acquired({}){
		let ship = gameInstance.props.ship.props;

        pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x:this.props.x,y:this.props.y,params:{driftX:0,driftY:-0.5,text:"+10 MISSILES",fontSize:11, color:"#2ef431"}});

		ship.missileAmno += 10;
		if(ship.missileAmno > ship.missileMax){
		    ship.missileAmno = ship.missileMax;
		}

        pSub.publish(globe.REMOVEITEM,{id:this.props.id});

	}
	
	checkPosition(){
	}
	
	acceleration(){
	}
	
}