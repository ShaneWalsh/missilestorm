/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class L3CounterAttack extends LevelTemplate{

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

            var highScore = score;
            globe.campaignMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
            window.gameState.saveGameState({});
        }

        if(p.waves < 1){ // mission complete
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionComplete"});
            var score=gameInstance.props.ship.props.score

            globe.isPlaying = false;
            globe.isMoveKeysListening = false;
            globe.isClickListening = false;
            gameInstance.pause();

            globe.levelFinishedMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});

            // unlock the next mission here.
            completeLevelUnlockNext(3);
        }

        this.displayWaves({waves:p.waves});
	}

	levelUpEffect(topic, {botCount}){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;

        let dasherStats = {speed:3,health:10, damage:5};
        let gliderStats = {lazerTimer:200};

        p.waves--;
        if(level == 1){
            p.botslevel = {spawnThreshold:1,dashersMax: 5, glidersMax:5, keepersMax: 1, carriersMax: 2, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 2){
            p.botslevel = {spawnThreshold:1,dashersMax: 5, glidersMax:10, keepersMax: 1, carriersMax: 2, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 3){
            p.botslevel = {spawnThreshold:1,dashersMax: 50, glidersMax:0, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 4){
            p.botslevel = {spawnThreshold:1,dashersMax: 10, glidersMax:15, keepersMax: 1, carriersMax: 3, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
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
        var mapWidth = 1840;
        var mapHeight = 1024;

        globe.mapHeight = mapHeight;
        globe.mapWidth = mapWidth;
		globe.mapHeightPadding=mapHeight+50, // used in calucations of elements that have left the screen, like bullets
        globe.mapWidthPadding=mapWidth+50,

        globe.mapOffsetX=0, // used to determine where on the map to draw
        globe.mapOffsetY=0,
        globe.mapOffsetXMax = mapWidth - globe.mapOffsetXMin,
        globe.mapOffsetYMax = mapHeight - globe.mapOffsetYMin,

        updatePreRenderCanvas({mapHeight,mapWidth});

        // todo this would be a good place to load the map from a file lol. but we dont have that at the moment
        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,920,512,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,920,0,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,0,512,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);

        let dasherStats = {speed:3,health:10, damage:5};
        let gliderStats = {lazerTimer:200};

        //botManager
        p.botslevel = {spawnThreshold:1,dashersMax: 10, glidersMax:5, keepersMax: 1, carriersMax: 2, cometsMax: 0, dasherStats,gliderStats};
        gameInstance.props.botManager.updateBots(p.botslevel);

        gameInstance.props.botManager.props.spawnMethod = this.updateBots.bind(this);
        p.timebetweenBots=10;
        p.timebetweenBotsCounter=11;

        p.refreshBots=240;
        p.refreshBotsCounter=0;
    }

    updateBots({botManager}){
        var p = this.props;
        var pb = botManager.props;
        // check if I need to generate any more units
        if(p.timebetweenBotsCounter >= p.timebetweenBots){
            p.timebetweenBotsCounter = 0;
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