"use strict";
//import { EventEmitter } from "events"
// this would be a tweaked copy of the server side module: yvdl.ts that served as the core in the 
//yvdl web project;
// this should provide the same stable API so that the components can use it, 
// it must handleparsing, downloading, parsing, managing user data 
// and everything 
//so here's the deal
// socket.emit, will become this.emit
// this will be an eventemitter, the components will use it
// the this that i'm talking about is not YVDL module, or USERS ,it's  User, and BTW no Users class anymore, 
// pretty simple huh
// actually i dont need all this hustel
 // you know whatn this was a server , which means it was in complete isolation and thus it had to re impliments everything
 // but in react native this is not the case
 // the components willl do a great job themselves n and this should only provid UTILITY
 // utitlitie are : fbParser, mp3converter, .. 
 // not providing a whole damn structure ok?
 // this is just a bench of thrown up functionalities that will come handy when developing components,
 // but remùember, the jsx is the reall thing, the reall app , that's where data, and the only data that exixts, flows
 // so go ahead and delete things
 
 //12 feb 2022 4:56 the moment i discovered that expo is not e thing, and i was missing the whole awesome react natve debugin : fast loading and stuff
 //after a big trugle to get my phone to boot (yeahit might be it's end soon)
 //now i'm both happy bout it (fast and much less tedious  devoloping process) but also i feel stupid making the expo sync tool around my lack of knowledge
 //i'mean it was awesome but i wish it had a real purpose other than me missing all this.. whatever  let's get that app polished last things were splash screen wth cat and handling send but not when app is open
 
 const DEV_EXPO = false // disables everything that expo cannot handle: use it to conditionally fake things like rnfs, parsing, converting
const FAKE_DOWNLOAD_INTERVAL = 500
const FAKE_DOWNLOAD_CYCLES = 200

export const DEV_EXPO_MODE : DEV_EXPO_CONCERN = "UI&PARSER" //this key is globally acceced from all modules, dont re-define somewhire else

export type DEV_EXPO_CONCERN = "UI"|"UI&PARSER" //UI would make evrything go dummy allowing fast UI devlepment (no rela fetch operations), while Parser does all the legit fetching and parssing it only dumifies the ffmpeg and downloading operations

import filenamify from 'filenamify/filenamify';  //

//let filenamify = (val)=>val 

import  { LogLevel, RNFFmpeg, RNFFmpegConfig, Statistics,CompletedExecution, Execution, } from 'react-native-ffmpeg'
import fn from 'react-native-fs'
//import * as fn from './fnAltDeclarations' //todo: develop mi flow expo to automate commenting and uncommenting this




const ExternalStorageDirectoryPath = DEV_EXPO?"/storage/emulated/0": fn.ExternalStorageDirectoryPath
const DOWNLOADS_DIRECTORY = DEV_EXPO?"/storage/emulated/0": fn.DownloadDirectoryPath



//import path from "react-native-path";
const ffmpeg = null
import DOMParser from 'react-native-html-parser';
import miFbParser from './MiFbParser';
import { DashManifestResolved, FBHDUtils, VideoRepresentation } from './FBHDUtils';

//import { CompletedExecution, Execution, Statistics } from './ffmpegAltDeclarations';
//import  { LogLevel, RNFFmpeg, RNFFmpegConfig, Statistics,CompletedExecution, Execution, } from './rnffmpegAltDec.mi'


//import  { LogLevel, RNFFmpeg, RNFFmpegConfig, Statistics,CompletedExecution, Execution, } from './rnffmpegAltDec'

import {AppSettings, IOutputLocation, IPreferedNameSource, IPreferedQualty, ITitles, IImages, IPostInfo, IConversionProg} from './rev02types';
import { verbo } from './GeneralUtils';






const SAVE_HTML = true


const HTML_OUTPUT = "/storage/emulated/0"+'/YVDL/'+"last-post.html"


const LOG_FILE =  "/storage/emulated/0"+'/YVDL/'+"yvdl-v1.0.log"
const OUTPUT_FOLDER = "/storage/emulated/0"+'/YVDL'

const YVDL_CONFIG_FILE ="/storage/emulated/0"+'/YVDL/yvdl.config.json'



type Iyvdl_config = {
    localUserOutput?: string;
    wake_lock?: boolean;
}
export interface IPostInfo_v02 {
    dashManifestObject: DashManifestResolved
    titles:ITitles
    images:IImages
    VideoSize: number
}





export const DefaultAppSettings= {
    AutoFillSettings:
       {PreferedNameSource:"og-title", EnableThumbnail:true,PreferedVideoQuality:"Highest","OutputLocation":"Downloads"}, 
    "Legacy":{UseLegacyMode:false},
    "General":{EnableAutoFill:true}} as AppSettings
  


async function  parse_config(verbose=true):Promise <Iyvdl_config>{
    if(/* DEV_EXPO */ true ){return {}}

    return( await fn.exists(YVDL_CONFIG_FILE)? JSON.parse( (await fn.readFile(YVDL_CONFIG_FILE))||'{}')
    :  undefined)
}
function save_config(config:Iyvdl_config,verbose=true){
    return fn.writeFile(YVDL_CONFIG_FILE,JSON.stringify(config,null," ")) 
}



export class YVDL_Task  {
    cb_statusChange: (redundantStr:string,state:StateObj)=>void;
    cb_videoSaved: (redundantStr:string)=>void;
    cb_conversionProgress: (sedundantStr:string, id:number, ffmpegProg:Statistics)=>void;
    cb_downloadProgress: (sedundantStr:string, dlProg:IDownloadProg)=>void;
    cb_failed:(ev,err)=> void;
    
