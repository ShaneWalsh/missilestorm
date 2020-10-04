/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class LevelFleetBattle extends LevelTemplate{

    /**
	 check fail conditions
	 check for level progression in bots strength, new map elements etc.
	*/
	update({}){ // this is where we can do the condition checking for the level progression
        var p = this.props;
        if(gameInstance.props.ship.props.health < 0){
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
        p.frames--;

        if(p.frames < 0){
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionComplete"}); // play mission completed
            var score=gameInstance.props.ship.props.score

            globe.isPlaying = false;
            globe.isMoveKeysListening = false;
            globe.isClickListening = false;
            gameInstance.pause();

            globe.levelFinishedMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
            completeLevelUnlockNext(6);
        }

        var time = (p.frames/60);
        this.displayTime({time});
	}

	levelUpEffect(){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;
        gameInstance.props.botManager.updateBots(p.botslevel);
        logg("#### level up ####");
    }

	setupListeners(){
        //pSub.subscribe(globe.ALLBOTSDESTROYED,this.levelUpEffect,this);
    }

    /*this is where we should set the basics for this game,
     e.g the background image, and the starting bots
     set the map size, reset all of the stuff, offsets and bots etc
     */
    init({}){
        let p = this.props;
        gameInstance.props.ship.setStats(gameInstance.props.stateManager.props.shipStats);

        p.frames = 10800; //3 mins

        p.location = 0;
        p.locations = [{x:320,y:350},{x:1500,y:500}, {x:300,y:700}]

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

        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,920,512,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,920,0,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);
        DrawImage(0,0,920,512,0,512,920,512,p.ctxToDraw,gameInstance.props.backgroundImg);

        let dasherStats = {speed:2,health:10, damage:7};
        let gliderStats = {lazerTimer:180};

        //botManager
        p.botslevel = {dashersMax: 40, glidersMax:15, keepersMax: 2, carriersMax: 2, cometsMax:6, dasherStats,gliderStats};
        gameInstance.props.botManager.updateBots(p.botslevel);

        p.transport = gameInstance.props.botManager.generateBattleship({x:500,y:50,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});

        gameInstance.props.botManager.generateBattleship({x:150,y:150,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});
        gameInstance.props.botManager.generateBattleship({x:600,y:600,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});
        gameInstance.props.botManager.generateBattleship({x:300,y:300,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});
        gameInstance.props.botManager.generateBattleship({x:350,y:300,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});
        gameInstance.props.botManager.generateBattleship({x:300,y:350,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});
        gameInstance.props.botManager.generateBattleship({x:700,y:350,angle:0,speed:1,moveTargetObj:{props:p.locations[p.location]}});

        gameInstance.props.botManager.props.spawnMethod = this.updateBots.bind(this);
        p.timebetweenBots=10;
        p.timebetweenBotsCounter=11;

        p.refreshBots=240;
        p.refreshBotsCounter=0;
    }

    updateBots({botManager}){
        var p = this.props;
        var pb = botManager.props;
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

        if(p.refreshBotsCounter < p.refreshBots){
            p.refreshBotsCounter++;
        }
        else{
            botManager.updateBots(p.botslevel);
            p.refreshBotsCounter = 0;
        }
    }


}