/* 
 *  Created by Shane Walsh
 *  
 */

import {Write} from "../Libs/2dGameLib";
import Animation from "./Animation";

export default class TextAnimation extends Animation{
        
    update({constLoop=false}){
		let  p = this.props;

		Write(p.x,p.y,p.text,p.fontSize,p.color,p.ctxDraw)

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
	setSheet({text,fontSize, color}){
		let  p = this.props;
		p.text = text; // img
		p.fontSize =fontSize;
		p.color =color;
	}
}
