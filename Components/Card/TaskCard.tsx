

const DEV_EXPO = false



import React, { RefObject, Component, createRef } from 'react'
import { ToastAndroid, StyleSheet, Text, View, TouchableHighlight, Platform,StatusBar, Clipboard,TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle, TextStyleAndroid, ImageSourcePropType, ProgressBarAndroid, Picker, Group, findNodeHandle, Animated, Dimensions, Easing } from 'react-native';

//import Notify from "./notify"
import DownloadingProgressInfo from './DownloadingProgressInfo'

import ProgressBar from './ProgressBar'

import * as fn from 'react-native-fs'
//import  fn from './fnAltDeclarations' //todo: develop mi flow expo to automate commenting and uncommenting this


import Getter, { Stage } from './Getter'
import SvgMi, { st } from '../Common/SvgMi';
import { YVDL_Task,  yvdl_task_status, IDownloadProg, yvdl_task_format, IPostInfo_v02, StateObj } from '../../Services/ghost-yvdl';


import expad from '../Common/MiSwipeable'
import MiSwipeable from '../Common/MiSwipeable'
import { ButtonPretty } from '../Common/ButtonPretty';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { verbo } from '../../Services/GeneralUtils';
import CheckBox10Native from '../Common/CheckBox10Native';
import { Statistics } from 'react-native-ffmpeg';
//import  { LogLevel, RNFFmpeg, RNFFmpegConfig, Statistics,CompletedExecution, Execution, } from './rnffmpegAltDec'

import { Types } from 'react-native-document-picker';

import { IPostInfo , AppSettings, IConversionProg} from '../../Services/rev02types';


// depreceted
//todo: a big bug: when the screen, for some reason, re renders, the componentDidMount event gets fired again which lead to another core.go for the same card 

//02rev (by that i mean the 31-jan2022 and days that follow): why does mi say deprecated here?? i'm confused
//02rev so this module will be prepared for the changes that will happpen. adding a prop (legacyMode) that 
//distinguish the new behavior from the old, with that said,, i WILL tweak the old ui a little bit as my 
//like the ugly "done" flag.. just tryinna make t more consistent and good looking
//this code is hard to look at i cant beleive this app lived with and entire node server app .. not even sure what to delete

export interface ISavedTask { // SOT, officially used in files, by api 21-nov

    id: number
    uid: string
    status:  yvdl_task_status  // zero 0 | downloading 1| converting 2| done 3 | failed | delivered // usefull cuz delivered ones would stack at the bottom leeting the undelivered ones rise above, 
    download_prog:   IDownloadProg
    converting_prog:{written:number,time:number}
    post_info :  IPostInfo
    mp3 : boolean
    outputmp4: string,
    outputmp3: string

}







//#region  styles
const paneldark = "#222222"
const backgrnddark = "#121212"
const bluecyan = "#00ccff"


