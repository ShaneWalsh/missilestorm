/* 
 *  Created by Shane Walsh
 *  
 */
 
import SheetAnimation from "./SheetAnimation";
import TextAnimation from "./TextAnimation";

export default class AnimationManager{
    constructor(){
        this.props = {
			animations:{},
			animationId:1
		};
		this.setupListeners();
    }
	
	// move all of the minions
	update(){ 
		window.ctxAnimation.clearRect(0,0,globe.mapWidth,globe.mapHeight);
		
		var p = this.props;
		for (let key in p.animations) {
			if (p.animations.hasOwnProperty(key)) {
				p.animations[key].update({});
			}
		}
	}
	
	addAnimation({x,y,type,angle=0, params={}}){
		if(type == "explosion"){
			this.addExplosion({x,y});
		}
		if(type == "dasherDeath"){
			this.addDasherDeath({x,y,angle});
		}
		if(type == "battleshipDeath"){
			this.addBattleshipDeath({x,y,angle});
		}
		if(type == "cometDeath"){
			this.addCometDeath({x,y,angle});
		}
		if(type == "gliderDeath"){
			this.addGliderDeath({x,y,angle});
		}
		if(type == "defenceTowerDeath"){
			this.addDefenseTowerDeath({x,y,angle});
		}
		if(type == "carrierDeath"){
			this.addCarrierDeath({x,y,angle});
		}
		if(type == "beeKeeperDeath"){
			this.addBeeKeeperDeath({x,y,angle});
		}
		if(type == "textAnimation"){
			this.addTextAnimation({x,y,params});
		}
	}
	
	addAnimationTopic(Topic, {x,y,type,angle=0, params={}}){
		this.addAnimation( {x,y,type,angle,params});
	}
	
	addTextAnimation({x,y, params}){
		var id  = this.getNewId();
		var textAni = new TextAnimation({id:id,x:x,y:y,framesPerAnimation:60, ctxDraw:ctxAnimation, driftX:params.driftX, driftY:params.driftY});
		
		textAni.setSheet(params);
		this.props.animations[id] = textAni;
	}

	addExplosion({x,y}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x,y:y,framesPerAnimation:5, ctxDraw:ctxAnimation});

		exp.setSheet({sheet:gameInstance.props.expImg,startx:0,starty:0,sizex:32,sizey:32,movex:32,movey:0,steps:6});
		this.props.animations[id] = exp;
	}
	
	addCometDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-8,y:y-8,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});
		
		exp.setSheet({sheet:gameInstance.props.cometDeathAnimImg,startx:0,starty:0,sizex:48,sizey:48,movex:48,movey:0,steps:3});
		this.props.animations[id] = exp;
	}

	addDasherDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-16,y:y-16,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});

		exp.setSheet({sheet:gameInstance.props.dasherDeathImg,startx:0,starty:0,sizex:64,sizey:64,movex:64,movey:0,steps:3});
		this.props.animations[id] = exp;
	}

	addBattleshipDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-8,y:y-8,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});

		exp.setSheet({sheet:gameInstance.props.battleshipDeathImg,startx:0,starty:0,sizex:63,sizey:64,movex:64,movey:0,steps:3});
		this.props.animations[id] = exp;
	}
	
	addGliderDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-16,y:y-16,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});
		
		exp.setSheet({sheet:gameInstance.props.gliderDeathImg,startx:0,starty:0,sizex:64,sizey:64,movex:64,movey:0,steps:3});
		this.props.animations[id] = exp;
	}

	addDefenseTowerDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-16,y:y-16,framesPerAnimation:30, ctxDraw:ctxAnimation,angle});

		exp.setSheet({sheet:gameInstance.props.defenceTowerDeathImg,startx:0,starty:0,sizex:64,sizey:64,movex:64,movey:0,steps:3});
		this.props.animations[id] = exp;
	}
	
	addBeeKeeperDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-16,y:y-16,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});
		
		exp.setSheet({sheet:gameInstance.props.beeKeeperDeathImg,startx:0,starty:0,sizex:64,sizey:64,movex:64,movey:0,steps:3});
		this.props.animations[id] = exp;
	}

	addCarrierDeath({x,y,angle}){
		var id  = this.getNewId();
		var exp = new SheetAnimation({id:id,x:x-18,y:y-18,framesPerAnimation:20, ctxDraw:ctxAnimation,angle});

		exp.setSheet({sheet:gameInstance.props.carrierDeathImg,startx:0,starty:0,sizex:84,sizey:120,movex:84,movey:0,steps:3});
		this.props.animations[id] = exp;
	}
	
	getNewId(){
		var id =  this.props.animationId++;
		if(id > 100000000){ // just incase it tries to run out of bullets
			this.props.animationId = 1;
		}
		return id;
	}
	
	setupListeners(){
		pSub.subscribe(globe.REMOVEANIMATION,this.removeAnimation,this);
		pSub.subscribe(globe.ADDANIMATION,this.addAnimationTopic,this);
	}
	
	removeAnimation(topic, {id}){
		delete this.props.animations[id];
	}
}