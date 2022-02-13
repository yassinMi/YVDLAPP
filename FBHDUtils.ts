"use strict";

import { verbo } from './GeneralUtils';
import {AppSettings, IOutputLocation, IPreferedNameSource, IPreferedQualty} from './rev02types';



//02rev this is what this 02rev is pretty much all about
// mainly stranslated code; i'm too lazy to repeat the fbhd project in js.. so i'm copying my code here
//also mirroring the same data structures (videoRepresentations).. since they both look elehent 
//and the the exact same scrapped data
//this also contains everything one need for fb video, scrappng.. in terms of regex, fetching methode, used headers.. and stuff


 const DEV_EXPO = false // disables everything that expo cannot handle: use it to conditionally fake things like rnfs, parsing, converting





export class DashManifestResolved{
    /**
     * pass the raw dash manifest str.. make sure it's well formated 
     */
    constructor(rawDashManfst:string) {
        this.rawDashManifest= rawDashManfst;

        verbo("dash is:")
        verbo(this.rawDashManifest)
        this.resolveProperties()
       
        
    }


    resolveProperties(){

        //#Video representations
        let firstAdaptationSet= MI_XML_UTILS.getNodesByTagName("AdaptationSet",this.rawDashManifest)[0]//the one with videos
        let vidReps = MI_XML_UTILS.getNodesByTagName("Representation", firstAdaptationSet)
        this . VideoRepresentations = []
        vidReps.forEach(rawVidRep => {
            this.VideoRepresentations[this.VideoRepresentations.length]= new VideoRepresentation(rawVidRep)
            verbo("found videoRepresentation with qulity:"+ this.VideoRepresentations[this.VideoRepresentations.length-1].FBQualityLabel)
        });

        //#Audio representations
        let secondAdaptationSet= MI_XML_UTILS.getNodesByTagName("AdaptationSet",this.rawDashManifest)[1]//the  with audio
        let audReps = MI_XML_UTILS.getNodesByTagName("Representation", secondAdaptationSet)
        this . AudioRepresentations = []
        audReps.forEach(rawAudRep => {
            this.AudioRepresentations[this.AudioRepresentations.length]= new AudioRepresentation(rawAudRep)
            verbo("found audioRepresentation with mime:"+ this.AudioRepresentations[this.AudioRepresentations.length-1].mimeType)

        });

        //#duration
        this.Duration=dashManifestContentToDuration(this.rawDashManifest);
        verbo("done resolving properties")

    }

    rawDashManifest : string
    VideoRepresentations: VideoRepresentation[]
    AudioRepresentations:AudioRepresentation[]
    Duration: Date

} 




export namespace FBHDUtils{





export  const  USER_AGENT_FB = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.11 Safari/537.36";