const style_TaskCard : StyleProp<ViewStyle> = {
    elevation:4,
    alignSelf: "center",
   // box-shadow: 0 0 7 rgba(255, 255, 255, 0const style_507),
    width:  Dimensions.get("window").width-10,
    maxWidth: 600,
    backgroundColor: "#222222",
    borderColor: paneldark,
    borderWidth:1,
    height: 90,
    maxHeight:90,
     flex:1,
     flexDirection:"row",
    alignContent: "center",
    justifyContent: "flex-start",
   // marginBottom: 10,
   // willChange: "opacity",
   

    
   // background-color: peru,
}


    const style_taskcardThumbnail :StyleProp<ViewStyle> = {
        
        //background-size: cover,
        flex:1,
       
       // backgroundColor: backgrnddark,
        backgroundColor:"#3c3c3c",
        width: "25%",
        minWidth: "25%",
        height: "100%",
        padding: 0 ,

       // border-right: solid 0.5 grey,
        alignContent: "center",
        justifyContent: "center",
    }
       const iimg = {
            width: "100%",
            height: "auto",
            alignSelf: "center",

        }

        const style_loader_gif = {
            alignSelf: "center",
            width: 20,
            height: 20,
            //.iconWhite2,
        }
    

    const style_taskcard_content:StyleProp<ViewStyle> = {
       // background-color: palegreen,
        minWidth: "75%",
        width: "75%",
        maxWidth:"75%",
       flex:1,
       flexDirection:"column",
       alignSelf:"stretch",
      // backgroundColor:"red",

       paddingBottom:3,
       

       // padding: 0 ,

    }
        const style_taskcard_head :StyleProp<ViewStyle> = {
            marginTop: 0,
            marginLeft: 4,
            marginRight: 2,
            maxHeight:18,
             flex:1,
             flexDirection:"row",
            alignContent: "center",
            justifyContent: "space-between",
            alignItems:"center",
           // backgroundColor:"red"

        }
            const style_failed_header_title :StyleProp<TextStyle>= {
                color: "firebrick",
                fontSize: 11,
                fontFamily:"sans-serif-light",
            } 
            const style_dummy_title :StyleProp<TextStyle>= {
                marginRight:8,
                color: "#999",
                fontSize: 11,
                fontFamily:"sans-serif-light",
            } 
            const style_resolving_header_title = {
                fontSize: 13,

                color: "white",
            }
            const style_done_tag :StyleProp<ViewStyle> = {
                flex:1,
                flexDirection:"row",
                alignContent: "center",
                 alignItems: "center",
                justifyContent: "flex-start",
            }
                const style_done_header_title  :StyleProp<TextStyle>= {
                    fontSize: 10,
                        color: "white",
                        fontWeight:"200",
                        fontFamily:"sans-serif-light",
    
                }
                const style_done_header_title__img = {
                    marginLeft: 2,
                    marginright: 2,
                    width: 9, height: 9,
                    color: bluecyan,
                    //.Icon-green-filter(),
                }

            
            
            const style_x_button :StyleProp<ViewStyle> = {
                 width: 10,
                 marginRight: 4,
                 //.iconWhite2(),
            
        }


        const style_resolving_loader = {
            placeSelf: "center",
             flex:1,
            height: "70%",
            alignContent: "center",
            justifyContent: "center",
            placeItems: "center",
            

            img : {
                width: 16,
                height: 16,
                //.iconWhite2(),
            }
        }
        const style_fileInfo :StyleProp<ViewStyle> = {
            
            maxWidth: "90%",
          //  background-color: orchid,
            marginTop: 1,
            marginLeft: 6,
            flex:1,
            flexDirection: "column",
        }
            const style_fileName :StyleProp<TextStyle> = {
                
                maxWidth: "100%",
                //display: "block",
                //white-space: nowrap,
                color:"white",
                overflow: "hidden",
                fontFamily:"Roboto",
                fontSize: 11,
               // textOverflow: "ellipsis",
                

            }
            const style_fileSize = {
                
                   fontSize: 9,
                   color: bluecyan,
                   
            }

            const pretty_preset  = {
    spanStyle:{fontSize:11,color:"#eee"},
   
     iconChild :true,
    style:{flexDirection:"row-reverse",elevation:2,borderWidth:0.5,borderColor:"#444", marginRight:-2,} ,
    Wraper_rest_color:"#242424" ,
    wraper_pressed_color:"#444444"
    

}


        
    //#endregion styles



            type TaskCard_Props = {
               
                core:YVDL_Task
                id:number,
                uid:string,
                status:   yvdl_task_status, // pending | resolving post | downloading | converting | done | failed:(for evry status)
                download_prog:  IDownloadProg,
                converting_prog:IConversionProg,
                post_info : IPostInfo,
                post_info_v02 : IPostInfo_v02,
                mp3 : boolean,
                outputmp4: string,
                outputmp3: string,
                failurReason: string,
                socket: any
                deleteHandler(id:number):void,
                wraperStyle?:StyleProp<ViewStyle>,
                parentnode: RefObject<FlatList>,
                slidInDelay?:number,
                dummy?:boolean
                
            
                
            
            }
            
            export type TaskCard_state = {
                core:YVDL_Task
                id:number,
                uid:string,
                status:   yvdl_task_status, // pending | resolving post | downloading | converting | done | failed:(for evry status)
                download_prog:  IDownloadProg,
                converting_prog:IConversionProg,
                post_info : IPostInfo,
                post_info_v02 : IPostInfo_v02,
                mp3 : boolean,
                outputmp4: string,
                outputmp3: string,
                failurReason: string,
                thumbnail_available:false |string
                fadeInOpacity: Animated.Value,
                shrinkValue : Animated.Value,
                slideInValue : Animated.Value,
                isMenuOpen:boolean //controls the modal with more options 02rev
                isDeleteActionPromptOpen:boolean //since the swiping gesture is problematic the delete button will be made to perform both: deleting the file physically and/or removing the task from the list
                physicallyDeleteFile:boolean
            }
            
            





  