    constructor(query:string,website:string,mp3:boolean,out_path?:string,filename?:string, appSettings?:AppSettings){
       

      //static ctor time
      this.isLegacy=(appSettings?.Legacy?.UseLegacyMode===false)?false:true
      this.my_url=  query
      this.my_website=new Website(website)
      this.my_id= idGen(8)
      this.key= this.my_id+""
      this.mp3conversion= mp3
      this.taskFormat = mp3?"MP3":"MP4"
      this.capturedAppSettings = appSettings


      // 
      this.status='zero'
      this.outputFileName= filename ||"construction time filename"
      this.fullOutputFileName = ""
      this.outputPath=out_path || (appSettings.AutoFillSettings.OutputLocation=="YVDLFolder"?  ExternalStorageDirectoryPath+"/YVDL" :DOWNLOADS_DIRECTORY)
      this.download_prog = {d:0,t:0}
      verbo(" yvdl consturced")

    }
   //#static construction time properties
   my_url:string 
   isLegacy:boolean //02rev this keeps most of the old look and behavior 
   taskFormat:yvdl_task_format
   key:string //required by react's flat list
   my_id:number
   my_website: Website
   capturedAppSettings:AppSettings //todo: make sure this is b value cloned .. to make sure settings that are altered later wont affect the task in it's life time
   mp3conversion: boolean// will be deprecated
   uid : string //will be deprecated

   //#static later added properties
   post_info:IPostInfo //will be deprecated
   post_info_v02:IPostInfo_v02
   outputPath : string
   outputFileName:string
   ffmpegExecutionId:number //deprecate because there is the ffExcecution
   ffExcecution:Execution
   ffCompletedExecution:CompletedExecution
   chosenVideoRepresentation:VideoRepresentation
   chosenThumbnailUrl:string
   chosenTitle:string
   failurReason : string //refers to definitive faulire leading to a dead end 
   fullOutputFileName:string //02rev the definitive output filename


   //dynamic properties
   status: yvdl_task_status
   download_prog:IDownloadProg
   conversion_prog:IConversionProg
   ffStatistics:Statistics



   
   currentState():StateObj{
       
    
    return new StateObj ({status:this.status,id:this.my_id,uid:this.uid, post_info:this.post_info,
        post_info_v02:this.post_info_v02
    ,mp3:this.mp3conversion,download_prog:this.download_prog,converting_prog:this.conversion_prog,
    outputmp4:  this.outputFileName, 
    outputmp3:  this.outputFileName.slice(0,this.outputFileName.length-4)+".mp3",
    failurReason:this.failurReason,
    }) 
   }

   onDownloadProg(prog:number,t:number){// only sends the event this doeant take car of the console bar
    this.download_prog.d = prog
    this.download_prog.t = t
    this.cb_downloadProgress("downloadProgress",this.download_prog)
   }
   onConversionProg(ffmpeg_prog:Statistics){

    this.conversion_prog= ffmpeg_prog
    verbo("here, "+ ffmpeg_prog.time)

       this.cb_conversionProgress&& this.cb_conversionProgress("conversionProgress",this.my_id, ffmpeg_prog)
       
   }
   

   


//02rev this is used by go.. i , got it out of go's body to clean code
    fake_downloader(options:{progress:(res:{bytesWritten:number,contentLength:number})=>void}) {
    return{ promise: new Promise((resolve,reject)=>{
        let cc= 0
        let inv = setInterval(()=>{
            cc++
            options.progress({bytesWritten:cc*33000000/10,contentLength:33000000})
            if(cc==10){
                clearInterval(inv)
                resolve({statusCode:200})
            }
        },200)
    }) , othe:"iyub"}
    
}

//pass legit urls so that you can see them in logs for testing
fake_downloader_v02(options:{progress:(res:{bytesWritten:number,contentLength:number,stat_size:number,stat_speed:number})=>void,thumbnailUrl:string,audioUrl:string,fileName:string,postUrlForMeta:string}): Promise<{ffmpgExitCode:number}> {
    verbo("fake_downloader_v02 here's the passed args:")
    verbo("thumbnailUrl:"+options.thumbnailUrl)
    verbo("audioUrl:"+options.audioUrl)
    verbo("fileName:"+options.fileName)

    return new Promise<{ffmpgExitCode:number}>((resolve,reject)=>{
        let cc= 0
        let inv = setInterval(()=>{
            cc++
            let downloaded=cc*33000000/FAKE_DOWNLOAD_CYCLES
            options.progress({bytesWritten:downloaded,contentLength:33000000,stat_size:downloaded,stat_speed:55})
            if(cc==FAKE_DOWNLOAD_CYCLES){
                clearInterval(inv)
                resolve({ffmpgExitCode:0})
            }
        },FAKE_DOWNLOAD_INTERVAL)
    }) 
    
}


/**
 * auto fills properties like chosn video and titles.. and stores the n the yvdl propertes
 * this ensures consistency along lifetime and also avoiding doing the computations multiple times
 */
AutoFill(){
this.chosenVideoRepresentation=FBHDUtils.AutoDetermineVideoRepresentation(this.post_info_v02.dashManifestObject, this.capturedAppSettings)
this.chosenThumbnailUrl=this.autoChoseImage();
this.chosenTitle=this.autoChoseTitle();
this.fullOutputFileName = this.outputPath + "/" + filenamify(this.chosenTitle) + (this.taskFormat=="MP3"?".mp3":".mp4")
        
}

    /**
    * 02rev auto-fill image determination
    */
    autoChoseImage():string{
    return this.post_info_v02.images.ogImage||this.post_info_v02.images.thumbnailUrl||this.post_info_v02.images.thumbnailImage

    }
    /**
    * 02rev auto-fill title determination
    */
    autoChoseTitle():string{
        let prefered= this.capturedAppSettings.AutoFillSettings.PreferedNameSource
    let res = (prefered=="og-title"?this.post_info_v02.titles.ogTitle:
    prefered=="description"?this.post_info_v02.titles.descriptionTitle:
    prefered=="title"?this.post_info_v02.titles.nameTitle:undefined)
    ||this.post_info_v02.titles.ogTitle||this.post_info_v02.titles.nameTitle||this.post_info_v02.titles.descriptionTitle||"all 3 titles were falsy!"
    verbo("prefered: "+prefered+" auto chosed title is: "+res) 
    return res   
}


