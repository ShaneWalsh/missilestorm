/* 
 *  Created by Shane Walsh
 *  
 */

import Dasher from "./Bots/Dasher";
import Glider from "./Bots/Glider";
import BeeKeeper from "./Bots/BeeKeeper";
import Carrier from "./Bots/Carrier";
import Titan from "./Bots/Titan";
import MegaTitan from "./Bots/MegaTitan";
import Comet from "./Bots/Comet";
import Lazer from "./Bots/Lazer";
import GoodBullet from "./Bots/GoodBullet";
import Bee from "./Bots/Bee";
import Transport from "./Bots/Transport";
import Battleship from "./Bots/Battleship";
import DefenseTower from "./Bots/DefenseTower";
import {pointInsideSprite,absVal,totalDistance} from "./Libs/2dGameLib";

// bot Ideas
	//#  mine layer
	// jard, much faster than the dasher
	// heavy glider, carrier but with 2 gun turrets
	// 

export default class BotManager{
    constructor({level=0}){
        this.props = {
			playing:false,
			level,

            alliedTowers:{},
            alliedTowersCount:0,

			transports:{},
			transportsCount:0,

			dashers:{},
			dashersMax:0,
			dashersCount:0,
			dasherStats:{},
			
			gliders:{},
			glidersMax:0,
			glidersCount:0,
			gliderStats:{},
			
			keepers:{},
			keepersMax:0,
			keepersCount:0,
			keeperStats:{},
			
			carriers:{},
			carriersMax:0,
			carriersCount:0,
			carrierStats:{},
			
			timebetweenBots:10, // 10 frames
			timebetweenBotsCounter:11,
			
			lazers:{},
			goodBullets:{},
			bees:{},
			
			comets:{},
			cometsMax:0,
			cometsCount:0,
			
			spawnThreshold:3, // should be zero at start and increase to 3 after first few tut levels
			
            unitId:1,  // id 0 is reserved for the player
			botCount:0, // all bots not just one type

			spawnMethod:undefined,
			targeting: true
		};
		this.setupListeners();
    }

	update(){ // move all of the minions
		var p = this.props;
		
		p.spawnMethod({botManager:this});
		
		for (let key in p.dashers) {
			if (p.dashers.hasOwnProperty(key)) {
				let d = p.dashers[key];
				d.update({botManager:this});
				if(p.targeting){
					if(pointInsideSprite({x:getMouseXOff(),y:getMouseYOff()},d)){
						this.foundTarget(d);
					}
				}
			}
		}
		for (let key in p.gliders) {
			if (p.gliders.hasOwnProperty(key)) {
				let d = p.gliders[key];
				d.update({botManager:this});
				if(p.targeting){
					if(pointInsideSprite({x:getMouseXOff(),y:getMouseYOff()},d)){
						this.foundTarget(d);
					}
				}
			}
		}
		for (let key in p.keepers) {
			if (p.keepers.hasOwnProperty(key)) {
				let d = p.keepers[key];
				d.update({botManager:this});
				if(p.targeting){
					if(pointInsideSprite({x:getMouseXOff(),y:getMouseYOff()},d)){
						this.foundTarget(d);
					}
				}
			}
		}
		
		for (let key in p.carriers) {
			if (p.carriers.hasOwnProperty(key)) {
				let d = p.carriers[key];
				d.update({botManager:this});
				if(p.targeting){
					if(pointInsideSprite({x:getMouseXOff(),y:getMouseYOff()},d)){
						this.foundTarget(d);
					}
				}
			}
		}
		
		for (let key in p.comets) {
			if (p.comets.hasOwnProperty(key)) {
				let d = p.comets[key];
				d.update();
			}
		}
		for (let key in p.transports) {
			if (p.transports.hasOwnProperty(key)) {
				let d = p.transports[key];
				d.update({botManager:this});
			}
		}
		for (let key in p.alliedTowers) {
            if (p.alliedTowers.hasOwnProperty(key)) {
                let d = p.alliedTowers[key];
                d.update({botManager:this});
            }
        }
		for (let key in p.lazers) {
			if (p.lazers.hasOwnProperty(key)) {
				let d = p.lazers[key];
				d.update();
			}
		}
		for (let key in p.goodBullets) {
			if (p.goodBullets.hasOwnProperty(key)) {
				let d = p.goodBullets[key];
				d.update();
			}
		}
		for (let key in p.bees) {
			if (p.bees.hasOwnProperty(key)) {
				let d = p.bees[key];
				d.update({botManager:this});
			}
		}
	}
	