export default class TaskCard extends Component<TaskCard_Props,TaskCard_state>   { // this should handle its own shit, dealing with the socket object directely

    state:TaskCard_state
    props:TaskCard_Props

   // setState:(state_mityping:unreq<TaskCard_state>|((old:TaskCard_state)=>unreq<TaskCard_state>))=>void 
    
  //this feels clumsy.. almost typing the library myself // alright copied the react @type from the old website version.. but react-native types still missing
    constructor(props: Readonly<TaskCard_Props>){
     super(props)
     this.state= {

        // todo: all these props should be wraped up in a single "core" of class :YVDL_tasl

         core: props.core,
         fadeInOpacity : new Animated.Value(1),// used for sliding too
         slideInValue : new Animated.Value(0),// used for sliding too
         shrinkValue : new Animated.Value(1),



         id:props.id || -1,
         uid:props.uid ||'undef-uid',
         status:  this.props.core.status|| "zero",  // pending | resolving post | downloading | converting | done | failed:(for evry status)
         download_prog:   props.download_prog || {d:0,t:123450},
         converting_prog: {time:0,size:0},
         post_info : props.post_info || {Title:"video title.mp4",VideoSize:35124542,VideoUrl:"",ThumbnailUrl:"https://scontent.frba1-1.fna.fbcdn.net/v/t15.5256-10/p206x206/75522592_2687397354829673_5488251941181980672_n.jpg?_nc_cat=111&ccb=2&_nc_sid=ad6a45&_nc_ohc=PGHYv1qXAd4AX9Bv138&_nc_ht=scontent.frba1-1.fna&oh=f373b61aec8248928b6c23e3c135bf10&oe=6007C37F"},
         post_info_v02 : props.post_info_v02 ,
         mp3 : this.props.mp3 || false,
         outputmp4: this.props.outputmp4 || "url/to/output/mp4",
         outputmp3: this.props.outputmp3 || "url/to/output/mp3",
         failurReason: 'string',
         thumbnail_available: false,
         isMenuOpen:false,
         isDeleteActionPromptOpen:false,
         physicallyDeleteFile:false
  
 

     }

   
     

     this.taskcardref= createRef()
     this.sizeFormatter=this.sizeFormatter.bind(this)
     this.Update_task = this.Update_task.bind(this)
     this.onDeleteClick=this.onDeleteClick.bind(this)
     this.deleteMe=this.deleteMe.bind(this)
     this.handleOnCancelDownloading=this.handleOnCancelDownloading.bind(this)//02rev (and below)
     this.handleLongPressed=this.handleLongPressed.bind(this)
     this.handleCopyLink=this.handleCopyLink.bind(this)
     this.closeMenu=this.closeMenu.bind(this)
     this.openMenu=this.openMenu.bind(this)
     this.openDeleteActionPrompt=this.openDeleteActionPrompt.bind(this)

     this.handle_core_cb_conversionProgress=this.handle_core_cb_conversionProgress.bind(this)
     this.handle_core_cb_downloadProgress=this.handle_core_cb_downloadProgress.bind(this)
     this.handle_core_cb_failed=this.handle_core_cb_failed.bind(this)
     this.handle_core_cb_statusChange=this.handle_core_cb_statusChange.bind(this)
     this.handle_core_cb_videoSaved=this.handle_core_cb_videoSaved.bind(this)

    }

    
   

    taskcardref: RefObject<View>
    
    


    


    Update_task(new_taskstate:TaskCard_state){
        this.setState({...new_taskstate})
        
        
    }

