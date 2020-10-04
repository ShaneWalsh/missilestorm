/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write,DrawRotateImage,degreeToRadian} from "../Libs/2dGameLib";
export default class LevelColonyAssault extends LevelTemplate{

    /**
	 check fail conditions
	 check for level progression in bots strength, new map elements etc.
	*/
	update({}){ // this is where we can do the condition checking for the level progression
        var p = this.props;
        if(gameInstance.props.ship.props.health < 0 || p.transport.props.health < 0){
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
        // are at the last location and all clear
        if(p.transport.props.timer == p.transport.props.timerWait){
            p.location++;
            if(p.location < p.locations.length){
                p.transport.props.targetObj = {props:p.locations[p.location]}
                p.transport.props.atTarget = false;
                p.transport.props.timer = 0;
            }
            if(p.transport.props.x < 100){ //
                 pSub.publish(globe.PLAYSOUNDNEWINSTANCE,{name:"missionComplete"}); // play mission completed
                var score=gameInstance.props.ship.props.score

                globe.isPlaying = false;
                globe.isMoveKeysListening = false;
                globe.isClickListening = false;
                gameInstance.pause();

                globe.levelFinishedMenu.removeClass("noDisplay");
                pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
                pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});

                completeLevelUnlockNext(7);
            }
        }

        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);
        gameInstance.displayHealth({x:x+300,y:y+5,health:p.transport.props.health,ctxToDraw:ctxHighlight, maxHealth:p.transport.props.maxHealth});
        Write(x+300,y+15,`Mining Ship`,12,'#34FA08',ctxHighlight);
	}

	levelUpEffect(){ // we have moved up a level, what does this mean for the game?
        let p = this.props;
        p.level++;
        let level = p.level;
        if(level%2 == 0){
            p.p.botslevel = {spawnThreshold:10, dashersMax: 50, glidersMax:5, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
        }
        else{
            p.p.botslevel = {spawnThreshold:10, dashersMax: 50, glidersMax:5, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
        }
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

        p.location = 0;
        p.locations = [{x:320,y:350},{x:1500,y:500}, {x:300,y:700}, {x:60,y:350}]

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

        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,0,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);

        DrawRotateImage(0,0,64,64,320,350,64,64,p.ctxToDraw,gameInstance.props.battleshipDeathImg,degreeToRadian(13),352,382);
        DrawRotateImage(0,0,64,64,1500,500,64,64,p.ctxToDraw,gameInstance.props.battleshipDeathImg,degreeToRadian(45),1532,532);
        DrawRotateImage(64,0,64,64,300,700,64,64,p.ctxToDraw,gameInstance.props.battleshipDeathImg,degreeToRadian(210),332,732);

        let dasherStats = {speed:1,health:10, damage:10};
        let gliderStats = {lazerTimer:200,damage:7};

        //botManager
        p.botslevel = {spawnThreshold:10, dashersMax: 50, glidersMax:0, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
        gameInstance.props.botManager.updateBots(p.botslevel);

        p.transport = gameInstance.props.botManager.generateTransport({x:50,y:50,angle:0,speed:1,targetObj:{props:p.locations[p.location]}});

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