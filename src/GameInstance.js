/* 
 *  Created by Shane Walsh
 *  
 */

import {doBoxesIntersect, drawBox, drawBorder,Write, DrawImage,absVal} from "./Libs/2dGameLib";
import Ship from "./Ship/Ship";
import BotManager from "./BotManager";
import StateManager from "./StateManager";
import LevelManager from "./LevelManager";
import ItemManager from "./ItemManager";
import AudioManager from "./AudioManager";
import AnimationManager from "./Animation/AnimationManager";

// GameInstance will be unique for every game, this is where all of the game specific logic will be, all of the default stuff I can reuse will be in the javascriptmain
export default class GameInstance{
    constructor(){
        this.props = {
			playing:false,
			totalResources: 52,
			loadedResources: 0,
			allResourcesLoaded: false,
			ship:undefined,
			botManager:undefined,
			levelManager:undefined,
			animationManager:undefined,
			itemManager:undefined,
			stateManager:undefined,
			audioManager:new AudioManager(),
			
		};
    }

    // survival mode
    startNewGame({levelName}){// create the ship, set the levels etc, amno, health etc
		var p = this.props;
		
		if(p.ship)  pSub.unsubscribe(p.ship);
		p.ship = new Ship({x:250,y:250});
		
		p.playing = true;
		
		if(p.botManager)  pSub.unsubscribe(p.botManager);
		p.botManager = new BotManager({});
		
		if(p.animationManager)  pSub.unsubscribe(p.animationManager);
		p.animationManager = new AnimationManager();
		
		if(p.itemManager)  pSub.unsubscribe(p.itemManager);
		p.itemManager = new ItemManager();
		
		if(p.levelManager){
		    pSub.unsubscribe(p.levelManager);
		    if(p.levelManager.props.levelInstance) pSub.unsubscribe(p.levelManager.props.levelInstance);
		}
		p.levelManager = new LevelManager({});

		p.levelManager.setLevel({levelName});
	}
	
	isGameOver(){

	}

	loadResources() // Just want to give the screen a 2 second pause so it can setup all of the js and dependencies etc.
    {
        this.props.stateManager = new StateManager();
        setTimeout(this.loadResourcesForReal.bind(this), 2000);
    }