    /**
     * Start downloading, and then converting if mp3 is set
     * //02rev this seems to be fired by the tascCard's componentDidMount event.. and only by that
     */
    Go() {

        verbo("GO:::: id:"+this.my_id+", status:"+this.status)
        if(this.status!="pending"){

            throw new Error("cannot call Go on task '"+this.my_id+"' with status '"+this.status+"'")
            
        }
        if (this.isLegacy) {
            //#legacy approach untouched:
            let url = this.post_info.VideoUrl
            verbo("saving vd " + url + " to: " + this.outputPath + "/" + this.outputFileName + ".mp4")
            let downloader

            if (DEV_EXPO) {
                downloader = this.fake_downloader
            }
            else {
                downloader = fn.downloadFile
            }
            downloader({
                fromUrl: url, toFile: this.outputPath + "/" + this.outputFileName + ".mp4",
                progress: (res) => { this.onDownloadProg(res.bytesWritten, res.contentLength) }
            }).promise
                .then((dres) => {
                    if (dres.statusCode !== 200) {
                        this.status = "failed"
                        this.failurReason = "downloead res status code is " + dres.statusCode
                        this.cb_statusChange('statuchange', this.currentState())
                        return
                    }
                    this.cb_videoSaved("videoSaved")
                    if (this.mp3conversion) {
                        this.Go_Conversion();
                    }
                    else {
                        this.status = "done"
                        this.cb_statusChange('statusChange', this.currentState())
                        savePage()
                    }
                })
                .catch((err) => {
                    this.cb_failed("failed", err)
                })

        }
        else if (this.isLegacy == false) {
            //# fbhd approach:

            verbo("non-legacy Go function here:")


            let downloadMethod: (obj: any) => Promise<{ ffmpgExitCode: number }>
            if ((DEV_EXPO == false)) {
                verbo("real donloader was chosed")
                if (this.taskFormat == "MP3")
                    downloadMethod = this.fbhd_mp3_ffmpeg_downloader
                else if (this.taskFormat == "MP4")
                    downloadMethod = this.fbhd_mp4_ffmpeg_downloader
            }
            else {
                verbo("fake donloader was chosed")

                downloadMethod = this.fake_downloader_v02;
            }
            let promise: Promise<{ ffmpgExitCode: number; }> //general for both formats ..  to avoide repearting the same pieces of code for mp4
            if (this.taskFormat == "MP3") {
                promise =
                    downloadMethod({
                        audioUrl: this.post_info_v02.dashManifestObject.AudioRepresentations[0].BaseUrl,
                        thumbnailUrl: this.chosenThumbnailUrl,
                        fileName: this.fullOutputFileName,//note that the autofil takes care of the extension as part of the full flename but that might get awkward as more futures such as folow-up-tasks are introduced
                        postUrlForMeta: this.my_url,
                        postInf: this.post_info_v02,
                        ExecutionObtained: (exec) => { this.ffExcecution=exec; verbo("ecex obtained: "); verbo(JSON.stringify(exec)) },
                        progress: (res) => { 
                            if(res.executionId===this.ffExcecution?.executionId){//ensure that the event corresponds to this task and not some other ongoing task
                                this.onDownloadProg(res.bytesWritten, res.contentLength)
                             }
                         }
                    })
            }
            else if (this.taskFormat == "MP4") {
                
                verbo("chosen vid rep :")
                verbo(this.chosenVideoRepresentation.FBQualityLabel)
                promise =
                    downloadMethod({
                        audioUrl: this.post_info_v02.dashManifestObject.AudioRepresentations[0].BaseUrl,
                        thumbnailUrl: this.chosenThumbnailUrl,
                        videoUrl: this.chosenVideoRepresentation.BaseUrl,
                        fileName: this.fullOutputFileName,
                        postUrlForMeta: this.my_url,
                        postInf: this.post_info_v02,
                        ExecutionObtained: (exec) => { this.ffExcecution=exec; verbo("ecex obtained: "); verbo(JSON.stringify(exec)) },
                        progress: (res) => {
                            if(res.executionId===this.ffExcecution?.executionId){//ensure that the event corresponds to this task and not some other ongoing task
                            this.onDownloadProg(res.bytesWritten, res.contentLength)
                         } }
                    })
            }
            this.status="downloading"
            promise.then((dres) => {
                if (dres.ffmpgExitCode == 255) {
                    //canceled?
                    this.cb_videoSaved("videoSaved")
                    this.status = "done"
                    this.cb_statusChange('statusChange', this.currentState())
                    savePage()
                    //todo: specify that it's canceled and not completed through some more state and ui
                }
                else if (dres.ffmpgExitCode == 0) {
                    this.cb_videoSaved("videoSaved")
                    this.status = "done"
                    this.cb_statusChange('statusChange', this.currentState())
                    savePage()
                    return
                }
                else {
                    this.status = "failed"
                    this.failurReason = "return code code is not 0 :" + dres.ffmpgExitCode
                    alert("failed to 0")
                    this.cb_statusChange('statuchange', this.currentState())
                    return
                }
            })
                .catch((err) => {
                    alert("failed todownload")
                    this.status = "failed"
                    this.failurReason = err.message || err
                    this.cb_statusChange('statuchange', this.currentState())
                    return
                })
        }
    }
   
     tryCancelingDownload(){
         verbo("try canceling")
         
            verbo(" canceling excecution id:"+this.ffExcecution.executionId)
            if(DEV_EXPO){
                alert("dev no canceling")
                return
            }
            RNFFmpeg.cancelExecution(this.ffExcecution.executionId)

           
           
        
     }

   
     