    expande(){

        this.state.fadeInOpacity .setValue(0.5)
        
        
        Animated.timing(this.state.shrinkValue,{toValue:1,duration:3000,useNativeDriver:true}).start(()=>{
            this.state.fadeInOpacity.setValue(1)
        })
    }

    handle_core_cb_statusChange(str:string,stateobj:StateObj){
        verbo("handle_core_cb_statusChange : "+stateobj.status+" "+stateobj.id)
        this.setState({status:stateobj.status})
    }
    handle_core_cb_downloadProgress(str:string,prog:IDownloadProg){
        this.setState({download_prog:prog})
    }
    handle_core_cb_conversionProgress(str:string,id:number,stats:Statistics){
        this.setState({converting_prog:{time:stats.time,size:stats.size}})
        
    }
    handle_core_cb_videoSaved(){
        //does nothing
    }
    handle_core_cb_failed(){
        
    }
   async componentDidMount(){
   
     //alert(this.state.core.status)



     //02rev wait why are we assignign these callbacks hadlers in the componentDidMount?
     //i'll try to shift the to the ctro.. and see what happens
     //so messy we really need to do stuff the right event based way

    this.state.core.cb_downloadProgress = this.handle_core_cb_downloadProgress
    this.state.core.cb_statusChange = this.handle_core_cb_statusChange
    this.state.core.cb_videoSaved= this.handle_core_cb_videoSaved
    this.state.core.cb_conversionProgress=this.handle_core_cb_conversionProgress
    this.state.core.cb_failed=this.handle_core_cb_failed

    if(this.state.status!="pending"){
        //02rev only pendng will perform the slide and call go 

        Animated.timing(this.state.slideInValue,{toValue:1.0,duration:0,
            useNativeDriver:false,easing:Easing.ease}).start()
    
        return
    }

    //alert(this.state.core.status)

         this.slideIn()
        
    this.props.parentnode.current.scrollToOffset({animated:true,offset:14000})

    this.state.core.Go()

    }

    sizeFormatter(size:number){
      return size>1000000000? (Math.ceil( size/100000000)/10).toString()+" Gb": 
       size>1000000? (Math.ceil( size/100000)/10).toString()+" Mb": 
      size >1000? (Math.ceil( size/100)/10).toString()+"Kb": size + " b"
  }


  twoDigits(num:number):string{
      return num>=10?num.toString():"0"+num.toString()
  }
  //02rev
  durationFormatter(dureAsDate:Date):string{
      let H = dureAsDate.getHours();
      let M =  dureAsDate.getMinutes();
      let S = dureAsDate.getSeconds();
    return (H? (H+":"):"") +
    (H? (this.twoDigits(M)):M)+":"+
    this.twoDigits(S)+""
   
}

  slideIn(){
    Animated.timing(this.state.slideInValue,{toValue:1.0,duration:200,
        useNativeDriver:true,easing:Easing.ease,delay:this.props.slidInDelay}).start()

  }

  slideOut(ms){
      return new Promise(resolve=>{

        Animated.timing(this.state.fadeInOpacity,{toValue:0,duration:ms,
            useNativeDriver:true,easing:Easing.exp}).start(resolve)
      })

    

  }
  onDeleteClick(){
      this.slideOut(400)
  }


  handleOnCancelDownloading(){
      verbo("handleOnCancelDownloading");
      (this.state.core as YVDL_Task).tryCancelingDownload();

  }


  openMenu(){
    this.setState({isMenuOpen:true}as TaskCard_state)
  }
  openDeleteActionPrompt(){
    this.setState({isDeleteActionPromptOpen:true}as TaskCard_state)
  }
  handleLongPressed(){
      this.openMenu()
  }
  handleCopyLink(){
    Clipboard.setString(this.props.core.my_url)
    ToastAndroid.show("Link copied",1000)

  }
  closeMenu(){
      this.setState({isMenuOpen:false})
      return true
  }