    loadResourcesForReal() // trigger loading of resources
    {
		this.props.backgroundImg = this.loadImage({src:require('../imgs/background/background2.png')});

		this.props.backgroundColonyImg = this.loadImage({src:require('../imgs/background/background4Colony.png')});

		this.props.shipImg = this.loadImage({src:require('../imgs/Ship/Ship2.png')});

		this.props.bulletImg = this.loadImage({src:require('../imgs/Ship/Bullet2.png')});		
		
		this.props.transportImg = this.loadImage({src:require('../imgs/Bots/Transport.png')});

		this.props.gliderImg = this.loadImage({src:require('../imgs/Bots/Glider.png')});

		this.props.gliderMovementImg = this.loadImage({src:require('../imgs/Bots/GliderMovement2.png')});

		this.props.dasherMovementImg = this.loadImage({src:require('../imgs/Bots/DasherMovement.png')});

		this.props.keeperMovementImg = this.loadImage({src:require('../imgs/Bots/KeeperMovement.png')});

		this.props.shipMovementImg = this.loadImage({src:require('../imgs/Ship/Ship2Movement2.png')});

		this.props.battleshipDeathImg = this.loadImage({src:require('../imgs/Animation/BattleShipDeathSequence.png')});

		this.props.missileImg = this.loadImage({src:require('../imgs/Ship/Missile.png')});
		
		this.props.healthItemImg = this.loadImage({src:require('../imgs/Items/HealthItem.png')});

		this.props.stormItemImg = this.loadImage({src:require('../imgs/Items/MissileStormItem.png')});

		this.props.missileAmnoItemImg = this.loadImage({src:require('../imgs/Items/MissileItem.png')});

		this.props.shieldAmnoItemImg = this.loadImage({src:require('../imgs/Items/ShieldItem.png')});

		this.props.dasherImg = this.loadImage({src:require('../imgs/Bots/Dasher.png')});
		
		this.props.carrierImg = this.loadImage({src:require('../imgs/Bots/CarrierMiniEmpty.png')});

		this.props.titanImg = this.loadImage({src:require('../imgs/Bots/Titan.png')});

		this.props.megaTitanImg = this.loadImage({src:require('../imgs/Bots/MegaTitan.png')});

		this.props.battleshipImg = this.loadImage({src:require('../imgs/Bots/BattleShip.png')});

		this.props.bsTowerImg = this.loadImage({src:require('../imgs/Bots/BattleShipTurret.png')});

		this.props.turretImg = this.loadImage({src:require('../imgs/Bots/Turret.png')});

		this.props.towerBaseImg = this.loadImage({src:require('../imgs/Bots/TowerBase2.png')});

		this.props.lazerImg = this.loadImage({src:require('../imgs/Bots/Lazer.png')});
		
		this.props.expImg = this.loadImage({src:require('../imgs/animation/Explosion3.png')});//BombExploding
		
		this.props.blastSprite = this.loadImage({src:require('../imgs/Ship/Blast3.png')});
		
		this.props.beeImg = this.loadImage({src:require('../imgs/Bots/Bee.png')});
		
		this.props.beeKeeperImg = this.loadImage({src:require('../imgs/Bots/BeeKeeper.png')});
		
		this.props.cometImg = this.loadImage({src:require('../imgs/Bots/CometSmall.png')});
		//animation
		this.props.dasherDeathImg = this.loadImage({src:require('../imgs/animation/DasherDeath.png')});//Dasher

		this.props.defenceTowerDeathImg = this.loadImage({src:require('../imgs/animation/DefenseTowerDeath.png')});
		//animation
		this.props.gliderDeathImg = this.loadImage({src:require('../imgs/animation/GliderDeath.png')});//Glider 
		//animation
		this.props.beeKeeperDeathImg = this.loadImage({src:require('../imgs/animation/BeeKeeperDeath.png')});//BeeKeeper
		//animation
		this.props.carrierDeathImg = this.loadImage({src:require('../imgs/animation/CarrierMDeathSheet.png')});//Carrier
		//animation
		this.props.shieldAnimImg = this.loadImage({src:require('../imgs/animation/Shield_Ani_3.png')});
		//animation
		this.props.cometDeathAnimImg = this.loadImage({src:require('../imgs/animation/CometSmallDeathAnimation2.png')});

		this.props.defenseTowerImg = this.loadImage({src:require('../imgs/Bots/DefenseTower.png')});

		this.props.baseTileImg = this.loadImage({src:require('../imgs/Tiles/Base2.png')});

		this.loadAudio({file:"sound/Light-Years_V001_Looping.mp3",name:"mainBackgroundMusic",type:"TYPEBG"});
		
		this.loadAudio({file:"sound/Monster-Stake-Out_Looping.mp3",name:"overBackgroundMusic",type:"TYPEBG"});
		let sfvolume = 0.2;
		this.loadAudio({file:"sound/scaevola__new-lazer_1.mp3",name:"lazersound1",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/Laser-Ricochet3.mp3",name:"missileLaunch",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/Smoosh.mp3",name:"Smoosh",type:"TYPESOUND",volume:sfvolume});
		
		this.loadAudio({file:"sound/Hull-Breach-4.mp3",name:"Hit",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/Explosion1.mp3",name:"exp",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/PowerDown16.mp3",name:"missfire",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/UI_Quirky28.mp3",name:"shieldRepair",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/Mad-Voltage-sfx.mp3",name:"powerShieldPickup",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/MissilesDepleted.mp3",name:"missilesDepleted",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/MissilesArmed4.mp3",name:"missilesArmed",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/MissileStormPickup.mp3",name:"missileStormPickup",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/Unstoppable.mp3",name:"unstoppable",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/SystemCritical.mp3",name:"systemsCritical",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/MissionFailed.mp3",name:"missionFailed",type:"TYPESOUND",volume:sfvolume});

		this.loadAudio({file:"sound/custom/MissionComplete3.mp3",name:"missionComplete",type:"TYPESOUND",volume:sfvolume});

	}
	
	postLoad(){
		this.props.audioManager.loopAudio("",{name:"mainBackgroundMusic"}); //bg music so loops by default
		this.props.audioManager.loopAudio("",{name:"overBackgroundMusic"});
	}
	
	loadImage({src}){
		let imga = new Image();
		imga.onload = function() { this.resourceLoaded(); }.bind(this);
		if(src.indexOf("data:image") > -1){
		    imga.src = src;
		}
		else{
		    imga.src = "bin/"+src;
		}
		return imga;
	}
	
	loadAudio({file,name,type = "TYPESOUND",volume =0.4}){
		let p = this.props;
		var tmp = new Audio();
		tmp.src = file;
		let self = this;
		$jq(tmp).on('loadeddata',function(){
			p.audioManager.addAudio({name,audioObject:this,type,volume});
			self.resourceLoaded();
		});
	}
	
