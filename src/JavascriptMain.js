/*!
 *  Created by Shane Walsh
 *  This game is property of Shane Walsh. You may not re-distribute this game without express permission of Shane Walsh
.*  The game is distributed as is and may not be altered, re-distribute or sold without express permission of Shane Walsh.
 *  Date: 02-11-2016
 */

import {Create2DArray,drawBox,drawBorder,Write,absVal,createPreRenderCanvas} from "./Libs/2dGameLib";
import PreRenderSprite from "./Libs/PreRenderSprite";
import MouseFunctions from "./Libs/MouseFunctions";
import KeyboardTravel from "./Libs/KeyboardTravel";
import NewgroundsImpl from "./Libs/NewgroundsImpl";
import GameInstance from "./GameInstance";
import MenuManager from "./Menu/MenuManager";
import PubSub from "./PubSub/PubSub.js";
import Timer from "./Timer/Timer.js";

//require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap.min.custom.css');

require('bootstrap-slider/dist/css/bootstrap-slider.css');
window.$jq =  require('jquery');
window.jQuery = $jq;
require('bootstrap/dist/js/bootstrap.js');
require('bootstrap-slider');


var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
						   window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame
						   || function(callback) { window.setTimeout(callback,1000/60);}; //moz firefox 4 up, o Opera, ms IE 9, not standardised yet so need different browsers

var  screenHeight = 512,
     screenWidth = 920,
     mapHeight = 1024,
     mapWidth = 2048;

window.logg = function(message){
    if(globe.debug){
        console.log(message);
        //globe.gameLog += message;    
    }
}


window.updatePreRenderCanvas = function ({mapHeight,mapWidth}){

    updateCanvasDimensions(canvasTiles, mapWidth, mapHeight);
   // window.ctx = canvasTiles.getContext('2d');
    updateCanvasDimensions(canvasHighlight, mapWidth, mapHeight);
    //window.ctxHighlight = canvasHighlight.getContext('2d');
	updateCanvasDimensions(canvasNPC, mapWidth, mapHeight);
    //window.ctxNPC = canvasNPC.getContext('2d');
	updateCanvasDimensions(canvasAnimation, mapWidth, mapHeight);
   // window.ctxAnimation = canvasAnimation.getContext('2d');
}

function initGameControls(props){
    // off screen canvases, these are used to prerender, then they are used by the actual canvases to display the images, its faster this way, in theoy, here goes :
    window.canvasTiles = createPreRenderCanvas(mapWidth, mapHeight);
    window.ctx = canvasTiles.getContext('2d');
    window.canvasHighlight = createPreRenderCanvas(mapWidth, mapHeight);
    window.ctxHighlight = canvasHighlight.getContext('2d');
    window.canvasNPC = createPreRenderCanvas(mapWidth, mapHeight);
    window.ctxNPC = canvasNPC.getContext('2d');
    window.canvasAnimation = createPreRenderCanvas(mapWidth, mapHeight);
    window.ctxAnimation = canvasAnimation.getContext('2d');

	// real canvases
	window.canvasTiles_real = document.getElementById('canvasTiles');
    window.ctx_real = canvasTiles_real.getContext('2d');
    window.canvasHighlight_real = document.getElementById('canvasHighlight');
    window.ctxHighlight_real = canvasHighlight_real.getContext('2d'); 
	window.canvasNPC_real = document.getElementById('canvasNPC');
    window.ctxNPC_real = canvasNPC_real.getContext('2d');	
	window.canvasAnimation_real = document.getElementById('canvasAnimation');
    window.ctxAnimation_real = canvasAnimation_real.getContext('2d');

    // create listener
    window.keyboardTravel = new KeyboardTravel();
    document.addEventListener('keydown', function(e) { keyboardTravel.checkKeyDown(e); }.bind(keyboardTravel),false);
    document.addEventListener('keyup',function(e) {  keyboardTravel.checkKeyUp(e); }.bind(keyboardTravel),false);

    window.mouseFunctions = new MouseFunctions();
    document.getElementById('gcc').addEventListener("mousemove", mouseFunctions.updateMousePosition.bind(mouseFunctions), false);
    document.getElementById('gcc').addEventListener("dblclick", mouseFunctions.doubleClick.bind(mouseFunctions), false);
    document.getElementById('gcc').addEventListener("mousedown", mouseFunctions.mouseClick.bind(mouseFunctions), false);
    document.getElementById('gcc').addEventListener("mouseup", mouseFunctions.mouseClickRelease.bind(mouseFunctions), false);
    document.getElementById('gcc').addEventListener("contextmenu", mouseFunctions.rightClickContext.bind(mouseFunctions), false);
	
	
    document.getElementById('levelLaunchbtn').addEventListener("click", startNewGame, false);
    document.getElementById('restartGamebtn').addEventListener("click", startNewGame, false);// will need to be restart current level

    document.getElementById('restartNewGamebtn2').addEventListener("click", startNewGame, false);
    document.getElementById('returnToGamebtn').addEventListener("click", function(){pSub.publish(globe.PLAYING,{});}, false);
    document.getElementById('restartNewGamebtn').addEventListener("click", startNewGame, false); // will need to be restart current level
	
	
    //http://javascript.info/tutorial/mouse-events
    window.gameContainerElement = document.getElementById('gameContainer'); // how we move the map around

}