 /**
  * ruturnes th full page as text
  * the fbhd way.. copied from fbhd c# code
  * @param postUrl  not checked against any ruls.. 
  */
export async function FetchVideoPage(postUrl){
      
    let req = new Request(postUrl);
    req.headers.append("user-agent", USER_AGENT_FB);
    req.headers.append("accept", "text/html");
    req.headers.append("sec-ch-ua-mobile", "?0");
    req.headers.append("accept-encoding", "");
    req.headers.append("sec-fetch-mode", "navigate");
    req.headers.append("accept-language", "en-US,en;q=0.9");
    req.headers.append("sec-fetch-dest", "document");

   let page_content = await fetch(req)
   let str =await page_content.text();
   return str
}


/**
 * rerurns undefined if no match
 * exception free
 * @param pageContent 
 * @returns 
 */
export function ExractDashManifestRawContentFromPage(pageContent:string):string{
    let re = new RegExp('dash_manifest"?:"(.*?[^\\\\])"')
  let res = re.exec(pageContent)
  if(!res) return undefined
  
  let rawDashManifest = res [1];
if(rawDashManifest==undefined || rawDashManifest.length<100) return undefined
               
 let fixed = rawDashManifest.replace(/\\"/g, '"').replace(/\\n/g, "\n")
 .replace(/\\x3C/g,"<")
 .replace(/\\u003C/g,"<")
 .replace(/\\\//g, "/")
 return fixed
}



/**
 * rerurns undefined if no match
 * todo: test
 * @param pageContent 
 * @returns 
 */
 export function ExractOgtitleFromPage(pageContent:string):string{
    let re = new RegExp("<meta property=\"og:title\" content=\"([^\"]*)\" */>")
    let m = pageContent.match(re);
    if(!m||!m[1])return undefined 
    return decodeUtf(m[1].replace(/&amp;/g, "&").replace(/&#039;/g,"'"));

 
}


/**
 * rerurns undefined if no match
 * todo: test
 * @param pageContent 
 * @returns 
 */
 export function ExractNametitleFromPage(pageContent:string):string{

    let re = new RegExp("\"name\":\"([^\"]*)\"")
    let m = pageContent.match(re);
    if(!m||!m[1])return undefined 
    return decodeUtf  (m[1].replace(/&amp;/g, "&"));

}

/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractDescriptiontitleFromPage(pageContent:string):string{
    let re = new RegExp("<meta name=\"description\" content=\"([^\"]*)\" ?/>")
    let m = pageContent.match(re);
    if(!m||!m[1])return undefined 
    return decodeUtf(m[1].replace(/&amp;/g, "&"));

}

/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractIsPrivateFromPage(pageContent:string):boolean{
    let re = new RegExp("You must log in to continue")
    return !!pageContent.match(re)

}

/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractIsSomethingWentWrongPageFromPage(pageContent:string):boolean{
    let re = new RegExp("Sorry, something went wrong.")
    return !!pageContent.match(re)

}


/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractThumbnailUrlFromPage(pageContent:string):string{
    let re = new RegExp("\"thumbnailUrl\":\"([^\"]*)\"")
    let res =  pageContent.match(re)
    return res?res [1].replace("\\", ""):undefined;

}


/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractThumbnailImageFromPage(pageContent:string):string{
    let re = new RegExp("\"thumbnailImage\":\\{\"uri\":\"(.*?)\"\\}")
    let res =  pageContent.match(re)
    
    return res? res[1].replace(/&amp;/g, "&").replace(/\\\//g, "&"): undefined;

}

/**
 * rerurns undefined if no match
 * todo: test 
 * @param pageContent 
 * @returns 
 */
 export function ExractOgImageFromPage(pageContent:string):string{
    let re = new RegExp("<meta property=\"og:image\" content=\"([^\"]*)\" */>")
    let res =  pageContent.match(re)
    return res? res[1].replace(/&amp;/g, "&"): undefined;

}


export function QaulityLabelToQualitNumber(qualityLbl:string):number{

    //720p
    if(qualityLbl.toLowerCase()=="source"){
        return 100000;//todo code smell, but this ensures that source suality is treated as highest quality
    }
    return Number.parseInt(qualityLbl.replace("p",""))
}


/**
 * smart determins what best video that fullfils the passed user settings
 * @param dashObj 
 * @param Settings 
 * @returns 
 */
export function AutoDetermineVideoRepresentation(dashObj:DashManifestResolved,Settings:AppSettings){

    verbo("smart picking from: ("+dashObj.VideoRepresentations.reduce<string>((prev,curr)=>""+prev+curr.FBQualityLabel+",",'')+")"
    )
    //if there is source returns it otherwise undef
    function Source(){
        return dashObj.VideoRepresentations.find((r)=>r.FBQualityLabel.toLowerCase()=="source")
    }

    function sourceIsMoreThan(numbr){
        let whatSourceIsMoreThan = 0 //the maximal values that we are sure source is more than
        let topWithoutSource = dashObj.VideoRepresentations.filter(rp=>rp.FBQualityLabel.toLowerCase()!="source"). concat([]).sort((rp1,rp2)=>rp1.QualityNumber-rp2.QualityNumber)[0]
        if(topWithoutSource==undefined)
        whatSourceIsMoreThan = 0
        else whatSourceIsMoreThan = topWithoutSource.QualityNumber

        verbo("source is more than "+numbr+" returned "+(numbr<= whatSourceIsMoreThan))
        return numbr<= whatSourceIsMoreThan
    }

    if(Settings.AutoFillSettings.PreferedVideoQuality=="Highest"){
        verbo("smart picking hishest")
        return dashObj.VideoRepresentations.sort((vr1,vr2)=>-vr1.QualityNumber+vr2.QualityNumber)[0]
    }
    else if(Settings.AutoFillSettings.PreferedVideoQuality=="Lowest"){
        verbo("smart picking lowest")

        return dashObj.VideoRepresentations.sort((vr1,vr2)=>vr1.QualityNumber-vr2.QualityNumber)[0]
    }
    else if(Settings.AutoFillSettings.PreferedVideoQuality=="420p"){//means 420 or less
        verbo("smart picking 420 or less")

        //theres 2 scenarios the first is like: 240p 360p source in which the source should be regarded as something less or eqauls 420p thus it should be picked
        //the second scenarions is like: 240p 360p , 640p,  source in which source should be filtered out because it obvously ecceeds the max allowed
        let filtered = dashObj.VideoRepresentations.filter((rp)=>rp.QualityNumber<420).sort((vr1,vr2)=>-vr1.QualityNumber+vr2.QualityNumber)
        let s = Source();
        verbo("source is "+s)
        if(s&&!sourceIsMoreThan(420)){
           return s
        }
        else
        {
            if(filtered[0])
            return(filtered[0])//the non source choice because source is higher than 420
            else{
                verbo("nothing seems to make a good match for 420p.. returning the first vid rep")
                return dashObj.VideoRepresentations[0]
            }
        }
        
    }
    else if(Settings.AutoFillSettings.PreferedVideoQuality=="720p"){//means 420 or less
        verbo("smart picking 720 or less")

        //theres 2 scenarios the first is like: 240p 360p source in which the source should be regarded as something less or eqauls 420p thus it should be picked
        //the second scenarions is like: 240p 360p , 640p,  source in which source should be filtered out because it obvously ecceeds the max allowed
        let filtered = dashObj.VideoRepresentations.filter((rp)=>rp.QualityNumber<720).sort((vr1,vr2)=>-vr1.QualityNumber+vr2.QualityNumber)
        let s = Source();
        if(s&&!sourceIsMoreThan(720)){
           return s
        }
        else
        {
            if(filtered[0])
            return(filtered[0])//the non source choice because source is higher than 420
            else{
                verbo("nothing seems to make a good match for 720p.. returning the first vid rep")
                return dashObj.VideoRepresentations[0]
            }
        }
        
    }
    
}


    
}
export class VideoRepresentation{

    /**
     *  pass the full content of the representation node
     */
    constructor(representationNode:string) {
    
        this.codecs= MI_XML_UTILS.getAttribValue("codecs",representationNode)
        this.mimeType= MI_XML_UTILS.getAttribValue("mimeType",representationNode)
        this.width= MI_XML_UTILS.getAttribValue("width",representationNode)
        this.height= MI_XML_UTILS.getAttribValue("height",representationNode)
        this.frameRate= MI_XML_UTILS.getAttribValue("frameRate",representationNode)
        this.FBQualityLabel= MI_XML_UTILS.getAttribValue("FBQualityLabel",representationNode)
        this.BaseUrl= MI_XML_UTILS.getNodeInnerText("BaseURL",representationNode).replace(/&amp;/g, "&")
        this.QualityNumber = FBHDUtils.QaulityLabelToQualitNumber(this.FBQualityLabel)

    }
    codecs :string
    mimeType  :string
    width  :string
    height  :string
    frameRate  :string
    FBQualityLabel  :string
    BaseUrl  :string
    QualityNumber:number //added by me to make filtering easy, source will be 1000000

}


export class AudioRepresentation{
    /**
     *pass the full content of the representation node
     */
    constructor(representationNode:string) {
        this.codecs= MI_XML_UTILS.getAttribValue("codecs",representationNode)
        this.mimeType= MI_XML_UTILS.getAttribValue("mimeType",representationNode)
        this.audioSamplingRate= MI_XML_UTILS.getAttribValue("audioSamplingRate",representationNode)
        this.BaseUrl= MI_XML_UTILS.getNodeInnerText("BaseURL",representationNode).replace(/&amp;/g, "&")
    }
    codecs :string
    mimeType :string
    audioSamplingRate:string 
    BaseUrl :string

}


/**
 * takes care of pretty much everything.. a great deal of text fixing
 * @param raw 
 * @returns 
 */
 export function  decodeUtf( raw:string):string
 {
     let output = "";
     //raw = "u\\627u\\627&#x647;&#x643;&#x630;&#x627; &#x62a;&#x628;&#x62f;&#x648; &#x627;&#x644;&#x623;&#x631;&#x636; &#x645;&#x646; &#x645;&#x62d;&#x637;&#x629; &#x627;&#x644;&#x641;&#x636;&#x627;&#x621; &#x627;&#x644;&#x62f;&#x648;&#x644;&#x64a;&#x629;";
     output = raw.replace(/&#x([\dabcdef]{3,5});/g, (Match, m) =>
         {
             let decoded_char = "";
             try{decoded_char= String.fromCodePoint(Number.parseInt("0x"+m))}
             catch (Exception){}
             return decoded_char;
         });
     output = output.replace(/&#([\d]{3,5});/g, (Match, m) =>
     {
         let decoded_char = "";
         try{decoded_char= String.fromCharCode(Number.parseInt(m))}
         catch (Exception){}
         return decoded_char;
     });
     output = output.replace(/\\u([\dabcdef]{3,5})/g, (Match, m) =>
     {
         let decoded_char = "";
         try{decoded_char= String.fromCharCode(Number.parseInt("0x"+m))}
         catch (Exception){}
         return decoded_char;
     });
     return output;
 }






    //02rev i copied this code as from the fbhd project is and stranlated  it to js
   function FBDurationToTimeSpan( durationStr:string):Date
    {
        let H = /(\d*?)H/.exec(durationStr);
        let M =/(\d*?)M/.exec(durationStr);
        let S = /(\d*\.\d*)S/.exec(durationStr);
        let hours = H?.length ?  Number.parseFloat((H[1].toString()))  : 0;
        let minutes = M?.length ?  Number.parseFloat((M[1].toString()))  : 0;
        let seconds = S.length ?  Number.parseFloat((S[1].toString()))  : 0;
        //  fixed fractional digits problem using rounding
        let millis = (Math.round(  1000.0*(seconds - Math.trunc(seconds))));
        var outp = new Date(0,0,0, hours, minutes, Math.trunc(seconds), millis);
        verbo("done parsing duration")
        return outp;
    }

function dashManifestContentToDuration(dm:string):Date{
 /*
   <Period duration="PT0H57M59.417S">
  */
   let test = '<Period duration="PT0H57M59.417S">'//turned ot there could be an id attr siting in between Period and duration=... fuck
   //so let's use our awesom hand made XML tools instead
   let periodNode= MI_XML_UTILS.getNodesByTagName("Period",dm)[0]
   if(!periodNode) {verbo("couldnt find period node"); return undefined}
   let durationAttrValue = MI_XML_UTILS.getAttribValue("duration",periodNode)
   let m =/<Period duration="(.*?)"/.exec(dm);
   return FBDurationToTimeSpan(durationAttrValue) 
}


export class MI_XML_UTILS{
    //i have to meke this crap from scratch fuck

   static getAttribValue(attrName:string,nodeContent):string{
    //the content has to be valid full xml node :  <myNode myAttr1="att1" ></myNode>
   let tgh_re=new RegExp("<[^>]*?>")
   if(!tgh_re.test(nodeContent)) return undefined
   
   let tagHead = tgh_re.exec(nodeContent)[0].toString()
   let re = new RegExp("<[^>]* "+attrName+'="(.*?)"')
   if(!re.test(tagHead)) return undefined
   return re.exec(tagHead)[1].toString()
    }


    //02rev mi.. fucked 3 days of work.. WE NEED TO GE THIS DONE 
    static getNodesByTagName(tagName:string,randomSTR:string):string[]{
        //the content should contain a full xml node :  <myNode myAttr1="att1" ></myNode>
        verbo("getNodesByTagName against "+tagName+":  ")

       let tg_re=new RegExp("<"+tagName+"[^]*?</"+tagName+">",'gm')
      let outp=[] 
      let r : RegExpExecArray 
      let i=0
      while(r=tg_re.exec(randomSTR)) {

           outp[outp.length]= r[0]
           i++
       } 
       verbo("total found "+tagName+": = "+i)
      return outp
    }

    static getNodeInnerText(tagName:string,nodeContent:string):string{
        verbo("getNodeInnerText was asked to get inner for tag:"+tagName+" ")
       // verbo(nodeContent)

        //returns the inner content from a full xml node content:  <myNode myAttr1="att1" ></myNode>
        //the node can be anywhere inside the nodeContent. the func wll take the first one that has a opening and closing tags
       let tg_re=new RegExp("<"+tagName+"[^>]*?>([^]*?)</"+tagName+">",'m')
      let outp=[] 
      let r : RegExpExecArray 
     r=tg_re.exec(nodeContent)
     //verbo(r)

     if(!r)return undefined
      return r[1].toString()
    }



     


}