	resourceLoaded(){
		this.props.loadedResources++;
		logg("resources loaded:"+this.props.loadedResources);
		pSub.publish(globe.GI_RESOURCE_LOADED,{total:this.props.totalResources,current:this.props.loadedResources});
		if(this.props.loadedResources >= this.props.totalResources && !this.props.allResourcesLoaded){
			logg("all resources loaded");
			this.postLoad();
			pSub.publish(globe.GI_RESOURCES_LOADED,{});
			this.props.allResourcesLoaded = true;
		}
	}
	
	pause(){
		// pause the whole game
		this.props.playing = false;
	}
	play(){
		// pause the whole game
		this.props.playing = true;
	}
	
	update(){ // loop through objects and call update on them.
		var p = this.props;
		if(p.playing){
			// clear the npc canvas and draw all of the elements again
			window.ctxNPC.clearRect(0,0,globe.mapWidth,globe.mapHeight);
			
			// do something botmanager, move all of the AI units etc
			p.botManager.update();
			
			// update player ship, ship goes second to remove targeting
			p.ship.update();
			
			// collision detection // should probably extract this into another class
			this.collisionDetection();
			
			// update the other objects in the game not related to combat
			
			// power ups
				// invincible for 5 seconds, can crash into bots
				// enhanced weapons!
				// clear the screen 
				// missile spam, every single bot gets targeted
			window.ctxHighlight.clearRect(0,0,globe.mapWidth,globe.mapHeight);
			p.itemManager.update();
				
			// explosions
			p.animationManager.update();
			p.ship.updateBlast(); // need this to appear above small explosions
			
			// todo space proximity mines?
			
			// update health display, on highlight so its under the game elements
			// p.ship.health
			var x = absVal(globe.mapOffsetX);
            var y = absVal(globe.mapOffsetY);
			this.displayHealth({x,y,health:p.ship.props.health,ctxToDraw:ctxHighlight, maxHealth:p.ship.props.maxHealth});
			this.displayShields({x,y:y+40,shields:p.ship.props.powerShields,ctxToDraw:ctxHighlight});
			this.displayMissile({x,y,amno:p.ship.props.missileAmno,ctxToDraw:ctxHighlight, missileMax:p.ship.props.missileMax});
			// update scoreboard
			this.displayScore({x,y,score:p.ship.props.score,ctxToDraw:ctxHighlight});

			p.levelManager.update();

			p.audioManager.update();
				
		}
	}
	
