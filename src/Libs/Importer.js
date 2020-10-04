/* 
 *  Created by Shane Walsh
 *  
 */

import xml2js from 'xml2js';

export default class importer{
    constructor(){
        
    }
    
    import(fileLocation, topicToEmit, callback){
        fs.readFile(fileLocation,'utf8', function(err, data) {
            if(err){
                loggError(err);
            }
            else{
                callback(data);
            }
        });
    }
        
}