     /**
      * runs ffmpeg , the native one ; idk why i'm keeping the web server one, //23-dec-2020 they're comming,  //02rev 7feb because it's awesome code.. remember some details about the epic 2020 coding up there, sorry to delete it for code readability
      * ive been strugling  to get this wierd phone ffmpeg to work and i did my first mp3 conversion which was easy but confusing
      * 
      * ok bal bla bla shut up and work 
      * got this to work at around 5:00 pm was easy peasy, just used the same old args
      * problem is, this seems kinda slowish, i'm not inmpressed by the speed and the bundle size 
      * is just the worst i hope that 75mb will enable me to add shit ton of features without more bundeling
      * 
      * 
      * 
      * you don't wanna deal with this, use the go_conversion 
      * @param input the input file name and path
      * @param output the output file name and path 
      * @param onProgress the progress callback, takes the native ffmpeg progress object
      * @returns promise the string is just the output filename so u dont have to use is
      */

     async mp3Converter_miracles(input:string,output:string,onProgress:(stats:Statistics)=>void):Promise<string>{

       return new Promise((resolve,reject)=>{

        //fake

        if(DEV_EXPO){
            setTimeout(() => {
                resolve("success")
            }, 6000);
            
            return
        }

        verbo("running ffmpeg ")

        let mp3inp =  input
        let thumb_url = this.post_info.ThumbnailUrl.replace(/https/,"http")

        RNFFmpegConfig.enableStatisticsCallback((stats)=>{
            console.log(stats.size+"  pppppppppppp  "+ stats.time)

            onProgress(stats)})



        RNFFmpeg.executeWithArguments([
            //input 1 : the video
            "-y",
            "-vn" ,
            '-i', mp3inp,
            //input 2  the thumbnail (it's otions are befor it)
            '-f', 'mjpeg',
            "-i" , thumb_url,

            '-map', '0',
            '-map', '1',
            '-c:v', 'mjpeg',
            '-c:a:0', 'mp3',
            '-disposition:v:1', 'attached_pic',
             
            '-id3v2_version', '3',
            '-write_id3v1', '1',
             '-metadata', 'title=',
             '-metadata', 'comment=YassVideoDownloader> " ' +this.my_url + '"',
             '-metadata', 'album=YassVideoDownloader>"' +this.my_url + '"',
             '-metadata:s:v', 'comment=Cover (front)',
             '-metadata:s:v', 'title=Cover (front)',
             
             output


        ])
        .then(result => {
            
            console.log(`FFmpeg process exited with rc=${result}.`)
            if(result==0){
                verbo('mp3Converter-miracles: ffmpeg finished processing',3);
            resolve('success')
                
            }
        
        })




        
        return

        let escaped_url = this.my_url.replace(/\\/g,"\\\\")
        ffmpeg()
        .on('progress', function(progress:any) {
         onProgress(progress)
          })  
          
       })
        
     }


