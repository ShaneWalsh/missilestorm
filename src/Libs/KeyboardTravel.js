/* 
 *  Created by Shane Walsh
 *  
 */
 
import {updateMiniMapBox,adjustCanvasPositions} from "./OtherFunctions"

export default class KeyboardTravel{
    constructor(){
        this.mapXchange = 0;//this.changeX =0; replaced // stores the keyBoard change in the X direction 
        this.mapYchange = 0; //this.changeY = 0;

        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;
		this.spacePressed = false;
		
        this.moveKeyPressed = false; // this will help me keep track of whether a dir key was pressed

        this.mapChange = false;
        
        this.up = "up";
        this.right = "right";
        this.down = "down";
        this.left = "left";
        
        this.pausePressed = false;
		
		this.setupListeners();
    }

    

    checkKeyDown(e) // the e is passed n the eventlistener function init
    {
        var keyID = (e.keycode) || e.which; //#(gets the keypressed) like an if state =ment but its all in the same line, different key events for different browsers
        if(globe.isMoveKeysListening === true){
            if(this.moveKeyPressed == false){
                if( keyID === 87 ||  keyID === 38 ){ // 38= up arrow key 87= is the W key three === for this shit
                    if(!this.upPressed){
                       this.mapChange = true;
                       this.upPressed = true;
                       pSub.publish(globe.W_PRESSED,{});
                    }
                    e.preventDefault(); // #this will stop the arrow keys from moving the screen
                }
                else if( keyID === 68 ||  keyID === 39 ){ // 39= right arrow key 68= is the D key three === for this shit
                    if(!this.rightPressed){
                        this.mapChange = true;
                        this.rightPressed = true;
                        pSub.publish(globe.D_PRESSED,{});
                    }
                    e.preventDefault(); 
                }
                else if( keyID === 83 ||  keyID === 40 ){ // 40= down arrow key 83= is the S key three === for this shit
                    if(!this.downPressed){
                        this.mapChange = true;
                        this.downPressed = true;
                        pSub.publish(globe.S_PRESSED,{});
                    }
                    e.preventDefault(); 
                }
                else if( keyID === 65 ||  keyID === 37 ){ // 37= left arrow key 65= is the A key three === for this shit
                    if(!this.leftPressed){
                        this.mapChange = true;
                        this.leftPressed = true;
                        pSub.publish(globe.A_PRESSED,{});
                    }
                    e.preventDefault(); 
                }
				
                if( keyID === 32){//spacebar					
                    e.preventDefault(); 
					if(!this.spacePressed){
						this.spacePressed = true;
						pSub.publish(globe.SPACE_PRESSED,{});
					}
                }
				if( keyID === 81){//pathplanning
                     e.preventDefault(); 
                }

                if(this.mapChange == true){
                    // call out to move the map
                }
            }
        }
        if( keyID === 80 || keyID === 27){//p for the pause function
            if(!this.pausePressed){
				pSub.publish(globe.PAUSING,{});
				if(globe.debug){
					logg("paused");
				}
            }
            else{
				pSub.publish(globe.PLAYING,{});
				if(globe.debug){
					logg("playing");
				}
            }
            e.preventDefault();
        }
        else{
			if( keyID === 13 ){ //enter key
				e.preventDefault(); 
			}
        }

    }
	
	setupListeners(){
		pSub.subscribe(globe.PLAYING,this.listenForMenuUnPause,this);
		pSub.subscribe(globe.PAUSING,this.listenForMenuPause,this);
	}
	
	listenForMenuUnPause(){
		this.pausePressed = false;
	}
	
	listenForMenuPause(){
		this.pausePressed = true;
	}

    checkKeyUp(e) // the e is passed n the eventlistener function in init
    {
        var keyIDU = (e.keycode) || e.which; //#(gets the keypressed) like an if state =ment but its all in the same line, different key events for different browsers
        if(globe.isMoveKeysListening === true){
           
            // or var  keyIDU = (e.keycode) || e.which;  if keycode doesn not exist it will look of the new browser function
            if( keyIDU === 87 ||  keyIDU === 38 ){ // 38= up arrow key 87= is the W key
                this.upPressed = false;
                this.clearMapChangeAndKeyPressed();
				pSub.publish(globe.W_RELEASE,{});
                e.preventDefault(); // #this will stop the arrow keys from moving the screen
            }
            if( keyIDU === 68 ||  keyIDU === 39 ){ // 39= right arrow key 68= is the D key
                this.rightPressed = false;
                this.clearMapChangeAndKeyPressed();
				pSub.publish(globe.D_RELEASE,{});
                e.preventDefault(); 
            }
            if( keyIDU === 83 ||  keyIDU === 40){ // 40= down arrow key 83= is the S key
                this.downPressed = false;
                this.clearMapChangeAndKeyPressed();
				pSub.publish(globe.S_RELEASE,{});
                e.preventDefault(); 
            }
            if( keyIDU === 65 ||  keyIDU === 37){ // 37= left arrow key 65= is the A key
                this.leftPressed = false;
                this.clearMapChangeAndKeyPressed();
				pSub.publish(globe.A_RELEASE,{});
                e.preventDefault(); 
            }
			if( keyIDU === 32){//spacebar					
				e.preventDefault(); 
				this.spacePressed = false;
				pSub.publish(globe.SPACE_RELEASE,{});
				
			}
        }
        else{
            if( keyIDU === 13 ){ //enter key
                e.preventDefault(); 
            }
        }

    }
    
    clearMapChangeAndKeyPressed(){
        this.mapChange = false;
    }
}


