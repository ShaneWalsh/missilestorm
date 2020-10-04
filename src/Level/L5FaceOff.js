/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class L5FaceOff extends LevelTemplate{

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

        if(p.titan.props.health < 1){ // mission complete + at least one tower surivied
            pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionComplete"});
            var score=gameInstance.props.ship.props.score

            globe.isPlaying = false;
            globe.isMoveKeysListening = false;
            globe.isClickListening = false;
            gameInstance.pause();

            globe.levelFinishedMenu.removeClass("noDisplay");
            pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
            pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});

            window.gameState.props.titan++;
            completeLevelUnlockNext(5);
        }

        // display health for transport
        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);

        gameInstance.displayHealth({x:x+600,y:y+5,health:p.titan.props.health,ctxToDraw:ctxHighlight, maxHealth:p.titan.props.maxHealth,color:'#f72318'});
        Write(x+600,y+15,`MegaFactory`,12,'#f72318',ctxHighlight);
	}

	levelUpEffect(topic, {botCount}){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;
        if(level == 5){ // big one
            // another dasher
            // another big one
            // speed increase between spawns?
            //p.botslevel.keepersMax++;
        }
        else if(level % 3 == 0){ // medium
            p.botslevel.glidersMax++;
        }
        else{ // minor
            p.botslevel.dashersMax++;
        }
        if(level == 1){
            p.botslevel.dashersMax++;
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
        gameInstance.props.ship.setStats(gameInstance.props.stateManager.props.shipStats);
        var mapWidth = 920;
        var mapHeight = 512;

        globe.mapHeight = mapHeight;
        globe.mapWidth = mapWidth;
		globe.mapHeightPadding=mapHeight+50, // used in calucations of elements that have left the screen, like bullets
        globe.mapWidthPadding=mapWidth+50,

        globe.mapOffsetX=0, // used to determine where on the map to draw
        globe.mapOffsetY=0,
        globe.mapOffsetXMax = mapWidth - globe.mapOffsetXMin,
        globe.mapOffsetYMax = mapHeight - globe.mapOffsetYMin,

        updatePreRenderCanvas({mapHeight,mapWidth});

        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);

        let dasherStats = {speed:2,health:10, damage:10};
        let gliderStats = {lazerTimer:140,damage:5};

        // set the towers
        p.titan = gameInstance.props.botManager.generateTitan({x:980,y:300,angle:0,speed:1,targetObj:gameInstance.props.ship});

        //botManager
        //- 10 so spawn threshold should never be broken
        p.botslevel = {spawnThreshold:-10,dashersMax: 0, glidersMax:10, keepersMax: 3, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
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