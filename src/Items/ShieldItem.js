
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawImage} from "../Libs/2dGameLib";

export default class ShieldItem{
    constructor({x=200,y=200, angle=0, id}){
        this.props = {
			shieldAmnoItemImg: gameInstance.props.shieldAmnoItemImg,
			id,
			x,
			y,
			angle,
			width:24,
			height:24,
			hWidth:12,
			hHeight:12,
			
			lifespawn:420,
			lifespawnCounter:0,
			
		};
    }

	
	update(){
		let p = this.props;
		DrawImage(0,0,p.width,p.height,p.x,p.y,p.width,p.height,window.ctxHighlight,p.shieldAmnoItemImg);
		if(p.lifespawnCounter < p.lifespawn){
			p.lifespawnCounter++;
		}
		else{
			pSub.publish(globe.REMOVEITEM,{id:p.id});
		}
	}
	
	acquired({}){
		let ship = gameInstance.props.ship.props;

        pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x:this.props.x,y:this.props.y,params:{driftX:0,driftY:-0.5,text:"+5 POWER SHIELD",fontSize:11, color:"#1bf6f9"}});
		ship.powerShields += 5; // no max on the shields?
		if(ship.powerShields > ship.powerShieldCap){
		    ship.powerShields = ship.powerShieldCap;
		}

		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"powerShieldPickup"});
        pSub.publish(globe.REMOVEITEM,{id:this.props.id});
	}
	
	checkPosition(){
	}
	
	acceleration(){
	}
	
}