/* 
 *  Created by Shane Walsh
 *  
 */
 
export default class Animation{
    constructor({id=0,x=200,y=200,framesPerAnimation=10,loop=false, loopAmount=0, ctxDraw, angle=0, driftX=0,driftY=0}){
        this.props = {
			id,
			x,
			y,
			framesPerAnimation,
			currentFrame:0,
			loop,
			loopAmount,
			ctxDraw,
			angle,
			driftX, // used to move the animation on the screen
			driftY
		};
    }
	
	// implemented by the two different animation types
	update(){ 
		logg("Animation update should not be called :/ ");
	}

	updateCords({x,y, angle}){
	    var p = this.props;
        p.x = x;
        p.y = y;
        p.angle = angle;
	}
	
}