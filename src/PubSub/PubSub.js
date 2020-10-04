/* 
 *  Created by Shane Walsh
 *  
 */

export default class PubSub {
    constructor(){
        this.topics = {};
        this.uniqueId = -1;
    }
        
    subscribe (topic, func, binder) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        var id = (++this.uniqueId).toString();
        this.topics[topic].push({
            id: id,
            func: func,
            binder:binder
        });
        if(globe.debug){
            var s = "Topic:"+ topic + " ID: "+ id+ "  Func:"+func +" \n";
            logg(s);
        }
        return {uId:id,topic:topic};
    };

    publish (topic, args, silent) {
        if(globe.debug && !silent){
            logg("publish : "+ topic + " args: " + args);
        }
        if (!this.topics[topic]) { // this should catch if undefined is set at the topic, but needs to be tested, by calling it with an undefined topic
            return false;
        }
        var subscribers = this.topics[topic],
            len = subscribers ? subscribers.length : 0;

        while (len--) {
            let binder = subscribers[len].binder,
                funct = subscribers[len].func;
            if(binder){
                funct = funct.bind(binder);
                funct(topic,args);
            }else{
                funct(topic, args);
            }
        }
        return true;

    };

    unsubscribe(token) {
        for (var m in this.topics) {
            if (this.topics[m]) {
                for (var i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].binder === token) {
                        this.topics[m].splice(i, 1);
						return this.unsubscribe(token);
                    }
                }
            }
        }
        return false;
    };   
}