    /**
     * 
     * 02rev runs ffmpeg to download audio //02-feb-2022
     * @param audioUrl 
     * @param thumbnail  if undefined there will be no thumbnail
     * @param output full filename with extension
     * @param onProgress 
     * @returns 
     */
      async fbhd_mp3_ffmpeg_downloader(options:{progress:(res:{bytesWritten:number,contentLength:number,executionId:number})=>void,
      thumbnailUrl:string,audioUrl:string,fileName:string,postUrlForMeta:string,postInf:IPostInfo_v02,
      ExecutionObtained:(exec:Execution)=>void}):Promise<{ffmpgExitCode:number}>{

        return new Promise<{ffmpgExitCode:number}>((resolve,reject)=>{
         verbo("running ffmpeg ")
         verbo("fbhd_mp3_ffmpeg_downloader here's the passed args:")
         verbo("thumbnailUrl:"+options.thumbnailUrl)
         verbo("audioUrl:"+options.audioUrl)
         verbo("fileName:"+options.fileName)
 
         let thumb_url = options.thumbnailUrl.replace(/https/,"http")
         let audUrl= options.audioUrl.replace(/https/,"http")
         let totalDuration = (options.postInf.dashManifestObject.Duration.getTime()-new Date(0,0,0,0,0,0,0).getTime()) // in terms of millisecond/10, just like ffmpeg stats returns it
         RNFFmpegConfig.enableStatisticsCallback((stats:Statistics)=>{
                options.progress({bytesWritten:stats.time,contentLength:totalDuration,executionId:stats.executionId})
             
            })//todo adabt from ffmpeg stts to what's eccpected
 

 
         //whatfbhd literally does for mp3:
         //ffmpeg  -v 32  -multiple_requests 1  -hide_banner  -vn -i "audUrlGoesHere"
         // -an -i "imgUrlGoesHere"
         // -map 0 -map 1  -c:v:0 mjpeg  -disposition:v:0 attached_pic -metadata title="" 
         //-metadata:s:v "comment='Cover (front)'" -metadata:s:v "title='Cover (front)'"
         // "E:\TOOLS\endof2021 classical music\Summer Was Fun & Laura Brehm - Prism [NCS Release].mp3"  -y 
         RNFFmpeg.executeAsyncWithArguments([
             //input 1 : the video
             "-multiple_requests","1",
             "-hide_banner",
             "-vn" ,
             '-i', audUrl,
             //input 2  the thumbnail (it's otions are befor it)
             '-an', 
             "-i" , thumb_url,
             '-map', '0',
             '-map', '1',
             '-c:v:0', 'mjpeg',
             '-disposition:v:0', 'attached_pic',
             '-id3v2_version', '3',
             '-write_id3v1', '1',
              '-metadata', 'title=',
              '-metadata', 'comment=YassVideoDownloader> " ' +options.postUrlForMeta + '"',
              '-metadata', 'album=YassVideoDownloader>"' +options.postUrlForMeta + '"',
              '-metadata:s:v', 'comment=Cover (front)',
              '-metadata:s:v', 'title=Cover (front)',
              options.fileName , "-y"
 
 
         ],(completedExecution)=>{
             //do the rc checking here
             console.log(`FFmpeg process exited with rc=${completedExecution.returnCode}.`)
             if(completedExecution.returnCode==0||completedExecution.returnCode==255){//hope 255 only means canceled by user
                 
                    verbo("scaning")
                    fn.scanFile(options.fileName).then((res)=>{
                        console.log("scaning done : ",res)
                    })
                 
             resolve({ffmpgExitCode:completedExecution.returnCode})
                 
             }
             else{
                 reject("non zero exit code")
             }
         })
         .then(executionId => {
            RNFFmpeg.listExecutions().then(executionList => {
                let executionObj= executionList.find(ex=>(ex as Execution).executionId==executionId)
                options.ExecutionObtained&& options.ExecutionObtained(executionObj);
            });
         })
         return
 
        })
         
      }



    
    /**
     * * 02rev runs ffmpeg to download vid //03-feb-2022
     * @param options 
     * @returns 
     */
       async fbhd_mp4_ffmpeg_downloader(options:{progress:(res:{bytesWritten:number,contentLength:number,executionId:number})=>void,
       thumbnailUrl:string,audioUrl:string,videoUrl,fileName:string,postUrlForMeta:string,
       postInf:IPostInfo_v02,ExecutionObtained:(exec:Execution)=>void}):Promise<{ffmpgExitCode:number}>{

        return new Promise<{ffmpgExitCode:number}>((resolve,reject)=>{
         verbo("running ffmpeg for mp4 downloading, the passed args:")
         verbo("thumbnailUrl:"+options.thumbnailUrl)
         verbo("audioUrl:"+options.audioUrl)
         verbo("vdUrl:"+options.videoUrl)
         verbo("fileName:"+options.fileName)
 
         let thumb_url = options.thumbnailUrl.replace(/https/,"http")
         let audUrl= options.audioUrl.replace(/https/,"http")
         let vidUrl= options.videoUrl.replace(/https/,"http")
         let totalDuration = (options.postInf.dashManifestObject.Duration.getTime()-new Date(0,0,0,0,0,0,0).getTime()) // in terms of millisecond/10, just like ffmpeg stats returns it
         RNFFmpegConfig.enableStatisticsCallback((stats:Statistics)=>{
            options.progress({bytesWritten:stats.time,contentLength:totalDuration,executionId:stats.executionId})
                         
           })//todo adabt from ffmpeg stts to what's eccpected
 
         //whatfbhd literally does for mp4 taks:
        //ffmpeg  -v 32  -multiple_requests 1  -vn -i "audGoesHere"
        // -an -i "thumbGoesHere"
        // -an -i "vidGoesHere"
        // -map 0 -map 1 -map 2  -c:v:0 mjpeg  -disposition:v:0 attached_pic  -metadata title=""
        // -metadata:s:v:0 "comment='Cover (front)'" -metadata:s:v:0 "title='Cover (front)'"
        // "fullFilenAME.mp4"  -y 
        RNFFmpeg.executeAsyncWithArguments([
            //input 1 : the AUDIO
            "-multiple_requests","1",
            //"-hide_banner",
            "-vn" ,
            '-i', audUrl,
            //input 2  the thumbnail 
            '-an', 
            "-i" , thumb_url,
            //INPUT3 THE VID
            '-an', 
            "-i" , vidUrl,
            '-map', '0',
            '-map', '1',
            '-map', '2',
            '-c:v:0', 'mjpeg',
            '-c:v:1', 'copy',//02rev this is my (06-feb) solution attempt to the low quality prblem.. it was using the mpeg4 codec which is bad  
            '-disposition:v:0', 'attached_pic',
            '-id3v2_version', '3',
            '-write_id3v1', '1',
             '-metadata', 'title=',
             '-metadata', 'comment=YassVideoDownloader> " ' +options.postUrlForMeta + '"',
             '-metadata', 'album=YassVideoDownloader>"' +options.postUrlForMeta + '"',
             '-metadata:s:v:0', 'comment=Cover (front)',
             '-metadata:s:v:0', 'title=Cover (front)',
             options.fileName , "-y"


        ],(completedExecution)=>{
            //do the rc checking here
            console.log(`FFmpeg process exited with rc=${completedExecution.returnCode}.`)
            if(completedExecution.returnCode==0||completedExecution.returnCode==255){//hope 255 only means canceled by user
                
                   verbo("scaning")
                   fn.scanFile(options.fileName).then((res)=>{
                       console.log("scaning done : ",res)
                   })
                
            resolve({ffmpgExitCode:completedExecution.returnCode})
                
            }
            else{
                reject("non zero exit code")
            }
        })
        .then(executionId => {
            verbo("then here")

            RNFFmpeg.listExecutions().then(executionList => {
                verbo("listing then here")
                let executionObj= executionList.find(ex=>(ex as Execution).executionId==executionId)
                options.ExecutionObtained&& options.ExecutionObtained(executionObj);
            });
         })
         return
 
        })
         
      }


