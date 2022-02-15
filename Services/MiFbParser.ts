const DEV_EXPO = false // disables everything that expo cannot handle: use it to conditionally fake things like rnfs, parsing, converting
import { DOMParser } from 'react-native-html-parser';
import { IPostInfo } from './ghost-yvdl';




let listOfDummyThumbnails=["https://scontent.fcmn1-1.fna.fbcdn.net:443/v/t15.13418-10/p206x206/81911807_509065230021663_366054595144712192_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=ad6a45&_nc_ohc=MtHU2WzZhoEAX8nDWwx&_nc_ht=scontent.fcmn1-1.fna&oh=00_AT-9c_A6zwaVwbbSBbkTtHrzxFjk0AGAjh808HRi83sqkw&oe=61FD60CD",
"https://scontent.fcmn1-1.fna.fbcdn.net:443/v/t15.5256-10/p206x206/75625182_200496794558629_3009667722440081408_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=ad6a45&_nc_ohc=miBesGRNhpIAX8VcyxA&_nc_ht=scontent.fcmn1-1.fna&oh=00_AT8YzjMX1JgvUAjkVewPSsSjbtccg3uVB97T5D52Q2MATQ&oe=61FE8874",
"https://scontent.fcmn1-1.fna.fbcdn.net:443/v/t15.5256-10/p206x206/271647453_509830337013588_3899046514202267330_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=ad6a45&_nc_ohc=yYF-rrz3c44AX-laHA4&_nc_ht=scontent.fcmn1-1.fna&oh=00_AT9jZRHpjIShZeq8F48xbIP2d2PU72yzlWaNiruAwmc1rg&oe=61FCAE19"
]



/**
 * the perfect parser based on react-native-html-parser 
 * @param data 
 * @param options if fetch_video_size is false (default) the videoSize property will be undefined and no (HEAD methode) will take place 
 */
export default function miFbParser(data:string, options:{fetch_video_size:boolean}={fetch_video_size:false}):Promise<IPostInfo> {
    return new Promise(async (resolve,reject)=>{

        let output = { } as IPostInfo    

         let _title:string = null // not used
         let _vid_url:string = null
         let _thumb_url:string = null
         let _og_title:string = null
         let _description:string = null
         let _vid_size : number
        

    
         if(!data){
          reject(new Error("y_fb_parsing: rejected: null data"))
          return
        }

        var doc
        var parser 
       

        if(DEV_EXPO){
           let post_info={
                "ThumbnailUrl": listOfDummyThumbnails[Math.random()>0.5?0:1],
                "VideoUrl": "https://video.fcmn1-1.fna.fbcdn.net/v/t42.9040-2/116482009_311562333376649_8881787564712233737_n.mp4?_nc_cat=110&ccb=2&_nc_sid=985c63&efg=eyJybHIiOjQ2OSwicmxhIjo5MzIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=ItkKaGqFdYEAX8CDTaJ&rl=469&vabr=261&_nc_ht=video.fcmn1-1.fna&oh=9413d9daabe12b9df16d016c770deee7&oe=5FE40570",
                "Title": "Ikson - Breathe (Deep House) / Music Spectrum",
                "VideoSize": 33000000
               }
             resolve(post_info)
            output.Title = "dev_expo mode fake title"
            output.ThumbnailUrl = ""
            output.VideoSize = 33000000
            output.VideoUrl = ""
            resolve(output)
            return
        }
        
        parser = new DOMParser({});
        doc = parser.parseFromString(data, 'text/html');

         let description_meta = find_tag_with_attribs(doc,"meta",[{name: "name",value:"description"}])
         let og_image_meta = find_tag_with_attribs(doc,"meta",[{name: "property",value:"og:image"}])
         let og_title_meta = find_tag_with_attribs(doc,"meta",[{name: "property",value:"og:title"}])
         let og_video_meta = find_tag_with_attribs(doc,"meta",[{name: "property",value:"og:video"}])

             _description =  get_attrib_value(description_meta,"content")
             _og_title =  get_attrib_value(og_title_meta,"content")
             _thumb_url =  get_attrib_value(og_image_meta,"content")
             _vid_url =  get_attrib_value(og_video_meta,"content")
             
            

             // video size (depends on options)
               let axioshead
               _vid_size = 88888888
               if(options.fetch_video_size){
                   //@ts-ignore
                axioshead = await fetch({url: _vid_url, method:"HEAD"})
                _vid_size = axioshead.headers["content-length"] || 88888
               }

              

             //draganov // broken //02rev i dont remember writing that commnt but i do  remember that it was a tough period..  eventually time kills everything 

             if(!(_thumb_url&&_vid_url)){
                reject (new Error("y_miracles_parser: failed to find the required elements"))

             }


             output.Title = _description|| _og_title 
             output.ThumbnailUrl = _thumb_url
             output.VideoSize = _vid_size
             output.VideoUrl = _vid_url
             


             console.log(output)

             resolve(output)
         

    })
    
}






       
 /**
  * the parent obj MUST: -be an object  - have a .lenght prop
  * 
  * this returns the first child that fullfils predicate, 
  * 
  * NOTE: children are accessed using [index] exmp: parent[0]
  * 
  * @param parrent_obj 
  * @param predicate 
  */
 function y_find_child(parrent_obj, predicate:(any)=>boolean) {
    if(!parrent_obj.length){
       console.log("parent missing lenght")

        return undefined
    }
   for (let i = 0; i < parrent_obj.length; i++) {
       const element = parrent_obj[i];
      // console.log(element)
       if (predicate(element)){
           return element
       }
   }
   console.log("no match")

   return undefined
}





         /**
          * 
          * if none existent attrib returns undefined
          * 
          * if unvalid element returns undefined
          * @param element 
          * @param attrib_name 
          */
         function get_attrib_value(element:any, attrib_name:string ){

            if(!(element && element.attributes)){
                return undefined
            }
           let maybe_attr = y_find_child (element.attributes, (attr)=>{return attr.name === attrib_name})
           if(maybe_attr){
               return maybe_attr.value
           }
           else {return undefined}
        }












        /////// utils //////////  thank me later , miracles 22-dec-2020

/**
 * use get_attrib_value if you want the value, not just a boolean
 * 
 * tests weather the node has the specified attribute [and it has a specific value]
 * 
 * if required_attrib_value is suplied (not falsy) it also tests the attribute value
 * 
 * @param required_attrib 
 * @param required_attrib_value 
 */
function has_attr(element, required_attrib, required_attrib_value):boolean{
    return y_find_child(element.attributes, (attr)=>{return (attr.name ===required_attrib )&&( (!required_attrib_value) ||(attr.value ===required_attrib_value )) })
 }

        
         /**
          * 
          * find in a valid doc the very element with: the right tag name, and has the right attribs, tha [optionnally] have the right values
          * 
          * you specify that an attrib value shoul be checked by passing a non null string in the value key of your required_attrib instance
          * 
          * returns the first matched element, or undef when: unvalid docum, or nothing matched
          * @param docum 
          * @param tag 
          * @param required_attribs 
          */
         function find_tag_with_attribs( docum:any, tag:String, required_attribs:{name:string,value:string}[]){
            let tags = docum.getElementsByTagName(tag) as any[]
            if(!tag ){return undefined }
            let the_very_tag = y_find_child(tags, (a_tag)=>{
                for (let i = 0; i < required_attribs.length; i++) { // looping over required_attribs
                  const required_attrib = required_attribs[i];
                  let has_one = has_attr(a_tag,required_attribs[i].name, required_attrib.value)
                  if (!has_one) {return false}
                }
                return true // thats my element     
            } )

           return the_very_tag
            }

        