  /**
   * this comes from the delete button after the user prompt and determining the deletePhyscally check box
   * @param physicallyDeelete 
   */
  handleDelete(physicallyDeelete:boolean){
    if(DEV_EXPO){
        this.deleteMe(true)
        ToastAndroid.show("dev expo fake delete with file  "+(physicallyDeelete?"deleted":"kept")+"\n"+ this.props.core.outputFileName,3000)
       
 
    }
    else{
        let fullPth= this.props.core.fullOutputFileName
        verbo("trying to delete :"+fullPth)
        if(!physicallyDeelete){
            //only remove card
            this.deleteMe(true)
            return
        }
        if(this.safeToDelete(fullPth)){
            
            fn.unlink(fullPth).then(()=>{
                verbo("unlinked")
                ToastAndroid.show("deleted  file: "+fullPth,3000)
                this.deleteMe()
            })
            .catch(()=>{
                verbo("failed to unlink")
                alert("couldn't delete:" + fullPth)
                this.deleteMe()
            })

        }
        else{
            alert("not safe to delete!")
        }
       
    }
    
   



  }

/**
 * used with deleting (unlink) methods for extra caution not to delete some sort of folder by mistake (is that happens to be allowed by the underlying layers and os)
 * this is tmporary and will be droped when everything is stable 
 * 
 * @param filename 
 * @returns true if the passed filename is a ,on falsy string and ends with .mp4 or .mp3 (case safe)
 */
  safeToDelete(filename:string):boolean{

    return (!!filename)&&(filename.toLowerCase().endsWith(".mp3")||filename.toLowerCase().endsWith(".mp4"))
  }

  deleteMe(withoutAnime=false){ // deletes this component using the parent's deleteHandler, takes care of the animation
     /*  $(this.taskcardref.current).fadeOut("fast",null,()=>{ */
 

        if(withoutAnime){
            this.props.deleteHandler(this.props.core.my_id);
        }
        else{
            
            this.slideOut(500).then(()=>{
                this.props.deleteHandler(this.props.core.my_id);
            })
        }
       
      
     

  }

 
thumbRef: RefObject<Image>