   /**
    * start converting, this only requires an existent mp4 to work on, that means it can be called
         externaly at any later time (no mp3 flag is involved )
    */
     async Go_Conversion(){  
         DEV_EXPO && verbo("dev_expo: canceling checking for mp4 exist")
        if ( (!DEV_EXPO)&& (await fn.exists(( this.outputPath+"/"+ this.outputFileName+ ".mp4"))==false)){
           // this.emit("error", "Go_Conversion:: couldnt find file, something went wrong") lets use the status change instead
            this.status="failed"
            this.failurReason = 'couldnt find mp4 file, try restarting the task'
            this.cb_statusChange("statusChange",this.currentState())
            savePage()
            return
        }
        this.status= "converting"
        this.cb_statusChange("statusChange",this.currentState())
        savePage()
        // mocked converting 
        verbo(" converting",4)

        let convert = await this.mp3Converter_miracles( (this.outputPath+"/"+this.outputFileName+".mp4") ,
         (this.outputPath+"/"+this.outputFileName+".mp3" )  ,

            ((progress:Statistics)=>{
                this.onConversionProg(progress)
            }).bind(this)
            )

        if(convert!=='success'){

            // case converting failed
            this.status = "failed"
            this.failurReason = 'conversion failed'
            this.cb_statusChange("statusChange",this.currentState())
            savePage()
            return
        }
        verbo("scaning")
        fn.scanFile(this.outputPath+"/"+this.outputFileName+".mp3").then((res)=>{
            console.log("scaning done : ",res)
        })
            this.status= "done"      
            this.cb_statusChange("statusChange",this.currentState())
            savePage()
            return
     }


     /**
     * 02rev
     * this is not used.. it was forgotten and another set of function was written
     * start downloading the audio with an underlying ffmpeg utility, 
     */
         async Go_MP3_auto(){  
           
           this.status= "downloading"
           this.cb_statusChange("statusChange",this.currentState())
   
           let convert = await this.mp3Converter_miracles( (this.outputPath+"/"+this.outputFileName+".mp4") ,
            (this.outputPath+"/"+this.outputFileName+".mp3" )  ,
   
               ((progress:Statistics)=>{
                   this.onConversionProg(progress)
               }).bind(this)
               )
   
           if(convert!=='success'){
               // case converting failed
               this.status = "failed"
               this.failurReason = 'conversion failed'
               this.cb_statusChange("statusChange",this.currentState())
               savePage()
               return
           }
               this.status= "done"      
               this.cb_statusChange("statusChange",this.currentState())
               savePage()
               return
        }



     /**
      * Initialize the task by fetching post info, like the older yass2049 approach, but with significant tweaks 
      */
     Init(options?:{name:string}):Promise<StateObj>{
      
      return new Promise(async (resolve,reject)=>{
        if(this.my_website.veryfi_url(this.my_url)!==true){
            reject (new Error("entered url is not valide for the website "+ this.my_website.name ));
        }
        
        verbo('valid url ' + this.my_url,4,false)

        if(this.isLegacy){
            //#legacy mode.. untouched code
       
        

        let page_content 
        try {
            verbo("fetching "+this.my_url )
            DEV_EXPO && verbo("DEV_EXPO: faking the fetch " )
            page_content = {
                text:()=>" fake content"
            }  
            if (!DEV_EXPO){
                page_content = await fetch(this.my_url)
                
            }
            verbo("page fetched")
        }
        catch(err){
            //fetching_post_spinner.stop()
            verbo(c("red", "error: couldnt fetch post content this err happened: ")+ c ("red",err.message))
            reject(err)
            return
        }
        page_content = await page_content.text()
        verbo( "page content lengh is : "+ page_content.length)
        DEV_EXPO && verbo("dev_expo: canceling save html")
        if( (!DEV_EXPO)&&(SAVE_HTML)){
             fn.writeFile(HTML_OUTPUT,page_content)
            //fetching_post_spinner.info("html saved at " + c("cyan",HTML_OUTPUT))
        }

        let Parser = this.my_website.name=="facebook"?FbParser:this.my_website.name=="instagram"?igParser:FbParser
        verbo("used parser is : " + c("cyan", Parser.name) + " website.name is : " + this.my_website.name,2)
         Parser(page_content)
             .then((post_inf)=>{
                this.post_info=post_inf
                this.status = "pending" // no statechange emiting before the init promise resolves
                this.outputFileName = filenamify(   post_inf.Title)
                 resolve (this.currentState())
                 savePage()
                 return this
             })
             .catch(err=>{
                 verbo(c("red","parser rejected: ", err.message )  )
                 reject(err)
             })  // just pass the same error from the fbParser methode to whoever called this

            }
             else if(this.isLegacy==false){
                //#rev2 mode which is the fbhd approach. using the FBHDUtiles.ts as helper


                
        let page_content : string
        try {
            verbo("fetching "+this.my_url )
           
             
            if (DEV_EXPO&&(DEV_EXPO_MODE=="UI" ) ){
                verbo("DEV_EXPO: faking the fetch " )
                page_content = " fake content"
                
            }
            else{
                verbo("real fecth operaation")
                page_content = await FBHDUtils.FetchVideoPage(this.my_url)
            }
            verbo("page fetched")
        }
        catch(err){
            //fetching_post_spinner.stop()
            verbo(c("red", "error: couldnt fetch post content this err happened: ")+ c ("red",err.message))
            reject(err)
            return
        }
        
        verbo( "page content lengh is : "+ page_content.length)
        DEV_EXPO && verbo("dev_expo: canceling save html")
        if( (!DEV_EXPO)&&(SAVE_HTML)){
             fn.writeFile(HTML_OUTPUT,page_content)
            //fetching_post_spinner.info("html saved at " + c("cyan",HTML_OUTPUT))
        }

             FbParserv02(page_content)
             .then((post_inf:IPostInfo_v02)=>{
                this.post_info_v02=post_inf
                this.status = "pending" // no statechange emiting before the init promise resolves
                this.AutoFill()
                resolve (this.currentState())
                //outpfile name assigning was thre
                savePage()
                return this
             })
             .catch(err=>{
                 verbo(c("red","parser rejected: ", err.message )  )
                 reject(err)
             })  // just pass the same error from the fbParser methode to whoever called this




            }
      })
    }
}

 

 class Website {
    constructor(name:string){
       this.name = name
    }
    name :string
    /**
     * 
     * @param url url to test 
     * @returns true: valid url, false: unvalid url
     */
    veryfi_url(url:string) :boolean {
        return true

    }
}








