//not all trypes here were created on 02rev .. 

//only simple types are declared here in order to avoide dependencies
//02rev
export type AppSettings = {
    General?: {EnableAutoFill:boolean};
    AutoFillSettings:{PreferedVideoQuality:IPreferedQualty,EnableThumbnail:boolean,PreferedNameSource:IPreferedNameSource,OutputLocation:IOutputLocation}
    Legacy?: {UseLegacyMode:boolean};
    Advanced?: {DownloadStreamsFirst:boolean}
}


export type IOutputLocation  ="Downloads"|"YVDLFolder" 
export type IPreferedQualty  ="720p"|"420p"|"Highest" |"Lowest"
export type IPreferedNameSource  ="og-title"|"description"|"title" 


export interface IPostInfo {
    ThumbnailUrl: string
    Title:string
    VideoSize: number
    VideoUrl:string
}



export type ITitles={
    ogTitle:string
    nameTitle:string
    descriptionTitle:string
}
export type IImages={
    ogImage:string
    thumbnailUrl:string
    thumbnailImage:string
}

export interface IConversionProg{
    time:number,
    size:number,
}