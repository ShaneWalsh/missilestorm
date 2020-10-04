/* 
 *  Created by Shane Walsh
 *  
 */

import {drawBorder} from "./2dGameLib"
import {updateMiniMapBox,adjustCanvasPositions} from "./OtherFunctions"

export default class MouseFunctions{
    constructor(){
        this.ctxHighlight = window.canvasHighlight.getContext('2d');
        this.para = {lastX:-1,lastY:-1,lastCenterX:0,lastCenterY:0};
    }
    updateMousePosition(e){
		globe.mouseX =  Math.floor(e.pageX - globe.osl);
		globe.mouseY =  Math.floor(e.pageY - globe.ost);
	}
    
	mouseClick(e){
        if(globe.isClickListening === true){
			if(e.button == 0){
				pSub.publish(globe.LEFTCLICK,{});
			}
			else if(e.button == 2){
				pSub.publish(globe.RIGHTCLICK,{});
			}
        }
    }
	
	mouseClickRelease(e){
		if(globe.isClickListening === true){
			if(e.button == 0){ // left
				pSub.publish(globe.LEFTCLICKRELEASE,{});
			}
			else if(e.button == 2){ // right
				pSub.publish(globe.RIGHTCLICKRELEASE,{});
			}
        }
    }
	
	rightClickContext(e){ // this is just a catch for the context menu, to prevent it from appearing.
		e.preventDefault();
	}
	
	doubleClick(e){
        if(globe.isClickListening === true){
			pSub.publish(globe.DOUBLECLICK,{});
        }
    }
	
    
}