	updateBots(bots){
		let p = this.props;

		p.dashersMax = bots.dashersMax;
		p.glidersMax = bots.glidersMax;		
		p.keepersMax = bots.keepersMax;
		p.carriersMax = bots.carriersMax;
		p.cometsMax = bots.cometsMax;
        // update stats
        if(bots.dasherStats)
            p.dasherStats = bots.dasherStats;
        if(bots.gliderStats)
            p.gliderStats = bots.gliderStats;
        if(bots.keeperStats)
            p.keeperStats = bots.keeperStats;
        if(bots.carrierStats)
            p.carrierStats = bots.carrierStats;
        if(bots.spawnThreshold)
            p.spawnThreshold = bots.spawnThreshold;
	}
	
	checkBotCount(){
		if(this.props.botCount < this.props.spawnThreshold){
			//this.props.botCount = 0;
			pSub.publish(globe.ALLBOTSDESTROYED,{});
		}
	}

	generateTransport({x,y,angle=0,speed=3,targetObj}){
	    let id = this.getNewId();

        this.props.transports[id]=new Transport({x,y,angle,id, speed,targetObj});
        return this.props.transports[id];
	}

	generateBattleship({x,y,angle=0,speed=3,targetObj, moveTargetObj}){
	    let id = this.getNewId();

        this.props.transports[id]=new Battleship({x,y,angle,id, speed,targetObj,moveTargetObj});
        return this.props.transports[id];
	}

	generateDefenseTower({x,y,angle=0,speed=3,targetObj}){
        let id = this.getNewId();

        this.props.alliedTowers[id]=new DefenseTower({x,y,angle,id, speed,targetObj});
        return this.props.alliedTowers[id];
    }
	
	generateDasher(){
		let pos = this.getRandomStartCords();
		let x = pos.x;
		let y = pos.y;
		
		let id = this.getNewId();
		
		this.props.dashers[id]=new Dasher({x,y,angle:0,id,targetObj: gameInstance.props.ship});
		this.props.dashers[id].updateStats(this.props.dasherStats);
		this.props.botCount++; 
		this.props.dashersCount++;
	}
	
	generateBee(topic, {dirX,dirY,angle,startX,startY,speed, targetObj}){
		let id = this.getNewId();
		this.props.bees[id]=new Bee({x:startX,y:startY,angle,id, speed:1,dirX,dirY,speed,targetObj});
	}
	
	generateDasherFromCarrier(topic,{x,y}){
		let id = this.getNewId();
		
		this.props.dashers[id]=new Dasher({x,y,angle:0,id, speed:3,targetObj: gameInstance.props.ship, carrier:true});
		this.props.dashers[id].updateStats(this.props.dasherStats);
		this.props.botCount++; 
		//this.props.dashersCount++;
	}
	
	generateGlider(){
		let pos = this.getRandomStartCords();
		let x = pos.x;
		let y = pos.y;
		
		let id = this.getNewId();
		
		this.props.gliders[id]=new Glider({x,y,angle:0,id, speed:1,targetObj: gameInstance.props.ship});
		this.props.gliders[id].updateStats(this.props.gliderStats);
		this.props.botCount++; 
		this.props.glidersCount++;
	}
	generateKeeper(){
		let pos = this.getRandomStartCords();
		let x = pos.x;
		let y = pos.y;
		
		let id = this.getNewId();
		
		this.props.keepers[id]=new BeeKeeper({x,y,angle:0,id, speed:1,targetObj: gameInstance.props.ship});
		this.props.keepers[id].updateStats(this.props.keeperStats);
		this.props.botCount++; 
		this.props.keepersCount++;
	}
	
