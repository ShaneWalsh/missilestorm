/* 
 *  Created by Shane Walsh
 *  
 */


// time to control backgound image
// time to control the bot numbers and where they are etc
// check victory conditions, I will need a level implmentation, which this will init and then run.
import levelSurvival from "./Level/LevelSurvival";
import colonyAssault from "./Level/LevelColonyAssault";
import LevelFleetBattle from "./Level/LevelFleetBattle";
import l1TrainingDay from "./Level/L1TrainingDay";
import l2WelcomeBack from "./Level/L2WelcomeBack";
import l3CounterAttack from "./Level/L3CounterAttack";
import l4SecondContact from "./Level/L4SecondContact";
import l5FaceOff from "./Level/L5FaceOff";
import l8TheLaunch from "./Level/L8TheLaunch";
import l9Warp from "./Level/L9Warp";
import l10Titan from "./Level/L10Titan";
export default class LevelManager{
    constructor({level=0}){
        this.props = {
			playing:false,
			levelInstance:null,
		};
		this.setupListeners();
    }
	
	update(){ // move all of the minions
		this.props.levelInstance.update({});
	}

	setLevel({levelName}){
	    if(levelName == "survival"){
	        this.props.levelInstance = new levelSurvival({ctx:window.ctx});
	    }
	    else if(levelName == "colonyAssault"){
	        this.props.levelInstance = new colonyAssault({ctx:window.ctx});
	    }
	    else if(levelName == "fleetBattle"){
	        this.props.levelInstance = new LevelFleetBattle({ctx:window.ctx});
	    }
	    else if(levelName == "L1TrainingDay"){
	        this.props.levelInstance = new l1TrainingDay({ctx:window.ctx});
	    }
	    else if(levelName == "L2WelcomeBack"){
	        this.props.levelInstance = new l2WelcomeBack({ctx:window.ctx});
	    }
	    else if(levelName == "L3CounterAttack"){
	        this.props.levelInstance = new l3CounterAttack({ctx:window.ctx});
	    }
	    else if(levelName == "L4SecondContact"){
	        this.props.levelInstance = new l4SecondContact({ctx:window.ctx});
	    }
	    else if(levelName == "L5FaceOff"){
	        this.props.levelInstance = new l5FaceOff({ctx:window.ctx});
	    }
	    else if(levelName == "L6Reinforcements"){
	        this.props.levelInstance = new LevelFleetBattle({ctx:window.ctx});
	    }
	    else if(levelName == "L7Salvage"){
	        this.props.levelInstance = new colonyAssault({ctx:window.ctx});
	    }
	    else if(levelName == "L8TheLaunch"){
	        this.props.levelInstance = new l8TheLaunch({ctx:window.ctx});
	    }
	    else if(levelName == "L9Warp"){
	        this.props.levelInstance = new l9Warp({ctx:window.ctx});
	    }
	    else if(levelName == "L10Titan"){
	        this.props.levelInstance = new l10Titan({ctx:window.ctx});
	    }

	    this.props.levelInstance.init({});
	}

	
	setupListeners(){
		
	}
	
	levelUpEffect(){
		let p = this.props;
		p.level++;
		let level = p.level;
		if(level % 10 == 0){
			p.botslevel.carriersMax++;
			p.botslevel.cometsMax++;
		}
		else if(level % 5 == 0){ // big one
			p.botslevel.keepersMax++;
		}
		else if(level % 3 == 0){ // medium
			p.botslevel.glidersMax++;
		}
		else{ // minor
			p.botslevel.dashersMax++;
		}
		if(level == 1){
			p.botslevel.keepersMax++;
		}
		
		gameInstance.props.botManager.updateBots(p.botslevel);
		logg("#### level up ####");
	}
	
}