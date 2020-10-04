/* 
 *  Created by Shane Walsh
 *  
 */

import {DrawRotateImage,DrawImage} from "../Libs/2dGameLib";
import Animation from "./Animation";

export default class ArrayAnimation extends Animation{
        
    update({constLoop=false}){
		let  p = this.props;
		if(p.angle != 0){
			DrawRotateImage(  p.startx,p.starty,p.sizex,p.sizey,    p.x,p.y,p.sizex,p.sizey,   p.ctxDraw,p.sheet,angle,p.x, p.y);
		}
		else{
			DrawImage(  p.startx,p.starty,p.sizex,p.sizey,    p.x,p.y,p.sizex,p.sizey,   p.ctxDraw,p.sheet);
		}

		p.x+= p.driftX;
		p.y+= p.driftY;

		p.currentFrame++;
		
		if(p.currentFrame > p.framesPerAnimation){ // then maybe move on a step
			if(p.currentStep < p.steps){
				p.currentStep++;
				p.startx += p.movex;
				p.starty += p.movey;
			}
			else if(constLoop){
                p.startx = p.startxReset;
                p.starty = p.startyReset;
			    p.currentStep = 0;
			}
			else{ // we are out of steps
				pSub.publish(globe.REMOVEANIMATION,{id:p.id});
			}
			p.currentFrame = 0;
		}
	}
	
	// every time the animation moves on a tile, it will add the movex to the startx etc.  
	setArray({sheet,startx,starty,sizex,sizey,movex,movey,steps}){ 
		let  p = this.props;
		p.sheet = sheet; // img
		p.startx = startx;
		p.starty = starty;
		p.startxReset = startx;
        p.startyReset = starty;
		p.sizex = sizex;
		p.sizey = sizey;
		p.movex = movex;
		p.movey = movey;
		p.steps = steps;
		p.currentStep = 1;
	}
}