	generateCarrier(){
		let pos = this.getRandomStartCords();
		let x = pos.x;
		let y = pos.y;
		
		let id = this.getNewId();
		
		this.props.carriers[id]=new Carrier({x,y,angle:0,id, speed:1,targetObj: gameInstance.props.ship});
		this.props.botCount++; 
		this.props.carriersCount++;
	}

	generateTitan({x,y,angle,speed,targetObj}){
		let id = this.getNewId();

		this.props.carriers[id]=new Titan({x,y,angle,id, speed,targetObj});
		this.props.botCount++; 
		this.props.carriersCount++;

		return this.props.carriers[id];
	}

	generateMegaTitan({x,y,angle,speed,targetObj}){
		let id = this.getNewId();

		this.props.carriers[id]=new MegaTitan({x,y,angle,id, speed,targetObj});
		this.props.botCount++; 
		this.props.carriersCount++;

		return this.props.carriers[id];
	}
	
	generateLazer(topic,{dirX,dirY,angle,startX,startY,speed,damage=3}){ 
		let id = this.getNewId();
		this.props.lazers[id]=new Lazer({x:startX,y:startY,angle,id, speed:1,dirX,dirY,speed,damage});
	}

	generateGoodBullet(topic,{dirX,dirY,angle,startX,startY,speed}){ 
		let id = this.getNewId();
		this.props.goodBullets[id]=new GoodBullet({x:startX,y:startY,angle,id, speed:1,dirX,dirY,speed});
	}
	
	generateComet(topic, {size="small"}){
		let pos = this.getRandomStartCords();
		let x = pos.x;
		let y = pos.y;
		
		let id = this.getNewId();
		
		this.props.comets[id]=new Comet({x,y,angle:0,id, speed:1});
		this.props.cometsCount++;
	}
	
	getRandomStartCords(){
		var rand = Math.random();
		var side = Math.floor(( rand* 4) + 1);
		rand = Math.random();
		
		var x = 0,
			y = 0;
		
		if(side == 1){ // left
			x = -20;
			y = Math.floor((rand * globe.mapHeight) + 1);
		}
		else if(side == 2){ // right
			x = globe.mapWidth+20;
			y = Math.floor((rand * globe.mapHeight) + 1);
		}
		else if(side == 3){ // top
			y = -20;
			x = Math.floor((rand * globe.mapWidth) + 1);
		}
		else if(side == 4){
			y = globe.mapHeight+20;
			x = Math.floor((rand * globe.mapWidth) + 1);
		}
		return {x,y};
	}
	
	getNewId(){
		var id =  this.props.unitId++;
		if(id > 100000000){ // just in case it tries to run out of bullets
			this.props.unitId = 1;
		}
		return id;
	}

