/* 
 *  Created by Shane Walsh
 *  
 */

export default class AudioManager{
    constructor(){
        this.props = {		
			audioMap:{},
			soundAffectVolume:.2, // "sound"
			backgroundSoundVolume:.4, //"bg" type
			
			TYPESOUND:"TYPESOUND",
			TYPEBG:"TYPEBG",

			audioWaitMap:{}
			
		};
		this.setupListeners();
    }
	
	update(){
	    var p = this.props;
		// loop on the audioWaitMap and lower the number, only play each sound once every 5 frames or more.
		var deletemap = [];
		var index = 0;
		for (let key in p.audioWaitMap) {
            if (p.audioWaitMap.hasOwnProperty(key)) {
                let num = p.audioWaitMap[key];
                p.audioWaitMap[key] = --num;
                if(num < 1){
                    deletemap[index++] = key;
                }
            }
        }

        for(var i = 0; i < index;i++){
            delete p.audioWaitMap[deletemap[i]];
        }

	}
	//https://developer.mozilla.org/en/docs/Web/HTML/Element/audio
	
	addAudio({name,audioObject, type = "TYPESOUND", volume = 0.4}){ 
		this.props.audioMap[name] = audioObject;
		this.props.audioMap[name].type = type; 
		this.props.audioMap[name].preload = "auto"; 
		this.props.audioMap[name].volume = volume; 
	}
	
	playAudio(topic,{name}){
	    var p = this.props;
		if(p.audioMap[name]){
		    if(!p.audioWaitMap[name]){
			    p.audioMap[name].play();
			    p.audioWaitMap[name] = 5;
			}
		}
	}	
	
	playAudioNewInstance(topic,{name}){
	    var p = this.props;
		if(p.audioMap[name]){
		    if(!p.audioWaitMap[name]){
                var tmp = new Audio();
                tmp.src = p.audioMap[name].src;
                tmp.volume = p.audioMap[name].volume;
                tmp.type = p.audioMap[name].type;
                tmp.play();
                p.audioWaitMap[name] = 5;
            }
		}
	}
	
	stopAudio(topic,{name}){
		if(this.props.audioMap[name]){
			this.props.audioMap[name].pause();
			this.props.audioMap[name].currentTime = 0;
		}
	}
	
	stopAllAudio(){
		for (let key in this.props.audioMap) {
			if (this.props.audioMap.hasOwnProperty(key)) {
				this.props.audioMap[key].pause();
				this.props.audioMap[key].currentTime = 0;
			}
		}
	}

	loopAudio(topic,{name,bool = true}){ // whether to set a yoke as a repeating audio source or not.
		if(this.props.audioMap[name]){
			this.props.audioMap[name].loop = bool;
		}
	}
	
	adjustAudio(topic, {sav, bsv}){ // if a user moves a sound slider on sf or bg sound, have to loop over all sounds and set their volume. // some may be hard coded
		let p = this.props;
		
		if(sav){
			p.soundAffectVolume = sav/10;
		}
		if(bsv){
			p.backgroundSoundVolume = bsv/10; // because slider works with 0-9 but audio uses 0-0.9
		}
		
		for (let key in p.audioMap) {
			if (p.audioMap.hasOwnProperty(key)) {
				let d = p.audioMap[key];
				if(d.type == "TYPESOUND"){
					d.volume = p.soundAffectVolume;
				}
				else{ // only one other option at the moment TYPEBG
					d.volume = p.backgroundSoundVolume;
				}
			}
		}
	}
	
	setupListeners(){
		pSub.subscribe(globe.PLAYSOUND,this.playAudio,this);
		pSub.subscribe(globe.PLAYSOUNDNEWINSTANCE,this.playAudioNewInstance,this);
		pSub.subscribe(globe.STOPSOUND,this.stopAudio,this);
		pSub.subscribe(globe.ADJUSTVOLUME,this.adjustAudio,this);
	}
	
	
}