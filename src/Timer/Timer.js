/* 
 * Created by Shane Walsh
 */


export default class Timer{
     
    constructor(){
        this.frame = 0;
        this.ticker = 0;
        this.seconds = 0; 
    }
    
    tick(){
        if(globe.isPlaying){
            this.frame++;
            pSub.publish(globe.F1, {}, true);
            if(this.frame >= 6){
                this.frame = 0;
                this.ticker++;
                pSub.publish(globe.T1, {}, true);
                if(this.ticker %2 == 0){
                    pSub.publish(globe.T2, {}, true);
                }
				
                if(this.ticker >= 10){
                    this.ticker = 0;
                }
            }
        }
    }  
    
    
}