/* 
 *  Created by Shane Walsh
 *  
 */

// export function to create a new 2d array of size inputed/ really an array of arrays 
export function Create2DArray(rows) { 
  var gridA = [];

  for (var i=0;i<rows;i++) {
     gridA[i] = [];
  }

  return gridA;
}

export function drawPath(x,y,xx,yy,color,ctx){
	ctx.beginPath();
    ctx.moveTo(x+32, y+32);
    ctx.lineTo(xx, yy);
	ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawLine(x,y,xx,yy,color,ctx){
	ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
	ctx.strokeStyle = color;
    ctx.stroke();
}

export function drawBorder(x,y,sizeX,sizeY,ctx,color){
    ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.strokeRect(x+1,y+1,sizeX,sizeY);
}

export function drawBorderRotate(x,y,sizeX,sizeY,ctx,color, rotation, translateX, translateY){
	translateX = (0.5 + translateX) << 0;
    translateY = (0.5 + translateY) << 0;

    ctx.save();
    ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
    ctx.rotate(rotation);
    ctx.translate(translateX*-1, translateY *-1); // this moves the point of drawing and rotation to the center.

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.strokeRect(x+1,y+1,sizeX,sizeY);

    ctx.restore();
}

export function drawBox(x,y,sX,sY,ctx,colour,colour2){
	ctx.lineWidth = 2;
	ctx.fillStyle = colour;
	ctx.fillRect(x, y, sX, sY);

	ctx.strokeStyle = colour2;
	ctx.strokeRect(x,y,sX,sY);
}

export function DrawImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image){
	ctx.drawImage(image,x,y,sx,sy,lx,ly,lxs,lys); // l are for the actual canvas positions, the s values are for the sprite sheet locations.
}



export function DrawRotateImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image, rotation, translateX,translateY ){ // l are the actual canvas positions
	
	// bitwise transformations to remove floating point values, canvas drawimage is faster with integers  
	lx = (0.5 + lx) << 0;
	ly = (0.5 + ly) << 0;
	
	translateX = (0.5 + translateX) << 0;
	translateY = (0.5 + translateY) << 0;
	
	ctx.save();
	ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
	ctx.rotate(rotation);
	ctx.translate(translateX*-1, translateY *-1); // this moves the point of drawing and rotation to the center.
	DrawImage(x,y,sx,sy,lx,ly,lxs,lys,ctx,image);
	ctx.restore();
}

export function DrawPreRenderSprite(name,lx,ly,lxs,lys,ctx, rotation){ // l are the actual canvas positions
	lx = (0.5 + lx) << 0;
	ly = (0.5 + ly) << 0;
    let prSprite = pRS.props.preRenderedSprites[name];
    let canvas = prSprite.arr[radianToDegreeFloor(rotation)];
    ctx.drawImage(canvas,prSprite.locX,prSprite.locY,prSprite.sizeX,prSprite.sizeY,lx,ly,lxs,lys); // I need to account for the rotation in the display!
}

export function createPreRenderCanvas(sizeX, sizeY){ // offscreen canvases for double buff
    var pre_canvas = document.createElement('canvas');
    pre_canvas.width = sizeX;
    pre_canvas.height = sizeY;
    return pre_canvas;
}

export function Write(x,y,text,size,color1,ctx){
	ctx.font = size + "px 'Century Gothic'";
	ctx.fillStyle = color1;
	ctx.fillText(text, x, y);
}


export function getString(string1){
var string=prompt(string1);
return string;
}

export function gridPositions(x,y){
	this.x = x;
	this.y = y;
}



///////////////////////// Manual Word processing

export function createWord(x,y,text,ctx){
// count the size of the word, see if it will fit into the available space

// upper case characters

// get character code, get the size, and the spritesheetname
}
export function WriteInPixels(x,y,text,ctx){
	ctx.font = size + "px 'Century Gothic'";
	ctx.fillStyle = color1;
	ctx.fillText(text, x, y);
}

export function pointInsideSprite(point, sprite) {
	if(point.x > sprite.props.x && point.x < (sprite.props.x+sprite.props.width) ){
		if(point.y > sprite.props.y && point.y < (sprite.props.y+sprite.props.height)){
			return true;
		}
	}
      
}

export function doBoxesIntersect(a, b) {
	return areCentersToClose(a,b);
}

export function doBoxesIntersectRotation(a, b) { // take the angle from the elements
  return (absVal(a.props.x - b.props.x) * 2 < (a.props.width + b.props.width)) &&
         (absVal(a.props.y - b.props.y) * 2 < (a.props.height + b.props.height));
}

//http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
// if you ever want to do it right :p

export function areCentersToClose(a, b) {
  return (absVal( (a.props.x+(a.props.width >> 1))  - (b.props.x + (b.props.width >> 1)) ) < ((a.props.width >>1) + (b.props.width >> 1))) &&
         (absVal( (a.props.y+(a.props.height >> 1))  - (b.props.y + (b.props.height >> 1)) ) < ((a.props.height >> 1) + (b.props.height >> 1)));
}

export function absVal(val) {
  return (val < 0) ? -val : val;
}

export function totalDistance(objA,objB){ // I could center values to be exact, but not required, this will be faster.
    var total = absVal(objA.props.x - objB.props.x);
    total += absVal(objA.props.y - objB.props.y);
    return total;
}

// calculate the position of a point after rotation
// can be used for finding the points on a rectangle after rotation if required if I ever implement correct collision detection
// ill just use it to make missiles spawn in the correct location.
// maybe I should use lookup tables for the cos and the sin, I dont think I need it to be perfectly accurate and it would save processing time.
// http://stackoverflow.com/questions/12161277/how-to-rotate-a-vertex-around-a-certain-point/
export function pointAfterRotation(centerX,centerY,point2X, point2Y, angle){
	//http://stackoverflow.com/questions/22491178/how-to-rotate-a-point-around-another-point
	var x1 = point2X - centerX;
    var y1 = point2Y - centerY;

    var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

    var newX = x2 + centerX;
    var newY = y2 + centerY;

	return {x:newX,y:newY}; // so i can drop it straight into assignments
}

// radians = degrees * (pi/180)
//degrees = radians * (180/pi)
//turns radians, like the ones you get from atan2 into dregees
export function radianToDegree(radians){
	var deg = radians * globe.RADIANCAL;
	if(deg < 0){
	    return deg+360;
	}
	else{
        return deg;
    }
}

export function radianToDegreeFloor(radians){
	return Math.floor(radianToDegree(radians))
}

export function degreeToRadian(degrees){
	return degrees * globe.DEGREECAL;
}

var words_alphabet = {
	65:[], // a
	66:[],
	67:[],
	68:[],
	69:[],
	70:[],
	71:[],
	72:[],
	73:[],
	74:[],
	75:[],
	76:[],
	77:[],
	78:[],
	79:[],
	80:[],
	81:[],
	82:[],
	83:[],
	84:[],
	85:[],
	86:[],
	87:[],
	88:[],
	89:[],
	90:[],
	190:[], // full stop
	63:[] // Question Mark

}
