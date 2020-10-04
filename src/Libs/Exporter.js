/* 
 *  Created by Shane Walsh
 *  
 */

export default class Exporter{
    constructor(){
        this.bufferSize = 1000;
        this.tempFile = "content/maps/tempExport.xml"
    }
        
    export( fileLocation, content, topicToEmit,callback){
        var tempFile = fs.createWriteStream(this.tempFile);
        var len = content.length;
        for(var i = 0; i < len; i+=this.bufferSize ){
            tempFile.write(content.substring(i,i+this.bufferSize),'utf8');
        }
        tempFile.on('close', () => {
            tempFile.close();
            fs.rename(this.tempFile,fileLocation);
        });
        tempFile.end();
    }
        
}
