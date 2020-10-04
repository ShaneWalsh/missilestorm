/* 
 *  Created by Shane Walsh
 *  
 */

import {drawBorder} from "./2dGameLib";

// using the values already calculated.
export function updateMiniMapBox(){
    
    // these two x values are not correct, I need to work out the correct values.
    var miniMapStartX1 = globe.lastXOffset-60;
    var miniMapStartX2 = globe.lastXOffset+60;
    var miniMapStartX3 = globe.lastXOffset-180;
    var miniMapStartY = globe.lastYOffset;
    
    var targetY = (Math.floor(globe.mapHeight/2));//
    var targetX = (Math.floor(globe.mapWidth/2));
    
    var ctxMiniHighlight = window.canvasMiniMapHighlight.getContext('2d');
    
    // draw the minimap
    ctxMiniHighlight.clearRect(0,0,240,150);
    drawBorder(miniMapStartX1*2, miniMapStartY*2,globe.mapWidth*2,globe.mapHeight*2,ctxMiniHighlight,'#B20000');
    drawBorder(miniMapStartX2*2, miniMapStartY*2,globe.mapWidth*2,globe.mapHeight*2,ctxMiniHighlight,'#B20000');
    drawBorder(miniMapStartX3*2, miniMapStartY*2,globe.mapWidth*2,globe.mapHeight*2,ctxMiniHighlight,'#B20000');
}

export function adjustCanvasPositions(){
    gameContainerElement.style.left= ((globe.lastXOffset*globe.tileSize)*-1)+"px"; 
    gameContainerElement.style.top= ((globe.lastYOffset*globe.tileSize)*-1)+"px"; 
    
    updateMiniMapBox();
}