/**
 * Based on the awesom: MiFbParser.ts , stable, bug-free, and just works be aware of the VideoSize option
 * Resolves the raw fb page content to a IPostInfo object , optionally including the VideoSize which woiuld requere a connection to take place (Head)
 * @param date  raw html content
 */
function FbParser (data:string ):Promise<IPostInfo> {
    verbo("fbparser was called with content lenght: " + data.length)


    return miFbParser(data,{fetch_video_size:false})
}

/**
 * 02rev keeping much of the logic .. but going fbhd
 * @param date  raw html content
 */
 function FbParserv02 (data:string ):Promise<IPostInfo_v02> {
    verbo("fbparserv02 was called with content lenght: " + data.length)

    return new Promise((resolve,reject)=>{
        if(FBHDUtils.ExractIsSomethingWentWrongPageFromPage(data)){
            reject("Server responded with something went wrong page")
            return
        }
        if(FBHDUtils.ExractIsPrivateFromPage(data)){
            reject("This video is private")
            return
        }
        let rawDashManif = FBHDUtils. ExractDashManifestRawContentFromPage(data)
        if(!rawDashManif){
            reject("couldnt find dashmanifest in the page (page content:"+data.length+")")
            return
        }
        let manifestObj = new DashManifestResolved(rawDashManif)
        if(!manifestObj){
            reject("something went wrong parsing dashmanifest")
            return
        }
        verbo("passed DashManifest parsing")
        let titles = { } as ITitles
        titles.ogTitle= FBHDUtils.ExractOgtitleFromPage(data) 
        verbo("passed ogTitle parsing")
        titles.nameTitle= FBHDUtils.ExractNametitleFromPage(data) 
        verbo("passed nameTitle parsing")
        titles.descriptionTitle= FBHDUtils.ExractDescriptiontitleFromPage(data) 
        verbo("passed descriptionTitle parsing")
        verbo("passed titles parsing: "+JSON.stringify(titles))
        let images = { } as IImages
        images.ogImage= FBHDUtils.ExractOgImageFromPage(data) 
        images.thumbnailImage= FBHDUtils.ExractThumbnailImageFromPage(data) 
        images.thumbnailUrl= FBHDUtils.ExractThumbnailUrlFromPage(data) 
        verbo("passed images parsing: "+JSON.stringify(images))


       
        resolve({
            titles:titles,
            images:images,
            dashManifestObject:manifestObj,
            VideoSize:3333
        })

    })
    

    


}











/**
 * same as fb parser, with some tweaks regarding the video title that hides somewhere else 
 * Resolves the raw instagram page content to a IPostInfo object , including the
 * videoSize element, which actually requires an axios.head() call, so this can take some time
 * @param date  raw html content
 */
function igParser (data:string ):Promise<IPostInfo> {
    verbo("igParser was called with content lenght: " + data.length)



 return new Promise(async (resolve,reject)=>{
     let post_inf:IPostInfo = { } as IPostInfo    
         let title:string = null
         let description:string = null // igParser ateempts to grab the title and then falls back to description, 
         let og_title:string = null // yeah another one, fuck
         let url:string = ''
         let thumb:string = ''
         post_inf.ThumbnailUrl= ""
         post_inf.VideoUrl = ""
         post_inf.Title = "titel-untitled"


    

         let ig_parser = null
         

         //parsing the title here's an example:  ("product_type":"igtv","title":"This Game - No Game No Life OP (Xeuphoria Piano Ver.)","video_duration":109.38,)
        let title_ix = data.indexOf('"title":')
        let title_end_ix  = 0
        if(title_ix >1){
            title_end_ix = data.indexOf('",',title_ix)
            if(title_end_ix>title_ix){
                title = data.slice(title_ix+9,title_end_ix)
                verbo(c("green","found title: ") + title)
    
            }
        }
        


       

        
         
         
         ig_parser._cbs.onopentag =  function (name:string, attribs: { property: string; content: string; name: string; }) {
                 
             //<meta property="og:video" content="https://vid
             if (name === "meta" && attribs.property === "og:video") {
                 console.log(c('green' , "video url found: "));
                  url = attribs.content;
                  console.log(url);
         
                  //simulating/fb
                  //foundVideoUrl="http://192.168.43.205:5001/Evanescence-My%20Immortal%20lyrics.mp4"
         
             }
             if (name === "meta" && attribs.property === "og:image") {
                 thumb = attribs.content;
                 verbo(c('green' ,"thumbnail url found "));

                  //simulating/fb
                  //foundThumbnailUrl="http://192.168.43.205:5001/fake-thumb1.png"
             }
             if (name === "meta" && attribs.name === "description") {
                verbo(c('green' ,"descriptoin found: "));
                verbo(attribs.content);
                description = attribs.content;
                 //simulating/fb
                // foundPostTitle = "fake video title by yass"
            }

            if (name === "meta" && attribs.property === "og:title") {
                verbo(c('green' ,"og:title found: "));
                verbo(attribs.content);
                og_title = attribs.content;
                 //simulating/fb
                // foundPostTitle = "fake video title by yass"
            }
             //og:title
         };
         

         ig_parser.onend=async function () {
             console.log("ig_parser:: parsing ended")
             post_inf.VideoUrl = url
             post_inf.ThumbnailUrl = thumb
             post_inf.Title=title || og_title || description || "fallback-name"
             post_inf.VideoSize = 11111
            

             
             if((post_inf.VideoUrl&&(post_inf.VideoUrl.length>10)) && post_inf.ThumbnailUrl){
                 
                 verbo("parsing ended successfully")

                 resolve(post_inf)
 
             }
             else {
                 reject(new Error('yassIgParser Couldnt find vido url and/or thumbnail url'))
             }
 
             
         }
      verbo("parsing content ..")
         
         ig_parser.end(data)  // write stuff to the parser and let it fires your pre-defined callbacks, pretty neat  :)

 })

}


