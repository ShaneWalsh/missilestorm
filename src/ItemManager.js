/* 
 *  Created by Shane Walsh
 *  
 */
import healthItem from "./Items/HealthItem";
import shieldItem from "./Items/ShieldItem";
import massMissileItem from "./Items/MassMissileItem";
import missileAmnoItem from "./Items/MissileAmnoItem";
import {doBoxesIntersectRotation} from "./Libs/2dGameLib";

export default class ItemManager{
    constructor(){
        this.props = {		
			items:{},
			unitId:1,
            healthChanceBase:1,
            healthIncrease:0.5,
            healthCurrentChance:5,

            amnoChanceBase:1,
            amnoIncrease:0.5,
            amnoCurrentChance:5,

            stormChanceBase:0.01,
            stormIncrease:0.01,
            stormCurrentChance:0.5,

            shieldChanceBase:0.2,
            shieldIncrease:0.2,
            shieldCurrentChance:0.5

		};
		this.setupListeners();
    }
	
	update(){
		let p = this.props;
		for (let key in p.items) {
			if (p.items.hasOwnProperty(key)) {
				let d = p.items[key];
				let ship = gameInstance.props.ship;
				if(doBoxesIntersectRotation(ship,d)){
					d.acquired({});
				}
				else{
					d.update();
				}
			}
		}
	}
	getNewId(){
		var id =  this.props.unitId++;
		if(id > 100000000){
			this.props.unitId = 1;
		}
		return id;
	}
	
	setupListeners(){
		pSub.subscribe(globe.REMOVEITEM,this.removeItem,this);

		pSub.subscribe(globe.GENITEM,this.lootChance,this);

		pSub.subscribe(globe.GENERATEHEALTHITEM,this.createHealthItem,this);
		pSub.subscribe(globe.GENERATESHIELDITEM,this.createShieldItem,this);
		pSub.subscribe(globe.GENERATEMISSILEAMNOITEM,this.createMissileAmnoItem,this);
		pSub.subscribe(globe.GENERATEMISSILESTORMITEM,this.createMissileStormItem,this);
	}

	/**
	* loot chance will determine when to drop what, based on the %, which will increase over time, then reset back down.
	*/
	lootChance(topic,{x,y}){
	    var p = this.props;
        // drop health
        // drop missile storm
        var drop = false; // only want to drop once, no double drops.

        var rand = Math.random();
        var chance = Math.floor(( rand* 100) + 1);

        if(chance< p.stormCurrentChance){
            p.stormCurrentChance = p.stormChanceBase;
            drop = true;
            pSub.publish(globe.GENERATEMISSILESTORMITEM,{x,y});
        }else{
            p.stormCurrentChance = p.stormCurrentChance + p.stormIncrease;
        }

        if(chance< p.healthCurrentChance && drop == false){
            p.healthCurrentChance = p.healthChanceBase;
            drop = true;
            pSub.publish(globe.GENERATEHEALTHITEM,{x,y});
        }else{
            p.healthCurrentChance = p.healthCurrentChance + p.healthIncrease;
        }

        if(chance< p.shieldCurrentChance && drop == false){
            p.shieldCurrentChance = p.shieldChanceBase;
            drop = true;
            pSub.publish(globe.GENERATESHIELDITEM,{x,y});
        }else{
            p.shieldCurrentChance = p.shieldCurrentChance + p.shieldIncrease;
        }

        if(chance< p.amnoCurrentChance && drop == false){
            p.amnoCurrentChance = p.amnoChanceBase;
            drop = true;
            pSub.publish(globe.GENERATEMISSILEAMNOITEM,{x,y});
        }else{
            p.amnoCurrentChance = p.amnoCurrentChance + p.amnoIncrease;
        }
	}

	createHealthItem(topic, {x,y}){
		let id = this.getNewId();
		this.props.items[id]=new healthItem({x,y,angle:0,id});
		pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x,y,params:{driftX:0,driftY:-0.5,text:"PICKUP",fontSize:11, color:"#FFFFFF"}});
	}

	createShieldItem(topic, {x,y}){
		let id = this.getNewId();
		this.props.items[id]=new shieldItem({x,y,angle:0,id});
		pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x,y,params:{driftX:0,driftY:-0.5,text:"PICKUP",fontSize:11, color:"#FFFFFF"}});
	}

	createMissileAmnoItem(topic, {x,y}){
		let id = this.getNewId();
		this.props.items[id]=new missileAmnoItem({x,y,angle:0,id});
		pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x,y,params:{driftX:0,driftY:-0.5,text:"PICKUP",fontSize:11, color:"#FFFFFF"}});
	}

	createMissileStormItem(topic, {x,y}){
		let id = this.getNewId();
		this.props.items[id]=new massMissileItem({x,y,angle:0,id});
		pSub.publish(globe.ADDANIMATION,{type:"textAnimation",x,y,params:{driftX:0,driftY:-0.5,text:"PICKUP",fontSize:11, color:"#FFFFFF"}});
	}
	
	removeItem(topic, {id}){
		let p = this.props;
		delete p.items[id];
	}	
	
}