    render(){

             let status = this.state.status;
            let downloading =( status=="downloading")||( status=="pending"),
             converting = status=="converting"  , 
             
              done = status=="done" ,
              failed = status=='failed',
              legacy=this.props.core.isLegacy as boolean,
              taskFormat=this.props.core.taskFormat as yvdl_task_format
              let resolved = true

             
             
              let imageBoxUri = legacy?this.state.post_info.ThumbnailUrl : (this.state.core as YVDL_Task).chosenThumbnailUrl

        let VisibleTitle = legacy? this.state.post_info.Title : (this.state.core as YVDL_Task).chosenTitle
       // verbo("visibleTiel: "+VisibleTitle)

        let VisibleSize =  legacy? this.sizeFormatter(this.state.post_info.VideoSize): this.durationFormatter ((this.state.post_info_v02 as IPostInfo_v02).dashManifestObject.Duration)
        let VisibleSizeKey = legacy?'Size:':"Duration:" 



        var  thumb_src =  {uri:imageBoxUri} /*  this.state.thumbnail_available
        ? require("/storage/emulated/0/yvdl/img.jpg")
        :  require ('./assets/place-holder-thumb.jpg');  */

        

      return(


        <MiSwipeable  onSwipe={()=>{this.deleteMe(true)}} onLongPress={this.handleLongPressed} child_width={Dimensions.get("screen").width} style= {{width:Dimensions.get("screen").width}}>
 
 <Modal visible={this.state.isMenuOpen} animationType="fade" transparent={ true } onRequestClose={ () => { this.setState({isMenuOpen:false}) } } >
      <Pressable onPressIn={(()=>this.setState({isMenuOpen:false})).bind(this)}  style={{justifyItems:"flex-end", backgroundColor:"#00000098",
    flexDirection:"column", alignContent:"center" ,  justifyContent:"center",  height:"100%" }} >
      <View style={{ borderRadius:8, alignSelf:"center" ,  //todo try removing this justifySelf property and see if t's safe the current typings suggest that ths is not a thing but i remembr reading about it somewhere 
      paddingVertical:6,
      flexDirection:"column", alignItems:"stretch" ,  justifyContent:"center",
         width:"80%", backgroundColor:paneldark  }} >
            
            <TouchableHighlight underlayColor= {"#2c2c2c"}   style={{paddingVertical:4}}
            onPress={() => { alert("dev!"); }}>
         <Text style={{color:"white",alignSelf:"center"}} >Hide</Text>
     </TouchableHighlight>
     <TouchableHighlight  underlayColor= {"#2c2c2c"} style={{paddingVertical:4}}
     onPress={() => { alert("dev!"); }}>
         <Text style={{color:"white",alignSelf:"center"}} >Rename output</Text>
     </TouchableHighlight>
     <TouchableHighlight  underlayColor= {"#2c2c2c"} style={{paddingVertical:4}}
     onPress={(()=> this.closeMenu()&&this.handleCopyLink()).bind(this)}>
         <Text style={{color:"white",alignSelf:"center"}} >Copy link</Text>
     </TouchableHighlight>
     <TouchableHighlight  underlayColor= {"#2c2c2c"} style={{paddingVertical:4}}
     onPress={() => { alert("dev!"); }}>
         <Text style={{color:"red",alignSelf:"center"}} >Delete files</Text>
     </TouchableHighlight>
</View>
      </Pressable>

    </Modal>

    <Modal key="delete actio prompt" visible={this.state.isDeleteActionPromptOpen} animationType="fade" transparent={ true } onRequestClose={ () => { this.setState({isDeleteActionPromptOpen:false}) } } >
      <Pressable  onPressIn={(()=>this.setState({isDeleteActionPromptOpen:false})).bind(this)}  style={{justifyItems:"flex-end", backgroundColor:"#00000098",
    flexDirection:"column", alignContent:"center" ,  justifyContent:"center",  height:"100%" }} >
      <Pressable  
      onPress={()=>{}}
      style={{ borderRadius:8, alignSelf:"center" , justifySelf:"center",
      paddingVertical:6,
      flexDirection:"column", alignItems:"stretch" ,  justifyContent:"space-around",
         width:"80%", backgroundColor:paneldark , minHeight:110 }} >
            
        <Pressable android_ripple={{color:"#444",radius:500}} onPress={(()=>{this.setState((old)=>({physicallyDeleteFile:!old.physicallyDeleteFile}))}).bind(this)} 
        underlayColor="#333" >
           
    <View key="big switch card" style={{flexDirection:'row',marginVertical:8,alignSelf:"flex-end",marginRight:6}}>
        <View style={{flexDirection:'column', alignItems:"center",width:48,
        justifyContent:"center"}}>
          <SvgMi style={{alignSelf:"center"}} height={24} width={24} xmldata={st.delete}></SvgMi>
       </View>

       <View style={{flexDirection:'column',flex:1}}>
           
         <Text style={{color:"white",fontSize:12,}}>Physically delete file</Text> 
         <Text style={{color:"grey",fontSize:11,}}> {this.props.core.outputFileName}</Text> 

       </View>
       <View style={{flexDirection:'row',width:48,alignSelf:"flex-end",marginRight:6}}>
       <Switch  value={this.state.physicallyDeleteFile} 
       onValueChange={((val)=>{this.setState(()=>({physicallyDeleteFile:val}))}).bind(this)} 
       
       />
          
       </View>
           
           
           

    </View>
    </Pressable>   
            
             

           <View style={{flexDirection:'row',alignSelf:"flex-end",marginRight:6}}>
           
     <TouchableHighlight   underlayColor= {"#2c2c2c"} style={{paddingVertical:4,paddingHorizontal:8,marginHorizontal:6}}
     onPress={(() => { this.setState({isDeleteActionPromptOpen:false})}).bind(this)}>
         <Text style={{color:"white",alignSelf:"center"}} >Cancel</Text>
     </TouchableHighlight>

     <TouchableHighlight  underlayColor= {"#2c2c2c"} style={{paddingVertical:4,paddingHorizontal:8,marginHorizontal:6}}
     onPress={(() => { this.handleDelete(this.state.physicallyDeleteFile) }).bind(this)}>
         <Text style={{color:"#f43",alignSelf:"center"}} >Delete</Text>
     </TouchableHighlight>

           </View>
     
</Pressable>
      </Pressable>

    </Modal>
          <Animated.View  ref={this.taskcardref } 
          style={[style_TaskCard,this.props.wraperStyle,{
              opacity:this.state.fadeInOpacity,
              scaleY : this.state.shrinkValue.interpolate({inputRange:[0,1],outputRange:[0,1]}),
              translateX:this.state.slideInValue.interpolate({inputRange:[0,1],outputRange:[-Dimensions.get("window").width,0]})
              
              }]} >


              <View style={style_taskcardThumbnail} /* style={{backgroundImage: 'url(' + this.state.post_info.ThumbnailUrl+')'}} */> 
                 
                  <Image style={{maxHeight:"100%",maxWidth:"100%",resizeMode:"cover",height:"100%",width:"100%"}}
                   source={thumb_src} /> 
                   

                   {!legacy&&<View style={{left:2,top:2,width:32,height:32, position:"absolute",backgroundColor:"#000a", flexDirection:"row", justifyContent:"center",alignContent:"center", alignItems:'center', borderRadius:100}} /* style={{backgroundImage: 'url(' + this.state.post_info.ThumbnailUrl+')'}} */> 
                   
      <SvgMi xmldata={taskFormat=="MP3"? st.audioTrack:st.moviesLocal} color="#0e8" width={18} height={18}  ></SvgMi>

              </View>}
                 

              </View>




              <View style={style_taskcard_content}>
                  <View style={style_taskcard_head}>

                     {legacy&&(downloading||converting)&& <Stage stages ={this.state.mp3? ["Downloading","Converting"]:["Downloading"]}  highlighted={downloading?0:converting?1:done?4:4}/>}
                     {!legacy&&(downloading||converting)&& <Stage stages ={["Downloading.."]}  highlighted={0}/>}

                     { failed&&
                        <Text style={style_failed_header_title}>Failed!</Text>
                     }
                     { done&&
                        <View style={style_done_tag}>                            
                            <SvgMi style={{maxWidth:12,maxHeight:12,marginRight:2}} xmldata={st.doneOutline} color="#0e8" > </SvgMi>
                            <Text style={style_done_header_title}>Completed </Text>

                        </View>
                     } 

                     { this.props.dummy  &&
                        <Text style={style_dummy_title}>/dummy</Text>
                     }

                      
   
              {DEV_EXPO&& <Text key="tsk id" style={{color:"grey",fontSize:10}}>#id:{this.props.id} </Text>}
                  
                  
                    <TouchableHighlight style={{borderRadius:100,marginRight:4,marginTop:4}} 
                    hitSlop={{left:20,right:20,top:20,bottom:20}}
                    underlayColor= {"#2c2c2c"}
                    onPress={this.openMenu}>
                    <SvgMi xmldata={st.more_horiz} color="#eee" width={18} height={18} 
                    style={{}} ></SvgMi>
                    
                    </TouchableHighlight>
                   
                     



                  </View>
                  

 {/*should be deleted when droping support for legacy  */}
                  { (resolved)&&legacy&& <View style={style_fileInfo}>
                      <Text numberOfLines={1} ellipsizeMode="tail"  style={[style_fileName,{color:failed?"dimgrey":"whitesmoke"}]} > {VisibleTitle} </Text>
                      {(downloading||converting)&& 
                      <View style={{marginTop:4,marginLeft:2, flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
                                <Text style={{fontSize:9,color:'#888'}} >{VisibleSizeKey}</Text>
                                <Text style={{fontSize:9,color:'grey'}}> {VisibleSize}</Text>
                                
                                
                           </View>  
                    }
                    </View>}



                      {/*the non legacy ui*/}              
                     { (resolved)&&!legacy&& <View style={style_fileInfo}>
                      <Text numberOfLines={1} ellipsizeMode="tail"  style={[style_fileName,{color:failed?"dimgrey":"whitesmoke"}]} > {VisibleTitle} </Text>
                      {(downloading||converting)&& 
                      <View style={{marginTop:4,marginLeft:2, flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
                                <Text style={{fontSize:9,color:'#888'}} >{""}</Text>
                                <Text style={{fontSize:9,color:'grey'}}> {VisibleSize}</Text>
                                {taskFormat=="MP4"&&[
                                   
                                    <Text key="sep1" style={{fontSize:9,color:'#888',marginLeft:6,marginRight:6}} >{"|"}</Text>,
                                    <Text key="meme" style={{fontSize:9,color:'grey'}}> {(this.state.core as YVDL_Task).chosenVideoRepresentation.mimeType }</Text>,

                                    <Text key="sep2" style={{fontSize:9,color:'#888',marginLeft:6,marginRight:6}} >{"|"}</Text>,
                                    <Text key="res" style={{fontSize:9,color:'grey'}}> {(this.state.core as YVDL_Task).chosenVideoRepresentation.FBQualityLabel }</Text>,

                                ]}
                                {taskFormat=="MP3"&&[
                                   
                                   <Text key="sep1" style={{fontSize:9,color:'#888',marginLeft:6,marginRight:6}} >{"|"}</Text>,
                                   <Text key="sep2" style={{fontSize:9,color:'grey'}}> {(this.state.core as YVDL_Task).post_info_v02.dashManifestObject.AudioRepresentations[0].mimeType }</Text>

                                   
                               ]}
                                
                           </View>  
                    }
                    </View>}

                   

                   {downloading &&[
                       <DownloadingProgressInfo onCancel={this.handleOnCancelDownloading} download_prog={this.state.download_prog} key="DownloadingProgressInfo" />,
                       <ProgressBar nativeColor="cadetblue" useNative wraperStyle={{width:"98%"}} key="ProgressBar" showPercent={false} progress={{d:this.state.download_prog.d,t:this.state.download_prog.t}} ></ProgressBar>
                   ]
                   }
                  
                   {converting && 
                   
                   <ConversionStatus    percent={0.62} 
                   time={(this.state.converting_prog&&this.state.converting_prog.time)||0} 
                   writtenBytes={(this.state.converting_prog&&this.state.converting_prog.size)||0} ></ConversionStatus>
                   }

                   {done && <Getter parenttc={this} taskid={this.state.id} mp3={this.state.mp3} 
                   mp3output={this.props.core.outputPath+"/"+this.props.core.outputFileName+".mp3"} 
                   mp4output={ this.props.core.outputPath+"/"+this.props.core.outputFileName+".mp4"}  
                   onDeletePressed={this.openDeleteActionPrompt} output02rev={this.props.core.fullOutputFileName}
                    />}
              </View>
             
          </Animated.View>

          </MiSwipeable>
 
          
      )
    }



}



export type ConversionStatusProps = {
    writtenBytes:number,
    percent:number,
    time:number,
}


export class ConversionStatus extends Component<ConversionStatusProps,ConversionStatusProps>{

    props:ConversionStatusProps

    constructor(props){
        super(props)
        
        
    }


     style_value = {
        marginTop: 2,
           fontSize: 9,
           color: "lightseagreen",
          
           
    }
    render(){
        return (
            <View  style={{
                flex:1,
                flexDirection:"row",
                alignSelf:"stretch",
                alignContent:"center",
                alignItems:"center",
               // backgroundColor:"#333"

            }} >
                       {/* <Image source="img/loader.gif" alt=""/> */}
                       <ProgressBarAndroid indeterminate={false} styleAttr="Normal" style={{height:"95%"}}  progress={0.62}></ProgressBarAndroid>
                       
                       
                       <Text style={{color:"#888",fontSize:11, fontFamily:"sans-serif-light",}} >{"time: "}</Text>
                       <Text style={[this.style_value,{width:40}]}> {parseTime(this.props.time) }</Text>



                       
                       <Text style={{color:"#888",fontSize:11,marginLeft:8, fontFamily:"sans-serif-light",}} >{"size: "}</Text>
                       <Text style={this.style_value}> {( sizeFormatter(this.props.writtenBytes) )}</Text>


                   </View> 
        )
    }
}










function parseTime(time:number) {
    let date= new Date(time)
    return date.getMinutes()+ ":"+ (date.getSeconds()<10?"0":"")+ date.getSeconds() 
    
}





















function sizeFormatter(size:number){
    return size>1000000000? (Math.ceil( size/100000000)/10).toString()+" Gb": 
     size>1000000? (Math.ceil( size/100000)/10).toString()+" Mb": 
    size >1000? (Math.ceil( size/100)/10).toString()+"Kb": size + " b"
}