export interface IDownloadProg{ 
    d:number
    t:number
}

/**
 * generates a random numiric id with the specified lenght N, 
 * since it returns a number, it must start with a 1 at the left, thats to ensure that the number will contain N digits , exmp: 100054684 ; 109412510
 * @param N 
 */
function idGen(N:number):number {
    return Math.pow(10,N)+ Math.floor(Math.random()* Math.pow(10,N-1)) 
}



/**
 * by yass
 * version 2 : accepts mutiple params and only applies the color on the first one
 * 
 * all params are impliictely converted to string
 * @param {string} color
 * @param {string} str
 * @returns {string} colored strirng for console
 * 
 */

function c( color:any, str:any, ...params:string[]){
    return  str +params.reduce((prev,current)=>{return prev + current},"");
}





/**
 * returns true if the string is a valid URL and is withing the list of websites if any was passed, and returns false otherwise
 * 
 * it shows loggings when thing go wrong, disable those with the log paramm set false
 * in case of a false return there's no way to know whether it's because the string is not a valid url or it just doesnt meet the acceptWebsites condition, 
 * @param str 
 * @param acceptWebsites 
 */

export  function isValidUrl(str:string,acceptWebsites?:string[],log:boolean=true):boolean{
    if(str){
        let isUrl :URL
        try{
            isUrl = new URL(str)

        }
        catch(err){
            log && verbo(c("red",err.message||'invalid URL'))
            return false
        }
        
        if(!acceptWebsites) return true;
        for (let i = 0; i < acceptWebsites.length; i++) {
            const website = acceptWebsites[i];
            if( isUrl.hostname.includes(website)) return true;  
        }
            
        log && verbo(c("red","invalid URL") + " only accepts hostnames: " + c("cyan",acceptWebsites.reduce((prev,c)=>prev+c+" ","")))
        return false
    }
    return false
}

//02rev why this still exists.

export class StateObj implements ISavedTask{
    constructor(props:{id?:number,uid?:string,status?:yvdl_task_status,thumbnail?:string,download_prog?:IDownloadProg,converting_prog?:IConversionProg,post_info?:IPostInfo,post_info_v02?:IPostInfo_v02,mp3?:boolean,outputmp4?:string,outputmp3?:string,failurReason?:string}){
      props=  props
      this.id=props.id
      this.uid = props.uid
      this.status = props.status
      this.thumbnail= props.thumbnail  /// just for the sake of compatibility, this is deplucated, cus its within te post info
      this.post_info=props.post_info
      this.post_info_v02=props.post_info_v02
      this.outputmp3=props.outputmp3
      this.outputmp4=props.outputmp4
      this.mp3=props.mp3
      this.converting_prog=props.converting_prog
      this.failurReason = props. failurReason
    }
  
    id:number
    uid:string
    status:yvdl_task_status
    thumbnail:string
    download_prog:IDownloadProg
    converting_prog:IConversionProg
    post_info:IPostInfo
    post_info_v02:IPostInfo_v02
    mp3:boolean
    outputmp4:string
    outputmp3:string
    failurReason:string
    
}






export class YVDL_API  {
    /**
     * // used to be User
     * this is supposed to handle everything user related
     * @example
     * let yass = new User(socket,uid,"yass",true)
     */
    constructor() {
        
        
    }
    tasks:Array<YVDL_Task>
  
   


   /**
    * save the current user as a json named after the id e.g:"78542457.json", if already it overrides it
    *
    *  can be used to create a new user page
    * @param folder directory where to save the file, defaults to ./database
    */
    async savePage(folder='./database'){

      let usrPageContent:IUserPageContent
      usrPageContent = {
          tasks: this.tasks.map((task)=>{
              return YVDL_UTILS.YVDL_Task_to_Saved_Task(task)

          })

      }
      fn.writeFile((  (folder) +"\\"+"user-data.json"), JSON.stringify(usrPageContent,null," ") )
      verbo("userPage saved : user-data.json" + " containing "+ this.tasks.length+" tasks" )
    }
   

   

}


export type yvdl_task_status = "zero"|"pending"|"downloading"|"converting"|"done"|"failed"|"deleted"|"delivered"
export type yvdl_task_format = "MP3"|"MP4" //02rev added

interface ISavedTask { // SOT, officially used in files, by api 21-nov

    id: number
    uid: string
    status:  yvdl_task_status  // zero 0 | downloading 1| converting 2| done 3 | failed | delivered // usefull cuz delivered ones would stack at the bottom leeting the undelivered ones rise above, 
    download_prog:   {d:number,t:number}
    converting_prog:IConversionProg
    post_info :  IPostInfo
    mp3 : boolean
    outputmp4: string,
    outputmp3: string

}


interface IUserPageContent{
    tasks:ISavedTask[]
}

namespace YVDL_UTILS{


    export function YVDL_Task_to_Saved_Task(task:YVDL_Task):ISavedTask{
        verbo("YVDL_Task_to_Saved_Task: converted one",4,false)
       return {status:task.status,id:task.my_id,uid:task.uid, post_info:task.post_info
            ,mp3:task.mp3conversion,download_prog:task.download_prog,converting_prog:task.conversion_prog,
            outputmp4:  task.outputFileName + ".mp4",
            outputmp3:   task.outputFileName+".mp3",
            }

    }

    export function isValidSavedTask(obj:any){
        let keys = Object.keys(obj)
        let isValid = (
        keys.includes('id')
        && keys.includes('uid')
        && keys.includes('status')
        && keys.includes('download_prog')
        && keys.includes('post_info')
        && keys.includes('mp3')
        && keys.includes('outputmp4')
        && keys.includes('outputmp3')
        )

        if(!isValid){
            verbo("isValidSavedTask: the passed object is"+ c('red',"not a valid ISavedTask object")+", should be treated as corrupt",3,false)
        }
        return isValid

    }

}









 function savePage() {
     
 }