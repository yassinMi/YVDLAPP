const DEV_EXPO = false




import React, { Component, createRef, RefObject } from 'react';
import { Animated, Easing, StyleSheet, Text, View,TouchableOpacity, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, Clipboard, Linking, TextProps } from 'react-native';
import fsrn from 'react-native-fs'
//
import YTabs from './YTabs'
import DiskInfo from "./DiskInfo"
import TaskCard from "./TaskCard"
 import Swipeable, { Swip } from './Swipeable';
import { ButtonPretty } from './ButtonPretty';
import ProgressBar from './ProgressBar';
import Svg from 'react-native-svg';
import SvgMi, { st } from './SvgMi';
import { YVDL_Task,  } from './ghost-yvdl';
import {LogLevel, RNFFmpeg } from 'react-native-ffmpeg';

import Miexpander from './MiExpander'
import MiExpander from './MiExpander';
import CheckBox10Native from './CheckBox10Native';
import FfmpegOptionsPickerNative from "./FfmpegOptionsPickerNative"
import MiSwipeable from './MiSwipeable';
import { Palette } from './theme';
import FfmpegTaskInputPanel, { FfmpegPresetPicker } from './FfmpegNewTask';
import MiPrettyChip from './MiPrettyChip';
import MiMenuItem from './MiMenuItem';
import MiMenuGroupHeader from './MiMenuGroupHeader';
import { prependOnceListener } from 'process';
import Output from "./Output"
import { type } from 'os';
import {AppSettings, IOutputLocation, IPreferedNameSource, IPreferedQualty} from './rev02types';
import { verbo } from './GeneralUtils';
import {  TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';


import { copyFileAssets } from 'react-native-fs';
import {RNGetIntentMIUtils} from 'react-native-get-intent-mi';





const  style_InputPanel : StyleProp<ViewStyle> ={
  flexDirection: "column",
  //justifyContent: "space-between",
 // justifyContent: "flex-start",

maxHeight:Dimensions.get("window").height-100,
//alignItems: "center",

//backgroundColor:"yellow",
paddingBottom:10
  //borderWidth: 1,//
//borderColor: "darkslategray"
}


type InputPanelProps = {
  onAddTask : (task:YVDL_Task)=>void
  onShowAdvancedSettingsPress: ()=>void
  currentAppSettings:AppSettings
  show_fetcher_bar:boolean
  style?:any //used for transfering animated values such as opac from parent as the user scrols
  
}
type InputPanelState = {
  query:string
  show_fetcher_bar:boolean
  sw_use_options_val :false
  sw_mp3_val:boolean,
  taskType:TaskType
  yvdlTaskType:YVDLTaskType
  selectedWebsite:stdWebsite
  
}
export type stdWebsite = "facebook"|"instagram"|"youtube"
//  

export type TaskType = "YVDL"|"FFMPEG"
export type YVDLTaskType = "MP3"|"MP4"


export default class InputPanel extends Component<InputPanelProps,InputPanelState>{
  InputURL_sectionRef: RefObject<InputURL_section>;
  outputRef: RefObject<Output>;
    constructor(props:InputPanelProps){
      super(props)
      this.state={
        query:"",
        taskType:"YVDL",
        yvdlTaskType:"MP3",
        show_fetcher_bar :  props.show_fetcher_bar,
        sw_mp3_val : false,
        sw_use_options_val:false,
        selectedWebsite:"facebook"
        

      }
      this.hasHandledInitialUrl = false
      this.onHandleAddTask = this.onHandleAddTask.bind(this)
      this.handleInitialUrl=this.handleInitialUrl.bind(this)
  
      this.outputRef = createRef()
      this.InputURL_sectionRef = createRef()
      this.handle_Go=this.handle_Go.bind(this)
   
    }
  

    hasHandledInitialUrl: boolean

    /**
 * the app was started with a send action
 * @param url 
 */
     handleInitialUrl(url:string){
       verbo("handleInitialUrl here: "+ url)
       if(this.hasHandledInitialUrl) { //avoid filling it multiple time when the component re mounts (ef that even possible)
       verbo("has handenel befor")
       return
       }else{

        this.setState({query:url})
        this.InputURL_sectionRef?.current?.setState({query:url})
       this.hasHandledInitialUrl=true
       } 

    }

    componentDidMount(){

     /*const url = Linking.getInitialURL().then(url => {
       if (url) {
         //const route = url.replace(/.*?:\/\//g, "");
         verbo("linking: getInitialURL resolved to: "+url)
         
       }
       else if (url==null){
         verbo("linking: getInitialURL resolved to null")
       }
     });*/

     const urlmi = RNGetIntentMIUtils.getInitialData().then(data => {
       if (data) {
         //const route = url.replace(/.*?:\/\//g, "");
         verbo("linking mi: getInitialData resolved to: "+data)
         let parsed :{text:string,uri:string} = JSON.parse(data)
         let url = parsed.text|| parsed.uri
         if(url){
           this.handleInitialUrl(url)
         }
         
       }
       else if (data==null){
         verbo("linking mi: getInitialData resolved to null")
       }
     }).catch(err=>{
       verbo("linking mi: getInitialData rejected;  "+err);

     });


    }

    onHandleAddTask(task_core){

      //alert("app level adding: "+ task_core.my_id)
      //this.outputRef.current.setState({core_tasks:task_core},()=>{
      //  alert("app level setting state done ")
      //})
  
      this.outputRef.current.addTask(task_core)
  
    }

   async handle_Go (query: string){

    
      if(!query){
        
          return
       
      }

      if(this.state.show_fetcher_bar){
        return; //02rev so that the uer dont accidentally start the task 2 times
      }

       
      if (!query.match(/www\.facebook\.com.*/)&&!query.match(/(https?:\/\/)fb.watch\/*/)&&!query.match(/(https?:\/\/)fb.gg\/*/))
      return 



      verbo(query)

      
      this.setState({show_fetcher_bar:true})
      query = query?query:"fake query"
      //check validation 
      let new_tsk = new YVDL_Task(query,"facebook",this.state.yvdlTaskType=="MP3",null,null,this.props.currentAppSettings)

      //alert("task created") 
      new_tsk.cb_statusChange=(ev,statu)=>{
        verbo("status changed to " + statu.status + (statu.status=="failed"? statu.failurReason:""))

      }
      new_tsk.cb_failed = (ev,err)=>{
        verbo("yvdl_task failed :" + (err.message||err)  )

      }
      new_tsk.cb_videoSaved = ()=>{verbo("video saved")}
      new_tsk.cb_downloadProgress = ()=>{}
      new_tsk.cb_conversionProgress = ()=>{}
     // alert("init")

      new_tsk.Init().then((val)=>{
//02rev todo handle output here 
       this.onHandleAddTask(new_tsk)
       //-02rev- this.props. onAddTask(new_tsk)
        //alert(val.post_info.Title)

        this.setState({show_fetcher_bar:false})

       
          this.InputURL_sectionRef.current.setState({query:""})
         
    

       
        
        
      }).catch(err=>{
        this.setState({show_fetcher_bar:false})
        alert("Task initialization failed:\n"+(err.message||err))
      })

    }


    render(){
      return(
        <Animated.View  style={[style_InputPanel,{width:Dimensions.get("window").width},this.props.style]}>
           <View style={{paddingBottom:8,width:Dimensions.get("window").width,//found this layout bug width and not Width which i remember has made me do some ugly workarounds in the children stylings.. try to remove them aka try to restyle everything the right intuitive way, i'm not fixing it now
           backgroundColor: Palette.panel,}} key="upper half" > 

          
          <YTabs   selected={0} onChange={this.handleWebsiteChange.bind(this) }
          itemsSelectedColor={"#33a0ff"} itemsSelectedTextColor={"#c2e1ff"}
          ></YTabs>


          {true&&<OptionsPanel taskType={this.state.taskType}  yvdlTaskType={this.state.yvdlTaskType}

          selectedRadioIx={this.state.yvdlTaskType== "MP3"?1:2}
          OnTaskTypeChange = { ((t)=> {
            this.setState({taskType:t})
            //alert(t)
          
          }).bind(this)}

          OnYvdlTaskTypeChange = { ((t:YVDLTaskType)=> {
            this.setState({yvdlTaskType:t})
            //alert(t)
          
          }).bind(this)}
          OnMoreSettingsPressed={this.props.onShowAdvancedSettingsPress}
          sw_mp3_val={false} sw_use_options_val={false} >
            </OptionsPanel>  }

            {this.state.selectedWebsite=="youtube"   &&<View key="notice " style={{alignSelf:"center"}}>
              <Text style={{color:"#f43",fontSize:11}}>Youtube not supported</Text>
            </View>}
            <InputURL_section ref={this.InputURL_sectionRef} query={this.state.query}
          showFetchingProgress={this.state.show_fetcher_bar} onGo={this.handle_Go.bind(this)}  >
          </InputURL_section> 

           </View> 

           
           

         
  
          
        

          <Output sortBy={"newFirst"} ref={this.outputRef} core_tasks={[]} ></Output>  

        </Animated.View> 
      )
    }
  handleWebsiteChange(ix: number): void {

    this.setState({selectedWebsite:ix==0?"facebook":ix==1?"youtube":"instagram"})


    
  }
  }
  


























const optionsPnelStyle : StyleProp<ViewStyle> ={
  
    marginTop:0,
    paddingVertical:6,
    alignSelf:"flex-start",
     flexDirection:"column",
    width:Dimensions.get("window").width,
    
   // backgroundColor:"#322",
   
}

const optionsPanelHalf : StyleProp<ViewStyle> ={
    //height:80,
    paddingLeft:6, paddingTop:6,
    flex:1,
    //alignSelf:"stretch",
    flexDirection:"column",
    alignContent:"flex-start",
    backgroundColor:"yellow",
    maxWidth:"50%",
    alignItems:"flex-start",
    justifyContent:"flex-start"
  
  
}


type OptionsPanelProps={
  sw_use_options_val:boolean
  sw_mp3_val:boolean
  taskType:TaskType,
  yvdlTaskType:YVDLTaskType,
  OnTaskTypeChange:(t:TaskType)=>void
  OnYvdlTaskTypeChange:(t:YVDLTaskType)=>void
  OnMoreSettingsPressed:()=>void
  selectedRadioIx:number
}  
type OptionsPanelState={
  sw_use_options_val:boolean
  selectedRadioIx:number

  sw_mp3_val:boolean
  taskType:TaskType
  yvdlTaskType:YVDLTaskType,

}

  
export class OptionsPanel extends Component<OptionsPanelProps,OptionsPanelState>{
  constructor(props:OptionsPanelProps){
    super(props)
    this.state = {
      sw_mp3_val: props.sw_mp3_val,
      sw_use_options_val : false,
      taskType: "FFMPEG" ,// props.taskType,
      yvdlTaskType:  props.yvdlTaskType,
      selectedRadioIx: props.selectedRadioIx || 1



    }
this.handleMoreSettingsPressed = this.handleMoreSettingsPressed.bind(this)
    this.changeSelectedRadio= this.changeSelectedRadio.bind(this)
    this.handleFormatChanged=this.handleFormatChanged.bind(this)
    this.mp3_switch_ref = createRef() //as import('react').RefObject<Switch>

  }

  mp3_switch_ref:RefObject<Switch>

  
  changeSelectedRadio(new_ix){
    this.setState({selectedRadioIx:new_ix})
    this.setState({yvdlTaskType:new_ix==1? "MP3":"MP4"})

    this.props.OnYvdlTaskTypeChange(new_ix==1? "MP3":"MP4") // 

  }

  handleMoreSettingsPressed(){
   this.props.OnMoreSettingsPressed()
  }
  handleFormatChanged(val){
    this.setState({yvdlTaskType:val=="MP3"? "MP3":"MP4"})

    this.props.OnYvdlTaskTypeChange(val=="MP3"? "MP3":"MP4") // 
   
  }

  render(){
    return(

      <View style={optionsPnelStyle}>
        
       {false&&<View style={[{flexDirection:"row",    backgroundColor:"green",alignItems:"center"}]}>
         

       <MiPrettyChip ix={1} changeSelected={this.changeSelectedRadio}  selectedRadioIx={this.state.selectedRadioIx}  tilte={"MP3"} />
       
       <MiPrettyChip ix={2} changeSelected={this.changeSelectedRadio}  selectedRadioIx={this.state.selectedRadioIx} tilte={"MP4"} />
   
      
      </View>}




      <View style={{ flexDirection:"column", alignItems:"center", paddingVertical:2} }>
      {false&&<MiMenuGroupHeader tilte={"Task settings"}   />}

       <MiMenuItem iconXmldata={this.state.yvdlTaskType=="MP3"? st.audioTrack:st.moviesLocal} onSelectionChanged={this.handleFormatChanged} tilte={"Format"} values={["MP3","MP4"]}   />
       <MiMenuItem tilte={"Advanced settings"} isParent={true} onParentPress={this.handleMoreSettingsPressed} iconXmldata={st.tune} values={["MP3","MP4"]}  />
         </View>
     

    </View>


    )
  }
}






































type MiTextInput_props = {
  innerIconData?:string
  InnerTextInputStyle:StyleProp<TextStyle>

  onClearPress:()=>void
  onChangeText:(val:string)=>void
  placeholderTextColor:string
  textContentType?:any
  placeholder?:string
  value?:string
  style:TextStyleProp

}

type MiTextInput_state = {
isEmpty:boolean

}

/**
 * what this bring to the table is the clear button.. otherwise t only encapsulates a textInput
 */
class MiTextInput extends Component{

  props:MiTextInput_props
  state:MiTextInput_state
  textInputRef:RefObject<TextInput>;
  a:any
  /**
   *
   */
  constructor(props:MiTextInput_props) {
    super(props);
    this.state={
      isEmpty:this.emptyOrNullStr(props.value),
      
    }
    
    this.a=new Animated.Value(0)
    
    this.textInputRef = createRef()
    this.handleTextChange=this.handleTextChange.bind(this)
    this.handleClearPress=this.handleClearPress.bind(this)

  }


 
  handleTextChange(val:string){


    //alert(Object.keys(this.textInputRef.current?.getNativeRef())) 
    if(!val&&val==""){
      this.setState({isEmpty:true})

    }
    else{
      this.setState({isEmpty:false})

    }
    this.props.onChangeText(val)
  }
  emptyOrNullStr(str:string){
    return (!str) || (str==="")
  }

  
  componentDidMount(){
    
    Animated.timing(this.a,  {
      toValue : 1, duration : 1000, easing : Easing.inOut(Easing.ease), delay :
      100
    , useNativeDriver:false}).start();

  }
  
  handleClearPress(){
    Animated.timing(this.a,  {
      toValue : 1, duration : 1000, easing : Easing.inOut(Easing.ease), delay :
      1000, useNativeDriver:false
    }).start();
    this.textInputRef.current.clear()
    this.props.onClearPress&&this.props.onClearPress()
    this.setState({isEmpty:true})
  }
  
  render(){
    return (

      <Animated.View  style={[{flexDirection:"row", opacity:this.a, alignItems:"stretch",},this.props.style]}>
        <TextInput ref={this.textInputRef} style={[{flex:1},this.props.InnerTextInputStyle]}
        onChangeText={this.handleTextChange}
        placeholderTextColor={this.props.placeholderTextColor} value={this.props.value}  
          textContentType={this.props.textContentType} placeholder={this.props.placeholder}
        ></TextInput>
        {((!this.state.isEmpty||(!this.emptyOrNullStr(this.props.value))))&&
        <TouchableOpacity hitSlop={{left:10,right:10,top:10,bottom:10}} onPress={this.handleClearPress} style={{alignSelf:"center", marginLeft:0, marginRight:12}}>
        <SvgMi   height={12} width={12} xmldata={this.props.innerIconData||st.cancel} ></SvgMi>
      </TouchableOpacity>
        
        }
        
      </Animated.View>

    )
  }


}

























const style_url_input:StyleProp<TextStyle> ={
  elevation:0,
  backgroundColor:   "#2c363c",

 
  width: "85%",
  height:35,
 
 
 borderRadius:50
  
}
const style_url_input_innerTextInput:StyleProp<TextStyle> ={
  
  color : "#ffffff",
  fontSize:13,
  
 
  paddingLeft:10,
  marginRight:10,
  textAlignVertical:"center",
  paddingVertical : 3,
 
  
  paddingStart:10,
  paddingEnd:0,
  
 
  
}
//


type InputURL_section_props = {
  query:string,showFetchingProgress:boolean,onGo:(query:string)=>void
}

type InputURL_section_state = {
  query:string,showFetchingProgress:boolean
}






class InputURL_section extends Component<InputURL_section_props,InputURL_section_state>{
  constructor(props:InputURL_section_props){
    super (props)

    this.state={
      query:this.props.query,
      showFetchingProgress: false
    }
    this.injectQuery=this.injectQuery.bind(this)
  }

    


  async onClick(){   // the very go button, on click


    if(!this.state.query){
      
      Clipboard.getString().then(clp=>{
        if(clp.match(/(https?:\/\/)www.(facebook|instagram).com.*/)||clp.match(/(https?:\/\/)fb.watch\/*/)||clp.match(/(https?:\/\/)fb.gg\/*/))// firt 31-jan edit after more than 1 year..
        this.setState({query:clp})
        return
      })
      return
    }
    if(DEV_EXPO){

      
      this.props.onGo(this.state.query/* ||"https://www.facebook.com/dropyourfeelhere/videos/423523511986197/" */)
      return
    }

  fsrn.exists(fsrn.ExternalStorageDirectoryPath+"/YVDL").then(async (exosts)=>{

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if(!readGranted || !writeGranted) {
      console.log('Read and write permissions have not been granted');
      alert("required permissionss have not been granted")
      return;
    }

    let p = {ThumbnailUrl: "https://scontent.frba1-1.fna.fbcdn.net/v/t15.5256-10/p206x206/75522592_2687397354829673_5488251941181980672_n.jpg?_nc_cat=111&ccb=2&_nc_sid=ad6a45&_nc_ohc=PGHYv1qXAd4AX9Bv138&_nc_ht=scontent.frba1-1.fna&oh=f373b61aec8248928b6c23e3c135bf10&oe=6007C37F",
    VideoUrl: "https://video.frba1-1.fna.fbcdn.net/v/t42.9040-2/88126851_544853306150460_2045617928660844544_n.mp4?_nc_cat=100&ccb=2&_nc_sid=985c63&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=mjbz5nh5h9oAX9iIgZk&rl=300&vabr=91&_nc_ht=video.frba1-1.fna&oh=5871a4350b8646b712ed05989a0cf959&oe=5FE123A7",
    "Title": "TheFatRat & Anjulie - Close To The Sun (Lyrics)"}
   
    if(exosts){



    }
    else{
      await fsrn.mkdir(fsrn.ExternalStorageDirectoryPath+"/YVDL")
        alert("make dir yvdl, created") 
        await fsrn.writeFile(fsrn.ExternalStorageDirectoryPath+"/YVDL/yas.txt","ok")
    }

    this.props.onGo(this.state.query)


  })
  





  }


  injectQuery(url){
    this.setState(url)
  }

  render(){
    return (

      
      <View  key="wrapes-it -with-the-underline" style={ {
        
        //flex:1,
        flexDirection:"column",
        alignItems:"flex-start",
        justifyContent:"space-between",
        alignSelf:"stretch",
        height:46,
       // backgroundColor:"yellow",
        //zIndex:40
      }} >

          <View key = "underline" style={{

          height:0.5, 
           backgroundColor:"#222",
          alignSelf:"stretch",

} }>
</View>
     
      <View style = {{margin:0,
        padding: 4,
        paddingHorizontal:10,
        //flex:1,
        alignSelf:"stretch",
        maxHeight:40,
        minHeight:40,
  
        width:"100%",

        flexDirection:"row",
        alignItems:"center",
        justifyContent:'space-around',
      // backgroundColor:"#f00",
        
       } } > 
         
         <MiTextInput  onChangeText={text=>this.setState({query:text})}
          placeholderTextColor="#d0e0f0" value={this.state.query}  
           style={style_url_input} textContentType="URL" placeholder="Post link" 
           onClearPress={(()=>{this.setState({query:""})}).bind(this)}
           InnerTextInputStyle={style_url_input_innerTextInput}
           innerIconData={st.x_by_yass}
           />


          
           
           
{/*           <Button color="#1c1c1c" size={5}   style={styles.go_button}  title="go"></Button>
 */} 
          
  { true&& <ButtonPretty  onClick={ ()=>{
    requestAnimationFrame(() => {
      this.onClick()
      });
   

  
}}
 touchableHighlightStyle = {{borderRadius:100}}
   style={{width:36,maxWidth:35,height:35,maxHeight:35,borderRadius:100}} Wraper_rest_color="#008080"
     wraper_pressed_color="#ff3" caption="" 
     iconMiProps={{ size:this.state.query?24:18,  style:{position:"relative",left:8,translateX:-3}, 
     xmldata:this.state.query?st.add:st.content_paste, color:"#eee" }} iconChild > </ButtonPretty>
     }



{ false && 
<ButtonPretty onClick={()=>{ let q = this.state.query.replace(/yvd/g,"/storage/emulated/0/YVDL");
verbo("running ffmpeg ");
RNFFmpeg.execute(q).then(result => console.log(`FFmpeg process exited with rc=${result}.`));
}}  Wraper_rest_color="#2c2c2c" caption="ff" style={{borderRadius:0,maxHeight:24,marginTop:14}  } spanStyle={{fontSize:11,color:"white"}} >
 </ButtonPretty>}

     
     
        
       </View>

       
<View key= "INDEterminant progress horizental" style={{
position:"absolute",
bottom:0,
width:"100%",
height:0.5,
//backgroundColor:"#6c6c6c",
alignSelf:"stretch",


} }>

  {
   this.props.showFetchingProgress &&
  <ProgressBarAndroid color="orange" styleAttr="Horizontal"></ProgressBarAndroid>
}

</View>

      
       </View>

    )
  }


}