	collisionDetection(){
		var p = this.props;

        // first check if my bullets have hit the opponents
        this.checkColisionsAndAct(p.ship.props.bullets,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers,p.botManager.props.carriers,p.botManager.props.bees], function(bul,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bul.props.x,y:bul.props.y,type:"explosion"});
            bot.processDamage(bul.props);
            pSub.publish(globe.REMOVEBULLET,{id:bul.props.id});
        }, true);

        this.checkColisionsAndAct(p.ship.props.bullets,[p.botManager.props.comets,p.botManager.props.transports], function(bul,bot){  let p = gameInstance.props;
            p.animationManager.addAnimation({x:bul.props.x+bul.props.hWidth,y:bul.props.y+bul.props.hHeight,type:"explosion"});
            pSub.publish(globe.REMOVEBULLET,{id:bul.props.id});
        }, true);

        // good guy bullets, ship should not be separate, but you live and learn for future sure :D
        this.checkColisionsAndAct(p.botManager.props.goodBullets,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers,p.botManager.props.carriers,p.botManager.props.bees], function(bul,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bul.props.x,y:bul.props.y,type:"explosion"});
            bot.processDamage(bul.props);
            pSub.publish(globe.REMOVEGOODBULLET,{id:bul.props.id});
        }, true);

        this.checkColisionsAndAct(p.botManager.props.goodBullets,[p.botManager.props.comets], function(bul,bot){  let p = gameInstance.props;
            p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
            pSub.publish(globe.REMOVEGOODBULLET,{id:bul.props.id});
        }, true);

        // Missile Loop
        this.checkColisionsAndAct(p.ship.props.missiles,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers,p.botManager.props.carriers,p.botManager.props.bees], function(mil,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
            var lx = mil.props.x +((bot.props.x - mil.props.x)/2)
            var ly = mil.props.y +((bot.props.y - mil.props.y)/2)
            p.ship.addBlast({x:lx,y:ly});
            bot.processDamage(mil.props);
            pSub.publish(globe.REMOVEMISSILE,{id:mil.props.id});
        }, true);

        this.checkColisionsAndAct(p.ship.props.missiles,[p.botManager.props.comets,p.botManager.props.transports], function(mil,bot){  let p = gameInstance.props;
            p.animationManager.addAnimation({x:mil.props.x,y:mil.props.y,type:"explosion"});
            p.ship.addBlast({x:bot.props.x-bot.props.hWidth,y:bot.props.y-bot.props.hHeight});
            pSub.publish(globe.REMOVEMISSILE,{id:mil.props.id});
        }, true);


		//explosion colision with bots
        this.checkColisionsAndAct(p.ship.props.explosions,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers, p.botManager.props.carriers, p.botManager.props.bees], function(exp,bot){
            bot.processDamage(exp.props);
        }, false);

		// bots projectiles
		this.checkColisionsAndAct(p.botManager.props.lazers,[{1:p.ship},p.botManager.props.transports, p.botManager.props.alliedTowers], function(bot,ship){let p = gameInstance.props;
            ship.processDamage({damage:bot.props.damage});
            p.animationManager.addAnimation({x:ship.props.x,y:ship.props.y,type:"explosion"});
            pSub.publish(globe.REMOVELAZER,{id:bot.props.id});
        }, true);

		this.checkColisionsAndAct(p.botManager.props.bees,[{1:p.ship},p.botManager.props.transports, p.botManager.props.alliedTowers], function(bot,ship){let p = gameInstance.props;
            ship.processDamage({damage:bot.props.damage});
            p.animationManager.addAnimation({x:ship.props.x,y:ship.props.y,type:"explosion"});
            pSub.publish(globe.REMOVEBEE,{id:bot.props.id});
        }, true);

        this.checkColisionAndAct(p.botManager.props.carriers,{1:p.ship}, function(bot,ship){let p = gameInstance.props;
            ship.processDamage({damage:bot.props.damage});
            p.animationManager.addAnimation({x:ship.props.x,y:ship.props.y,type:"explosion"});
        }, false);

		//ship Collision detection with 3 sets of bots
		this.checkColisionsAndAct([p.ship],[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers], function(ship,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
            ship.processDamage({damage:bot.props.damage});
            bot.processDamage({pierce:200,blast:200,blunt:200});
        }, false);
        this.checkColisionsAndAct(p.botManager.props.transports,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers], function(ship,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
            ship.processDamage({damage:bot.props.damage});
            bot.processDamage({pierce:200,blast:200,blunt:200});
        }, true);
        this.checkColisionsAndAct(p.botManager.props.alliedTowers,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers], function(ship,bot){ let p = gameInstance.props;
            p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
            ship.processDamage({damage:bot.props.damage});
            bot.processDamage({pierce:200,blast:200,blunt:200});
        }, true);

		// Comet Collisions with everything else! // I should have an array version of this, where I can just pass in an array of objects, like dashers/gliders/bee's etc, save on code.
		this.checkColisionsAndAct(p.botManager.props.comets,[p.botManager.props.dashers,p.botManager.props.gliders,p.botManager.props.keepers,p.botManager.props.bees,p.botManager.props.lazers], function(com,bot){  let p = gameInstance.props;
			p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
			bot.processDamage({pierce:200,blast:200,blunt:200});
		}, false);

		this.checkColisionsAndAct(p.botManager.props.comets,[{1:p.ship},p.botManager.props.transports,p.botManager.props.carriers], function(com,bot){  let p = gameInstance.props;
			bot.props.health -= 15;
			p.animationManager.addAnimation({x:bot.props.x,y:bot.props.y,type:"explosion"});
			// play comet death animation
			p.animationManager.addAnimation({x:com.props.x,y:com.props.y,type:"cometDeath",angle: com.props.angle});
			pSub.publish(globe.REMOVECOMET,{id:com.props.id});
		}, true);
	}
	
	checkColisionAndAct(looper,target,functionToCall,breakLoopOnColision){
		loop: for (let key in looper) {
			if (looper.hasOwnProperty(key)) {
				for (let keyd in target) {
					if (target.hasOwnProperty(keyd)) {
						if(doBoxesIntersect(looper[key],target[keyd])){
							functionToCall(looper[key],target[keyd]);
							if(breakLoopOnColision){
								continue loop;
							}
						}
					}
				}
			}
		}			
	}
	
	checkColisionsAndAct(looper,targets,functionToCall,breakLoopOnColision){
		loop: for (let key in looper) {
			if (looper.hasOwnProperty(key)) {
				for(let i = 0; i < targets.length;i++){
					let target = targets[i];
					for (let keyd in target) {
						if (target.hasOwnProperty(keyd)) {
							if(doBoxesIntersect(looper[key],target[keyd])){
								functionToCall(looper[key],target[keyd]);
								if(breakLoopOnColision){
									continue loop;
								}
							}
						}
					}
				}
			}
		}			
	}

    displayHint({x=0,y=0,hint1,hint2,padx=0,ctxToDraw}){
        var color = '#34FA08';
        ctxToDraw.beginPath();
        ctxToDraw.moveTo(x+250, y+20);
        ctxToDraw.lineTo(x+550+padx, y+20);
        ctxToDraw.lineTo(x+550+padx, y+40);
        ctxToDraw.lineTo(x+250, y+40);
        ctxToDraw.lineTo(x+250, y+20);
        ctxToDraw.strokeStyle = color;
        ctxToDraw.stroke();
        Write(x+260,y+35,`${hint1}`,15,color,ctxToDraw);
    }
	
	displayHealth({x,y,health,ctxToDraw,maxHealth,color='#34FA08'}){ //>>1 means left shift, so divide by 2
		//drawBorder(3,3,56,36,ctxToDraw,'#34FA08');

		var max = maxHealth / 100;
        var healthLost = maxHealth-health;
        healthLost = ((healthLost)/max);
        healthLost = Math.floor(healthLost);

		var bars = (110-healthLost)/10; // I use 110 because 9/10 is less than 1 :D
        bars = (0.5 + bars) << 0 // remove floating point values

        ctxToDraw.beginPath();
        ctxToDraw.moveTo(x+5, y+20);
        ctxToDraw.lineTo(x+125, y+20);
        ctxToDraw.lineTo(x+105, y+40);
        ctxToDraw.lineTo(x+5, y+40);
        ctxToDraw.lineTo(x+5, y+20);
        ctxToDraw.strokeStyle = color;
        ctxToDraw.stroke();

        if(bars < 4){
            color = '#dd0b00';
        }
        else if(bars < 8){
            color = '#f9a411';
        }

        for(var i =0; i < bars; i++){
            drawBox((x+8)+(i*5),y+23,2,14,ctxToDraw,color,color);
        }

        Write(x+70,y+35,`${100-healthLost}%`,15,color,ctxToDraw);

	}

	displayShields({x,y,shields,ctxToDraw,color='#7EEBFF'}){
        ctxToDraw.beginPath();
        ctxToDraw.moveTo(x+5, y);
        ctxToDraw.lineTo(x+104, y);
        ctxToDraw.lineTo(x+95, y+10);
        ctxToDraw.lineTo(x+5, y+10);
        ctxToDraw.lineTo(x+5, y);
        ctxToDraw.strokeStyle = color;
        ctxToDraw.stroke();

        for(var i =0; i < shields; i++){
            drawBox((x+5)+(i*5),y,2,10,ctxToDraw,color,color);
        }

	}



	displayMissile({x,y,amno,ctxToDraw,missileMax}){

        var color = '#34FA08';
        ctxToDraw.beginPath();
        ctxToDraw.moveTo(x+5, y+490);
        ctxToDraw.lineTo(x+105, y+490);
        ctxToDraw.lineTo(x+125, y+510);
        ctxToDraw.lineTo(x+5, y+510);
        ctxToDraw.lineTo(x+5, y+490);
        ctxToDraw.strokeStyle = color;
        ctxToDraw.stroke();
        // work out missiles max draw 10 missiles depending on the ratio
        // add a counter on the right
        var missilePerImage = missileMax/10;
        var total = amno/missilePerImage

        if(amno < 5){
            color = '#910e02';
        }
        else if(amno < 9){
            color = '#f9a411';
        }

        Write(x+60,y+505,`${amno}/${missileMax}`,15,color,ctxToDraw);
        DrawImage(0,0,16,8,x+20,y+494,24,14,ctxToDraw,this.props.missileImg);
        //DrawRotateImage(0,0,16,8,this.props.x,this.props.y,16,8,window.ctxNPC,this.props.missileImg,this.props.angle,this.props.x+this.props.hWidth, this.props.y+this.props.hHeight);
    }
	
	displayScore({x,y,score,ctxToDraw}){
	    var color = '#34FA08';
	    ctxToDraw.beginPath();
        ctxToDraw.moveTo(x+800, y+20);
        ctxToDraw.lineTo(x+900, y+20);
        ctxToDraw.lineTo(x+900, y+40);
        ctxToDraw.lineTo(x+820, y+40);
        ctxToDraw.lineTo(x+800, y+20);
    	ctxToDraw.strokeStyle = color;
        ctxToDraw.stroke();
        Write(x+820,y+35,`${score}`,15,color,ctxToDraw);
	}

	displayMiniMap({}){

	}
}