// purely for a new game, load with need a different function.
function setupGame(props){
    var mh = mapHeight; // 512
    var mw = mapWidth; // 920

    window.globe = 
    {
        debug : false, // false in production!
        errorLog : false, // false in production!
        gameLog : "",

		screenHeight, // should be used for knowing the width and height of the screen display only, defined in top of jsmain
        screenWidth,

        // used in calucations, is a measure of how many tiles can been seen in each direction.
        mapHeight,
        mapWidth,
		mapHeightPadding:mh+50, // used in calucations of elements that have left the screen, like bullets
        mapWidthPadding:mw+50,

        mapOffsetX:0, // used to determine where on the map to draw
        mapOffsetY:0,

        mapOffsetXMin: screenWidth/2,
        mapOffsetYMin: screenHeight/2,
        mapOffsetXMax: mapWidth - screenWidth/2,
        mapOffsetYMax: mapHeight - screenHeight/2,

		mainMenu: $jq("#mainMenu"),
		pauseMenu: $jq("#pauseMenu"),
		controlsDisplay: "",//$jq("#controlsDisplay")
		audioMenu: $jq("#soundPanel"),
		loginMenu: $jq("#loginMenu"),
		overMenu: $jq("#overMenu"),
		levelFinishedMenu: $jq("#levelFinishedPanel"),
		campaignMenu: $jq("#overCampaignMenu"),
		progressBarPanel: $jq("#progessBarPanel"),
		progressBar: $jq("#progessBar"),
		
		isMoveKeysListening: false,
		isClickListening: false,
		isPlaying: false,
		PLAYING: "PLAYING",
		PAUSING: "PAUSING",
		
		mouseX: 0,
		mouseY: 0,
		
		osl: $jq(".container").offset().left, // moved to loop
        ost: $jq(".container").offset().top,
		
		// constants
		//keyboard
		A_PRESSED:"A_PRESEED",
		S_PRESSED:"S_PRESEED",
		W_PRESSED:"W_PRESEED",
		D_PRESSED:"D_PRESEED",
		SPACE_PRESSED:"SPACE_PRESSED",
		
		A_RELEASE:"A_RELEASE",
		S_RELEASE:"S_RELEASE",
		W_RELEASE:"W_RELEASE",
		D_RELEASE:"D_RELEASE",
		SPACE_RELEASE:"SPACE_RELEASE",
		//Mouse
		LEFTCLICK:"LEFTCLICK",
		RIGHTCLICK:"RIGHTCLICK",
		LEFTCLICKRELEASE:"LEFTCLICKRELEASE",
		RIGHTCLICKRELEASE:"RIGHTCLICKRELEASE",
		DOUBLECLICK:"DOUBLECLICK",
		
		// admin
		GI_RESOURCES_LOADED: "GI_RESOURCES_LOADED",
		GI_RESOURCE_LOADED: "GI_RESOURCE_LOADED",
		ADDTOSCORE:"ADDTOSCORE",
		POSTSCORE:"POSTSCORE",
		UNLOCKMEDAL:"UNLOCKMEDAL",
		
		// audio
		PLAYSOUND:"PLAYSOUND",
		STOPSOUND:"STOPSOUND",
		PLAYSOUNDNEWINSTANCE:"PLAYSOUNDNEWINSTANCE",
		ADJUSTVOLUME:"ADJUSTVOLUME",
		
		// game instance specific
		TARGETFOUND:"TARGETFOUND",
		CLEARTARGET:"CLEARTARGET",
		
		
		REMOVEBULLET:"REMOVEBULLET",
		REMOVEMISSILE:"REMOVEMISSILE",
		REMOVELAZER:"REMOVELAZER",
		GENERATELAZER:"GENERATELAZER",
		REMOVEGOODBULLET:"REMOVEGOODBULLET",
		GENERATEGOODBULLET:"GENERATEGOODBULLET",
		CURRENTBOTCOUNT:"CURRENTBOTCOUNT",

		GENERATEMISSILESTORM:"GENERATEMISSILESTORM",
		
		GENERATEBEE:"GENERATEBEE",
		REMOVEBEE:"REMOVEBEE",
		GENERATEKEEPER:"GENERATEKEEPER",
		REMOVEKEEPER:"REMOVEKEEPER",		
		GENERATECOMET:"GENERATECOMET",
		REMOVEKEEPER:"REMOVECOMET",
		
		REMOVEDASHER:"REMOVEDASHER",
		GENERATEDASHER:"GENERATEDASHER",
		REMOVEGLIDER:"REMOVEGLIDER",
		REMOVEANIMATION:"REMOVEANIMATION",
		ADDANIMATION:"ADDANIMATION",
		REMOVEBLAST:"REMOVEBLAST",
		REMOVECARRIER:"REMOVECARRIER",
		REMOVETRANSPORT:"REMOVETRANSPORT",


		REMOVEDTOWER:"REMOVEDTOWER",

		GENERATEHEALTHITEM:"GENERATEHEALTHITEM",
		GENERATESHIELDITEM:"GENERATESHIELDITEM",
		GENERATEMISSILESTORMITEM:"GENERATEMISSILESTORMITEM",
		GENERATEMISSILEAMNOITEM:"GENERATEMISSILEAMNOITEM",
		GENITEM:"GENITEM",
		REMOVEITEM:"REMOVEITEM",
		
		ALLBOTSDESTROYED:"ALLBOTSDESTROYED",
		MISSILESTORM:"MISSILESTORM",
		
		TARGETEDCOLOR:"#00FF00",
		
		F1:"F1",
		T1:"T1",
		T2:"T2",

		RADIANCAL: 180/Math.PI,
		DEGREECAL: Math.PI/180,

		// newgrounds :/
		APIID:"44754:O1UPRVke",
		Encryption_Key: "P+i7WMvoA74/kJx1N8TSFg=="

    };   
}

