/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawImage,absVal,Write} from "../Libs/2dGameLib";
export default class LevelTemplate{
    constructor({id=0,mapRedrawing = false, ctx, level=0}){
        this.props = {
			id,
			mapRedrawing,
			ctxToDraw:ctx,
			scoreThreshold:500,
            levelScoreCounter: 0,
            level,
            botslevel:{dashersMax: 2, glidersMax:1, keepersMax: 0, carriersMax: 0, cometsMax: 1},
		};
	    this.setupListeners();
    }

    setupListeners() {

    }
	/**
	 check fail conditions
	 check for level progression in bots strength, new map elements etc.
	*/
	update({}){ 
		logg("Level update should not be called :/ ");
	}

    /*this is where we should set the basics for this game,
     e.g the background image, and the starting bots
     set the map size, reset all of the stuff, offsets and bots etc
     */
    init({}){

    }

    displayWaves({waves}){
        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);
        Write(x+810,y+55,`Waves Left: ${(waves-1)}`,14,'#34FA08',ctxHighlight);
    }

    displayTime({time}){
        var x = absVal(globe.mapOffsetX);
        var y = absVal(globe.mapOffsetY);
        Write(x+780,y+55,`Time Remaining:${Math.floor(time/60)}:${Math.floor(time%60)}`,14,'#34FA08',ctxHighlight);
    }
	
}