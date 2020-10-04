
/* 
 *  Created by Shane Walsh
 *  
 */
 
import {DrawImage} from "../Libs/2dGameLib";

export default class MassMissileItem{
    constructor({x=200,y=200, angle=0, id}){
        this.props = {
			itemImg: gameInstance.props.stormItemImg,
			id,
			x,
			y,
			angle,
			width:16,
			height:8,
			hWidth:8,
			hHeight:4,
			
			lifespawn:420,
			lifespawnCounter:0,
			
		};
    }

	
	update(){
		let p = this.props;
		DrawImage(0,0,p.width,p.height,p.x,p.y,p.width,p.height,window.ctxHighlight,p.itemImg);
		if(p.lifespawnCounter < p.lifespawn){
			p.lifespawnCounter++;
		}
		else{
			pSub.publish(globe.REMOVEITEM,{id:p.id});
		}
	}
	
	acquired({}){
        pSub.publish(globe.REMOVEITEM,{id:this.props.id});
        pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x:this.props.x,y:this.props.y,params:{driftX:0,driftY:-0.5,text:"MISSILE STORM",fontSize:11, color:"#d65339"}});
        pSub.publish(globe.GENERATEMISSILESTORM,{id:this.props.id});
        pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missileStormPickup"});
	}
	
	checkPosition(){
	}
	
	acceleration(){
	}
	
}