	findClosestGoodGuyTarget({obj}){ // find the closet target
	    var p = this.props;
	    var ship = gameInstance.props.ship;

        var total = totalDistance(obj,ship);
        obj.props.targetObj = ship;

        // now loop on all the other good guys.
        for (let key in p.transports) {
            if (p.transports.hasOwnProperty(key)) {
                let d = p.transports[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }
        for (let key in p.alliedTowers) {
            if (p.alliedTowers.hasOwnProperty(key)) {
                let d = p.alliedTowers[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }
	}

	findClosestBadGuyTarget({obj}){ // find the closet target
        var p = this.props;
        var total = 10000;
        // now loop on all the other good guys.
        for (let key in p.dashers) {
            if (p.dashers.hasOwnProperty(key)) {
                let d = p.dashers[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }
        for (let key in p.gliders) {
            if (p.gliders.hasOwnProperty(key)) {
                let d = p.gliders[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }
        for (let key in p.keepers) {
            if (p.keepers.hasOwnProperty(key)) {
                let d = p.keepers[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }

        for (let key in p.carriers) {
            if (p.carriers.hasOwnProperty(key)) {
                let d = p.carriers[key];
                var totalDis = totalDistance(obj,d);
                if(totalDis < total){
                    total = totalDis;
                    obj.props.targetObj = d;
                }
            }
        }
    }

	setupListeners(){
		pSub.subscribe(globe.REMOVEDASHER,this.removeDasher,this);
		pSub.subscribe(globe.REMOVEGLIDER,this.removeGlider,this);
		pSub.subscribe(globe.REMOVEKEEPER,this.removeKeeper,this);
		pSub.subscribe(globe.REMOVEBEE,this.removeBee,this);
		pSub.subscribe(globe.REMOVECARRIER,this.removeCarrier,this);
		pSub.subscribe(globe.REMOVEDTOWER,this.removeDTower,this);

		pSub.subscribe(globe.GENERATELAZER,this.generateLazer,this);
		pSub.subscribe(globe.REMOVELAZER,this.removeLazer,this);
		pSub.subscribe(globe.GENERATEGOODBULLET,this.generateGoodBullet,this);
		pSub.subscribe(globe.REMOVEGOODBULLET,this.removeGoodBullet,this);
		
		pSub.subscribe(globe.GENERATEDASHER,this.generateDasherFromCarrier,this);
		pSub.subscribe(globe.GENERATEBEE,this.generateBee,this);
		
		pSub.subscribe(globe.GENERATECOMET,this.generateComet,this);
		pSub.subscribe(globe.REMOVECOMET,this.removeComet,this);
		pSub.subscribe(globe.REMOVETRANSPORT,this.removeTransport,this);
	}
	
	removeDasher(topic, {id}){
		pSub.publish(globe.CLEARTARGET,{target:this.props.dashers[id]});
	
		if(!this.props.dashers[id].props.carrier){
			this.props.dashersCount--;
			this.props.dashersMax--;
		}
		delete this.props.dashers[id];
		this.decreaseBotCount();
		this.checkBotCount();
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"Hit"});
	}	
	
	removeGlider(topic, {id}){
		pSub.publish(globe.CLEARTARGET,{target:this.props.gliders[id]});
	
		delete this.props.gliders[id];
		this.decreaseBotCount();
		this.props.glidersCount--;
		this.props.glidersMax--;
		this.checkBotCount();
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"Hit"});
	}
	
	removeKeeper(topic, {id}){
		pSub.publish(globe.CLEARTARGET,{target:this.props.keepers[id]});
		
		delete this.props.keepers[id];
		this.decreaseBotCount();
		this.props.keepersCount--;
		this.props.keepersMax--;
		this.checkBotCount();
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"Hit"});
	}
	
	removeCarrier(topic, {id}){
		pSub.publish(globe.CLEARTARGET,{target:this.props.carriers[id]});
	
		delete this.props.carriers[id];
		this.decreaseBotCount();
		this.props.carriersCount--;
		this.props.carriersMax--;
		this.checkBotCount();
		pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"Hit"});
	}

	decreaseBotCount(){
	    this.props.botCount--;
	}

	removeDTower(topic, {id}){
		delete this.props.alliedTowers[id];
	}

	removeComet(topic, {id}){
		delete this.props.comets[id];
		this.props.cometsCount--;
	}

	removeTransport(topic, {id}){
		delete this.props.transports[id];
	}
	
	removeLazer(topic, {id}){
		delete this.props.lazers[id];
	}
	removeGoodBullet(topic, {id}){
		delete this.props.goodBullets[id];
	}
	
	removeBee(topic, {id}){
		delete this.props.bees[id];
	}
	
	startTageting(){
		this.props.targeting = true;
	}
	
	stopTageting(){ // the target would still be the target though.
		this.props.targeting = false;
	}
	
	foundTarget(target){
		pSub.publish(globe.TARGETFOUND,{target:target});
	}
	
}