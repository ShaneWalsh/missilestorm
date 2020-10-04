/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class L1TrainingDay extends LevelTemplate{

    /**
	 check fail conditions
	 check for level progression in bots strength, new map elements etc.
	*/
	update({}){ // this is where we can do the condition checking for the level progression
        var p = this.props;
        // do game over condition checking
        if(gameInstance.props.ship.props.health < 0 ){
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionFailed"});
            var score=gameInstance.props.ship.props.score

            globe.isPlaying = false;
            globe.isMoveKeysListening = false;
            globe.isClickListening = false;
            gameInstance.pause();

            globe.campaignMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
            window.gameState.saveGameState({});
         }

        if(p.waves < 1){ // mission complete
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionComplete"}); // play mission completed
            var score=gameInstance.props.ship.props.score

            globe.isPlaying = false;
            globe.isMoveKeysListening = false;
            globe.isClickListening = false;
            gameInstance.pause();

            globe.levelFinishedMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});

            // unlock the next mission here.
            completeLevelUnlockNext(1);
        }

        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);

        gameInstance.displayHint({x,y,hint1:p.hint1,hint2:'',padx:p.padx,ctxToDraw:ctxHighlight});
	}

	levelUpEffect(topic, {botCount}){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;

        let dasherStats = {speed:2,health:8, damage:5};
        let gliderStats = {lazerTimer:240};

        p.waves--;
        if(level == 1){ 
            p.botslevel = {spawnThreshold:1,dashersMax: 20, glidersMax:10, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
            p.hint1 = "Right click or Press Space to fire Missiles";
        } else if(level == 2){ 
            p.botslevel = {spawnThreshold:1,dashersMax: 20, glidersMax:10, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
            p.hint1 = "Hover over enemies to target them. Missiles will follow the targeted bot.";
            p.padx = 250;
        } else if(level == 3){ 
            p.botslevel = {spawnThreshold:1,dashersMax: 30, glidersMax:10, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
            p.hint1 = "Missile explosions can hit many bots.";
            p.padx = 0;
        } else if(level == 4){
            let dasherStats = {speed:3,health:8, damage:5};
            let gliderStats = {health:8, lazerTimer:120};
            p.botslevel = {spawnThreshold:1,dashersMax: 30, glidersMax:11, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
            p.hint1 = "Try to keep moving, and watch for pickups!";
            p.padx = 50;
        }
        if(p.waves > 0){
            gameInstance.props.botManager.updateBots(p.botslevel);
        }
        logg("#### level up ####");
    }

	setupListeners(){
        pSub.subscribe(globe.ALLBOTSDESTROYED,this.levelUpEffect,this);
    }

    /*this is where we should set the basics for this game,
     e.g the background image, and the starting bots
     set the map size, reset all of the stuff, offsets and bots etc
     */
    init({}){
        let p = this.props;
        p.waves = 5;
        gameInstance.props.ship.setStats(gameInstance.props.stateManager.props.shipStats);

        var mapWidth = 1380;
        var mapHeight = 768;

        globe.mapHeight = mapHeight;
        globe.mapWidth = mapWidth;
		globe.mapHeightPadding=mapHeight+50, // used in calucations of elements that have left the screen, like bullets
        globe.mapWidthPadding=mapWidth+50,

        globe.mapOffsetX=0, // used to determine where on the map to draw
        globe.mapOffsetY=0,
        globe.mapOffsetXMax = mapWidth - globe.mapOffsetXMin,
        globe.mapOffsetYMax = mapHeight - globe.mapOffsetYMin,

        updatePreRenderCanvas({mapHeight,mapWidth});

        // this would be a good place to load the map from a file lol. but we dont have that at the moment
        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,0,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);

        let dasherStats = {speed:2,health:8, damage:5};
        let gliderStats = {lazerTimer:240};

        //botManager
        p.botslevel = {spawnThreshold:1,dashersMax: 10, glidersMax:5, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
        gameInstance.props.botManager.updateBots(p.botslevel);

        gameInstance.props.botManager.props.spawnMethod = this.updateBots.bind(this);
        // need his id so we know when he is dead. var id = gameInstance.props.botManager.createTransport({});
        p.timebetweenBots=10;
        p.timebetweenBotsCounter=11;

        p.refreshBots=240;
        p.refreshBotsCounter=0;

        p.hint1 = "Hold left click to fire continuously.";
        p.padx = 1;
    }

    updateBots({botManager}){
        var p = this.props;
        var pb = botManager.props;

        if(p.timebetweenBotsCounter >= p.timebetweenBots){
            p.timebetweenBotsCounter = 0;
            // gen some bots
            if(pb.dashersCount < pb.dashersMax){
                botManager.generateDasher();
            }
            if(pb.glidersCount < pb.glidersMax){
                botManager.generateGlider();
            }
            if(pb.keepersCount < pb.keepersMax){
                botManager.generateKeeper();
            }
            if(pb.carriersCount < pb.carriersMax){
                botManager.generateCarrier();
            }
            if(pb.cometsCount < pb.cometsMax){
                botManager.generateComet("",{});
            }
        }
        else{
            p.timebetweenBotsCounter++;
        }
    }

}