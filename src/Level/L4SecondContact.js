/* 
 *  Created by Shane Walsh
 *  
 */
import LevelTemplate from "./LevelTemplate";
import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class L4SecondContact extends LevelTemplate{

    /**
	 check fail conditions
	 check for level progression in bots strength, new map elements etc.
	*/
	update({}){ // this is where we can do the condition checking for the level progression
        var p = this.props;
        // do game over condition checking
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

        if(p.waves < 1){ // mission complete + at least one tower surivied
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
            completeLevelUnlockNext(4);
        }

        // display health for transport
        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);
        this.displayWaves({waves:p.waves});

        // display health for transport
        if(p.tower1.props.health > 0){
            gameInstance.displayHealth({x:x+400,y:y+5,health:p.tower1.props.health,ctxToDraw:ctxHighlight, maxHealth:p.tower1.props.maxHealth});
            Write(x+410,y+15,`Tower1`,12,'#34FA08',ctxHighlight);
        }if(p.tower2.props.health > 0){
            gameInstance.displayHealth({x:x+550,y:y+5,health:p.tower2.props.health,ctxToDraw:ctxHighlight, maxHealth:p.tower2.props.maxHealth});
            Write(x+560,y+15,`Tower2`,12,'#34FA08',ctxHighlight);
        }
        if(p.tower3.props.health > 0){
            gameInstance.displayHealth({x:x+550,y:y+470,health:p.tower3.props.health,ctxToDraw:ctxHighlight, maxHealth:p.tower3.props.maxHealth});
            Write(x+560,y+480,`Tower3`,12,'#34FA08',ctxHighlight);
        }if(p.tower4.props.health > 0){
            gameInstance.displayHealth({x:x+400,y:y+470,health:p.tower4.props.health,ctxToDraw:ctxHighlight, maxHealth:p.tower4.props.maxHealth});
            Write(x+410,y+480,`Tower4`,12,'#34FA08',ctxHighlight);
        }
	}

	levelUpEffect(topic, {botCount}){
        let p = this.props;
        p.level++;
        let level = p.level;

        let dasherStats = {speed:3,health:10, damage:5};
        let gliderStats = {lazerTimer:200};

        p.waves--;
        if(level == 1){
            p.botslevel = {spawnThreshold:10,dashersMax: 25, glidersMax:15, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 2){
            p.botslevel = {spawnThreshold:10,dashersMax: 25, glidersMax:10, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 3){
            p.botslevel = {spawnThreshold:10,dashersMax: 50, glidersMax:0, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 4){
            p.botslevel = {spawnThreshold:10,dashersMax: 25, glidersMax:15, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 5){
            p.botslevel = {spawnThreshold:10,dashersMax: 10, glidersMax:40, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 6){
            p.botslevel = {spawnThreshold:10,dashersMax: 100, glidersMax:0, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 7){
            p.botslevel = {spawnThreshold:10,dashersMax: 20, glidersMax:15, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 8){
            p.botslevel = {spawnThreshold:10,dashersMax: 10, glidersMax:15, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }else if(level == 9){
            p.botslevel = {spawnThreshold:1,dashersMax: 25, glidersMax:25, keepersMax: 1, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
            gameInstance.props.botManager.updateBots(p.botslevel);
        }
        if(p.waves > 0){
            gameInstance.props.botManager.updateBots(p.botslevel);
        }

        if(p.tower1.props.health > 0){
            p.tower1.restoreHealth();
        }if(p.tower2.props.health > 0){
            p.tower2.restoreHealth();
        }
        if(p.tower3.props.health > 0){
            p.tower3.restoreHealth();
        }if(p.tower4.props.health > 0){
            p.tower4.restoreHealth();
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
        p.waves = 10;
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

        //todo  this would be a good place to load the map from a file lol. but we dont have that at the moment
        DrawImage(0,0,920,512,0,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,920,0,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);
        DrawImage(0,0,920,512,0,512,920,512,p.ctxToDraw,gameInstance.props.backgroundColonyImg);

        DrawImage(0,0,600,400,700,350,600,400,p.ctxToDraw,gameInstance.props.baseTileImg);
        // set the towers
        p.tower2 = gameInstance.props.botManager.generateDefenseTower({x:1109,y:387,angle:0,speed:1}); // 409 37
        p.tower3 = gameInstance.props.botManager.generateDefenseTower({x:1214,y:682,angle:0,speed:1}); // 514 332
        p.tower1 = gameInstance.props.botManager.generateDefenseTower({x:819,y:404,angle:0,speed:1}); // 119 54
        p.tower4 = gameInstance.props.botManager.generateDefenseTower({x:769,y:665,angle:0,speed:1}); // 69 315

        let dasherStats = {speed:1,health:8, damage:5};
        let gliderStats = {lazerTimer:240};

        //botManager
        p.botslevel = {spawnThreshold:11,dashersMax: 40, glidersMax:10, keepersMax: 0, carriersMax: 0, cometsMax: 0, dasherStats,gliderStats};
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