window.pSub = new PubSub();// this must be loaded first and be global, the only real global, the rest will use this to ex functions
window.pRS = new PreRenderSprite({});

setupGame({});
initGameControls({});


window.newgroundsImpl = new NewgroundsImpl({api: window.globe.APIID, key:window.globe.Encryption_Key });
newgroundsImpl.loadAll();
newgroundsImpl.initSession();

pSub.subscribe(globe.POSTSCORE,newgroundsImpl.postScore,newgroundsImpl);

window.menuManager = new MenuManager({}); // has all of the info that the menu requires.
window.gameInstance = new GameInstance(); // there will be only one. 
pSub.subscribe(globe.GI_RESOURCES_LOADED,resourcesLoaded,this);
pSub.subscribe(globe.GI_RESOURCE_LOADED,resourceLoaded,this);
window.gameInstance.loadResources();
window.gameState = window.gameInstance.props.stateManager;

$jq.when( $jq.ready ).then(function() {
    window.gameState.loadGameState({});
});

//$jq.Storage.set({"MS1_PA":"value1", "name2":"value2", etc}) - Stores multiple name/value pairs in the data store.
//$jq.Storage.get("MS1_PA") - Retrieves the value of the given name from the data store.
//$jq.Storage.remove("MS1_PA") - Permanently deletes the name/value pair from the data store.


// I have no use for it yet, so dont add it unless its needed, commented out in loop
window.timer = new Timer(); 

