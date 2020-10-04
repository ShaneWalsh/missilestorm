/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage} from "../Libs/2dGameLib";
export default class LevelSurvival extends LevelTemplate{

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
            globe.overMenu.find("#latestScore").text(`Your Score: ${highScore}`);
            globe.overMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
            pSub.publish(globe.POSTSCORE,{score:highScore});
            window.gameState.saveGameState({});
         }
	}

	levelUpEffect(){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;
        let num = Math.floor((Math.random() * 3) + 1);

        let dasherStats = {speed:2,health:8, damage:5};
        let gliderStats = {lazerTimer:240};

        if(level % 10 == 0){
            p.dashersMax+=5;
            p.cometsMax++;
            if(num == 1){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+100, glidersMax:p.glidersMax, keepersMax: p.keepersMax+2, carriersMax: 0, cometsMax: p.cometsMax+5, dasherStats,gliderStats};
            }else if(num == 2){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax, glidersMax:p.glidersMax+70, keepersMax: p.keepersMax+2, carriersMax: 0, cometsMax: p.cometsMax+4, dasherStats,gliderStats};
            }else{
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+50, glidersMax:p.glidersMax+50, keepersMax: p.keepersMax+2, carriersMax: 0, cometsMax: p.cometsMax+5, dasherStats,gliderStats};
            }
        }
        else if(level % 5 == 0){
            p.keepersMax++;
            if(num == 1){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+25, glidersMax:p.glidersMax+10, keepersMax: p.keepersMax+4, carriersMax: 0, cometsMax: p.cometsMax+5, dasherStats,gliderStats};
            }else if(num == 2){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+20, glidersMax:p.glidersMax+10, keepersMax: p.keepersMax+5, carriersMax: 0, cometsMax: p.cometsMax+4, dasherStats,gliderStats};
            }else{
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+15, glidersMax:p.glidersMax+15, keepersMax: p.keepersMax+5, carriersMax: 0, cometsMax: p.cometsMax+5, dasherStats,gliderStats};
            }
        }
        else if(level % 3 == 0){
            p.glidersMax++;
            if(num == 1){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+10, glidersMax:p.glidersMax+20, keepersMax: p.keepersMax+1, carriersMax: 0, cometsMax: p.cometsMax+5, dasherStats,gliderStats};
            }else if(num == 2){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+10, glidersMax:p.glidersMax+30, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+10, dasherStats,gliderStats};
            }else{
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+15, glidersMax:p.glidersMax+15, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+10, dasherStats,gliderStats};
            }
        }
        else{ // minor
            p.dashersMax++;
            if(num == 1){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+30, glidersMax:p.glidersMax+1, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+2, dasherStats,gliderStats};
            }else if(num == 2){
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+10, glidersMax:p.glidersMax+20, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+2, dasherStats,gliderStats};
            }else{
                p.botslevel = {spawnThreshold:5,dashersMax: p.dashersMax+20, glidersMax:p.glidersMax+10, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+2, dasherStats,gliderStats};
            }
        }
        if(level == 1){
            //UNLOCKMEDAL
            p.keepersMax++;
            if(num == 1){
                p.botslevel = {spawnThreshold:3,dashersMax: p.dashersMax+10, glidersMax:p.glidersMax+4, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+0, dasherStats,gliderStats};
            }else if(num == 2){
                p.botslevel = {spawnThreshold:3,dashersMax: p.dashersMax+4, glidersMax:p.glidersMax+10, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+0, dasherStats,gliderStats};
            }else{
                p.botslevel = {spawnThreshold:3,dashersMax: p.dashersMax+8, glidersMax:p.glidersMax+8, keepersMax: 0, carriersMax: 0, cometsMax: p.cometsMax+0, dasherStats,gliderStats};
            }
        }

        gameInstance.props.botManager.updateBots(p.botslevel);
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

        p.dashersMax = 3;
        p.glidersMax = 1;
        p.keepersMax = 0;
        p.carriersMax = 0;
        p.cometsMax = 1;

        //botManager
        p.botslevel = {spawnThreshold:2, dashersMax: p.dashersMax, glidersMax:p.glidersMax, keepersMax: p.keepersMax, carriersMax: p.carriersMax, cometsMax: p.cometsMax};
        gameInstance.props.botManager.updateBots(p.botslevel);
        gameInstance.props.botManager.props.spawnMethod = this.spawnBot.bind(this);

        p.timebetweenBots=10;
        p.timebetweenBotsCounter=11;

        p.refreshBots=240;
        p.refreshBotsCounter=0;

    }

    spawnBot({botManager}){
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
    }

}