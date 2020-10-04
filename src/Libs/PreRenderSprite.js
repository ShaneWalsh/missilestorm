/* 
 *  Created by Shane Walsh
 *  
 */

import {createPreRenderCanvas,DrawRotateImage,degreeToRadian} from "./2dGameLib";


// link a name to an object with a degree map and a hidden canvas
export default class PreRenderSprite{
    constructor({}){
        this.props = {
			preRenderedSprites: {},
			sheetId:0
		};
		this.setupListeners();
    }

	addSprite({name,startX,startY,sizeX,sizeY,image}){
	    let p = this.props;
	    let point = sizeX+sizeY;
        let arr = []; // degrees will map to an x,y object

        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 90; j++){
                let deg = (i*90)+j;
                let canvas = createPreRenderCanvas(sizeX*2,sizeY*2);
                let ctx = canvas.getContext('2d');

                arr[deg] = canvas;
                DrawRotateImage(startX,startY,sizeX,sizeY,sizeX/2,sizeY/2,sizeX,sizeY,ctx,image, degreeToRadian(deg), sizeX,sizeY )
            }
        }

        p.preRenderedSprites[name] = {arr,sizeX,sizeY,locX:sizeX/2,locY:sizeY/2}
	}

    // reuse add sprite, add a new canvas entry for each one
	addSpriteSheet({}){

	}

	update(){ // move all of the minions

	}
	
	setupListeners(){
		//pSub.subscribe(globe.SPACE_PRESSED,this.startTageting,this);
		//pSub.subscribe(globe.SPACE_RELEASE,this.stopTageting,this);
	}

}