function resourcesLoaded(){ //
	// hide loading bar
	globe.progressBarPanel.addClass("noDisplay");

	// check if the user is logged in, if not display the login menu
	if(newgroundsImpl.props.loggedIn){
	    window.displayMenu();
	}
	else{
        globe.loginMenu.removeClass("noDisplay");
    }
	// once logged in, can call display menu.
}

window.displayMenu = function(){
	// display menu now
	globe.mainMenu.removeClass("noDisplay");
	globe.loginMenu.addClass("noDisplay");


	pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
}

function resourceLoaded(topic, {total,current}){
	globe.progressBar.css("width",((100/total)*current)+"%");
}

// metrics
var lastTime = Date.now();
var frames = 0;
var lastFrame = 0;

// game over
var highScore = 0;
var gameOver = true;

function loop() {
    if(globe.isPlaying) {
		render();
		
		gameInstance.play();
		gameInstance.update();
		
		// metrics
		frames++;
		var time = Date.now();
		if(time - lastTime > 1000){
			lastFrame = frames;
			frames = 0;
			lastTime = Date.now();
		}
		// fps
		//Write(20,450,`fps:${lastFrame}`,25,'#FFFF00',ctxHighlight_real);

        requestAnimFrame(loop); // takes a function as para, it will keep calling loop over and over again

    }
}
function startLoop() {
	if(!gameOver){
		pSub.publish(globe.STOPSOUND,{name:"overBackgroundMusic"});
		globe.pauseMenu.addClass("noDisplay");
		keyboardTravel.pausePressed = false
		
		globe.isPlaying = true;
		globe.isMoveKeysListening = true;
		globe.isClickListening = true;
		gameInstance.play();
		loop();
	}
}

function stopLoop() {
	if(!gameOver){
		globe.isPlaying = false;
		globe.isMoveKeysListening = false;
		globe.isClickListening = false;
		gameInstance.pause();
		
		globe.pauseMenu.removeClass("noDisplay");
	}
}

function startNewGame(){ 
	gameInstance.startNewGame({levelName:menuManager.getSelectedLevel()});
	newGamePart2();
}

function newGamePart2(){
	gameOver = false;

	globe.mainMenu.addClass("noDisplay");
	globe.audioMenu.addClass("noDisplay");
	globe.overMenu.addClass("noDisplay");
	globe.campaignMenu.addClass("noDisplay");
	$jq("#levelOverviewPanel").addClass("noDisplay");

	$jq("#mainTable").removeClass("noDisplay");
	pSub.publish(globe.PLAYSOUND,{name:"mainBackgroundMusic"});
	startLoop();
}

function render(){
    window.ctx_real.clearRect(0,0,globe.mapWidth,globe.mapHeight);
    window.ctx_real.drawImage(canvasTiles,globe.mapOffsetX,globe.mapOffsetY,globe.mapWidth,globe.mapHeight);

    window.ctxHighlight_real.clearRect(0,0,globe.mapWidth,globe.mapHeight);
    window.ctxHighlight_real.drawImage(canvasHighlight,globe.mapOffsetX,globe.mapOffsetY,globe.mapWidth,globe.mapHeight);

    window.ctxNPC_real.clearRect(0,0,globe.mapWidth,globe.screenHeight);
    window.ctxNPC_real.drawImage(canvasNPC,globe.mapOffsetX,globe.mapOffsetY,globe.mapWidth,globe.mapHeight);

    window.ctxAnimation_real.clearRect(0,0,globe.mapWidth,globe.screenHeight);
    window.ctxAnimation_real.drawImage(canvasAnimation, globe.mapOffsetX,globe.mapOffsetY, globe.mapWidth,globe.mapHeight);

    drawBox(756,428,160,80,window.ctxAnimation_real,'#000000','#34FA08'); // move this to another canvas, its own maybe!
    window.ctxAnimation_real.drawImage(canvasNPC,0,0,globe.mapWidth,globe.mapHeight,760,432,160,80);

}



function updateCanvasDimensions(canvas, sizeX, sizeY){ // offscreen canvases for double buff
	canvas.width = sizeX;
	canvas.height = sizeY;
}

pSub.subscribe(globe.PLAYING,startLoop,this);
pSub.subscribe(globe.PAUSING,stopLoop,this);


// disable the right click when clicking on the canvas
/*$jq('body').on('contextmenu', '#canvasAnimation', function(e){ 
	if(globe.isClickListening === true){
		pSub.publish(globe.RIGHTCLICK,{});
	}
	return false; 
});*/ 


window.getMouseXOff = function(){
    return globe.mouseX + absVal(globe.mapOffsetX);
}
window.getMouseYOff = function(){
    return globe.mouseY + absVal(globe.mapOffsetY);
}

// array of levels and level descriptions, but how to call the level function, actually its a class.

//https://github.com/seiyria/bootstrap-slider
// audio stuff
$jq('#bgMusicSlider').slider({
	formatter: function(value) {
		return 'Current value: ' + value;
	}
}).on("change",function(){
	pSub.publish(globe.ADJUSTVOLUME,{bsv:$jq(this).val()});
});

;
$jq('#soundEffectsSlider').slider({
	formatter: function(value) {
		return 'Current value: ' + value;
	}
}).on("change",function(){
	pSub.publish(globe.ADJUSTVOLUME,{sav:$jq(this).val()});
});

// front end menu navigation stuff for simple navigation.
window.hideAndDisplay = function(hide,display){
    $jq("#"+hide).addClass("noDisplay");
    $jq("#"+display).removeClass("noDisplay");

    pSub.publish(globe.STOPSOUND,{name:"mainBackgroundMusic"});
    pSub.publish(globe.PLAYSOUND,{name:"overBackgroundMusic"});
    window.setTotals();
}

// front end menu navigation stuff for simple navigation.
window.displayAudioFromMM = function(hide,display,fromMM,mmbt,pmbt){
    $jq("#"+hide).addClass("noDisplay");
    $jq("#"+display).removeClass("noDisplay");

    if(fromMM){
        $jq("#"+pmbt).addClass("noDisplay");
        $jq("#"+mmbt).removeClass("noDisplay");
    }else{
        $jq("#"+mmbt).addClass("noDisplay");
        $jq("#"+pmbt).removeClass("noDisplay");
    }
}

window.clearLocalSave = function(){
    window.gameState.clearStorage({});
    $jq("#clearLSbtnContent").html("Storage cleared. please refresh the page, either hit F5 or manually refresh the tab.");

}

window.selectLevel = function(levelNumber){
    $jq("#levelSelectPanel").addClass("noDisplay");
    $jq("#levelOverviewPanel").removeClass("noDisplay");
    
    var level = menuManager.getLevel(levelNumber);
    $jq("#levelDisplayName").html(level.displayName);
    $jq("#levelDescription").html(level.description);
    $jq("#levelObjective").html(level.objective);
    $jq("#failedObjective").html(level.objective);
    $jq("#pauseObjecitve").html(level.objective);
    menuManager.setSelectedLevel(level.name);
}

window.selectLevelMissileStorm = function(levelNumber){
    $jq("#mainMenu").addClass("noDisplay");
    
    var level = menuManager.getLevel(levelNumber);
    $jq("#levelDescription").html(level.description);
    menuManager.setSelectedLevel(level.name);
    startNewGame();
}

window.completeLevelUnlockNext = function(btnNumber){

    if($jq("#level"+btnNumber+"btn").hasClass("btn-info")){
        $jq("#level"+btnNumber+"btn").removeClass("btn-info");
        $jq("#level"+btnNumber+"btn").addClass("btn-success");

        $jq("#level"+(btnNumber+1)+"btn").addClass("btn-info");
        $jq("#level"+(btnNumber+1)+"btn").prop("disabled", false);
    }

    var scoreDivider = 5000;
    if(btnNumber == 6){
        scoreDivider = 10000;
    }
    // update the level finishing gui with stats and points acquired
    $jq("#levelScoreF").html(`Total Score:${gameInstance.props.ship.props.score}`);
    $jq("#levelPointsAcquiredF").html(`Points Acquired:${Math.floor(gameInstance.props.ship.props.score/scoreDivider)} (${gameInstance.props.ship.props.score}/${scoreDivider})`);

    gameState.props.unlockPoints += Math.floor(gameInstance.props.ship.props.score/scoreDivider);
    $jq("#upgradePoints").html("Upgrade Points Avaiable: "+gameState.props.unlockPoints);

    window.gameState.saveCampaignLevel(btnNumber);
    window.gameState.saveGameState({});


}

window.completeLevelUnlockNextGameState = function(btnNumber){

    if($jq("#level"+btnNumber+"btn").hasClass("btn-info")){
        $jq("#level"+btnNumber+"btn").removeClass("btn-info");
        $jq("#level"+btnNumber+"btn").addClass("btn-success");

        $jq("#level"+(btnNumber+1)+"btn").addClass("btn-info");
        $jq("#level"+(btnNumber+1)+"btn").prop("disabled", false);
    }
}

window.unlockBullet = function(){
    if(gameState.checkBulletUpgrade({upgradeBullets:menuManager.props.upgradeBullets})){ 
        var upgrade = gameState.bulletUpgrade({upgradeBullets:menuManager.props.upgradeBullets});
        $jq("#bulletdamageInfo").html(upgrade.Desc);
        $jq("#bulletdamagecost").html(upgrade.upgradeText);
        $jq("#upgradePoints").html("Upgrade Points Avaiable: "+gameState.props.unlockPoints);

        $jq("#bu"+upgrade.l).removeClass("glyphicon-unchecked").addClass("glyphicon-check");
        if(gameState.playing()){
            window.gameState.saveGameState({});
        }
    }
}

window.unlockArmor = function(){
    if(gameState.checkArmorUpgrade({upgradeArmor:menuManager.props.upgradeArmor})){ 
        var upgrade = gameState.armorUpgrade({upgradeArmor:menuManager.props.upgradeArmor});
        $jq("#shipArmorInfo").html(upgrade.Desc);
        $jq("#shiparmorcost").html(upgrade.upgradeText);
        $jq("#upgradePoints").html("Upgrade Points Avaiable: "+gameState.props.unlockPoints);

        $jq("#sa"+upgrade.l).removeClass("glyphicon-unchecked").addClass("glyphicon-check");
        if(gameState.playing()){
            window.gameState.saveGameState({});
        }
    }
}

window.unlockShields = function(){
    if(gameState.checkShieldUpgrade({upgradePowerShield:menuManager.props.upgradePowerShield})){ 
        var upgrade = gameState.shieldUpgrade({upgradePowerShield:menuManager.props.upgradePowerShield});
        $jq("#shieldInfo").html(upgrade.Desc);
        $jq("#shieldCost").html(upgrade.upgradeText);
        $jq("#upgradePoints").html("Upgrade Points Avaiable: "+gameState.props.unlockPoints);

        $jq("#s"+upgrade.l).removeClass("glyphicon-unchecked").addClass("glyphicon-check");
        if(gameState.playing()){
            window.gameState.saveGameState({});
        }
    }
}

window.unlockMissile = function(){
    if(gameState.checkMissileUpgrade({upgradeMissiles:menuManager.props.upgradeMissiles})){ 
        var upgrade = gameState.missileUpgrade({upgradeMissiles:menuManager.props.upgradeMissiles});
        $jq("#missileInfo").html(upgrade.Desc);
        $jq("#missileCost").html(upgrade.upgradeText);
        $jq("#upgradePoints").html("Upgrade Points Avaiable: "+gameState.props.unlockPoints);

        $jq("#m"+upgrade.l).removeClass("glyphicon-unchecked").addClass("glyphicon-check");
        if(gameState.playing()){
            window.gameState.saveGameState({});
        }
    }
}

window.setTopTen = function(scores){
    $jq("#topTenMenu").removeClass("noDisplay");
    // for each
    $jq("#topTenDiv").html("<span></span>");
    for(var i =0; i < scores.length && i < 6;i++){
        var past =  $jq("#topTenDiv").html();
        var num = i+1;
       $jq("#topTenDiv").html(`${past}<div><p>${num}: ${scores[i].user.name}  Score:${scores[i].formatted_value}</p></div>`);
    }
}

window.setTotals = function(){
    $jq("#totalsDiv").html(`<div>dashers destroyed:${window.gameState.props.dashersKilled}</div><div>gliders destroyed:${window.gameState.props.glidersKilled}</div><div>beekeepers destroyed:${window.gameState.props.beekeepersKilled}</div><div>carriers destroyed:${window.gameState.props.carriersKilled}</div>`);

}