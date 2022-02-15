const DEV_EXPO = false // disables everything that expo cannot handle: use it to conditionally fake things like rnfs, parsing, converting


import React, { Component, createRef, RefObject } from 'react';

import { ToastAndroid,Linking, Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, ViewStyle, StyleProp } from 'react-native';

//
import {AppSettings, IOutputLocation, IPreferedNameSource, IPreferedQualty} from '../../Services/rev02types';
import Easing from 'react-native/Libraries/Animated/src/Easing';
import { PlayGround } from './PlayGround';
import {DefaultAppSettings} from "../../Services/ghost-yvdl"
import {YVDL_Task} from "../../Services/ghost-yvdl"
import RNGetIntentMIUtils from "react-native-get-intent-mi"
import { parse } from 'path';
import InputPanel from '../InputPanel/InputPanel';
import SettingsPanel from './SettingsPanel';







const MainPanelStyle : StyleProp<ViewStyle> = {
    //backgroundColor:"skyblue", 
    marginLeft:0,marginTop:0,
    alignSelf:"stretch",
    //marginStart:0,
    overflow:"visible",
    zIndex:10,
    paddingTop:0,
    display:"flex", flexDirection:"row", 
    justifyContent:"space-around" ,

//borderColor: "blue",
//borderWidth :2


}



type MainPanelProps ={
  onAddTask : (task:YVDL_Task)=>void

}

type MainPanelState ={
  currentAppSettings:AppSettings
  scrollXAnimated:any
}
//   

export default class MainPanel extends Component<MainPanelProps,MainPanelState>{

  flatListRef: RefObject<FlatList>;
    constructor(props){
      super (props)
      this.state={
        currentAppSettings:{...DefaultAppSettings},
        scrollXAnimated:new Animated.Value(0)
      }

       this.flatListRef = createRef()
      this.handleAppSettingsChanged=this.handleAppSettingsChanged.bind(this)
      this.handleOnAdvancedSettingsPressed = this.handleOnAdvancedSettingsPressed.bind(this)
    }
   


    /**utility function (copied from js notes for ppros book)
     * the arrays are not supported
     */
    deepAssign(exestingObj,assignerObj){
      function clone(exesting, obj ,  traversedObjects) {
        var copy;
        // primitive types
        if( obj === null || typeof obj !== "object" ) {
        return obj ;
        }
        // detect cycles
        for( var i = 0;  i < traversedObjects. length;  i++) {
        if( traversedObjects[ i] === obj ) {
        throw new Error( "Cannot clone circular object." ) ;
        }
        }
        // dates
        if( obj instanceof Date) {
        copy = new Date( ) ;
        copy. setTime( obj. getTime( ) ) ;
        return copy;
        }
        // arrays
        //removed from the originl function as it's not needed 
      
        // simple objects
        if( obj instanceof Object) {
        copy = JSON.parse(JSON.stringify(exesting));
        for( var key in obj ) {
        if( obj. hasOwnProperty( key) ) {
        copy[ key] = clone( exesting[key], obj [ key] ,  traversedObjects. concat( obj ) ) ;
        }
        }
        return copy;
        }
        throw new Error( "Not a cloneable object." ) ;
        }
        return clone( exestingObj, assignerObj , [ ] ) ;
    }

    handleAppSettingsChanged(newSettings){
     // alert(JSON.stringify(newSettings))
     
     
      this.setState ((old)=>({currentAppSettings:this.deepAssign(old.currentAppSettings,newSettings)}),()=>{
        ToastAndroid.show("Settings updated",1000)
        //alert(JSON.stringify(this.state.currentAppSettings))
        
      })
   
   

    }




     

    async handleOnAdvancedSettingsPressed(){
      // perform an automated slid to the settings panel
      
let rep = `<Representation id="157668436576460v" mimeType="video/mp4" codecs="avc1.4D401E" width="640" height="360" frameRate="11988/400" sar="1:1" startWithSAP="1" bandwidth="51615" FBEncodingTag="dash_gen3basic_5secgop_hq1_frag_2_video" FBPlaybackResolutionMos="0:100,360:81.7,480:70,720:50.1,1080:28.5" FBPlaybackResolutionMosConfidenceLevel="high" FBAbrPolicyTags="hvq_www_inline" FBDefaultQuality="1" FBQualityClass="sd" FBQualityLabel="360p">
<BaseURL>https://video.fcmn1-2.fna.fbcdn.net/v/t39.25447-2/268400001_968106747468467_6503924319977648711_n.mp4?_nc_cat=108&amp;ccb=1-5&amp;_nc_sid=5aebc0&amp;efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfZ2VuM2Jhc2ljXzVzZWNnb3BfaHExX2ZyYWdfMl92aWRlbyJ9&amp;_nc_ohc=oOf-sEYutlIAX8Mi57P&amp;_nc_ht=video.fcmn1-2.fna&amp;oh=00_AT_of8YshU9tZwi6yHytLcNyukMyel_SvdDMYxXXdUs6wA&amp;oe=61FE3502</BaseURL>
<SegmentBase indexRangeExact="true" indexRange="965-9348" FBFirstSegmentRange="9349-467020"><Initialization range="0-964"/></SegmentBase>
</Representation><Representation id="688365252146625v" mimeType="video/mp4" codecs="avc1.4D401F" width="1280" height="720" frameRate="11988/400" sar="1:1" startWithSAP="1" bandwidth="221785" FBEncodingTag="dash_gen3basic_5secgop_hq2_frag_2_video" FBPlaybackResolutionMos="0:100,360:94.1,480:92.2,720:82.2,1080:56.3" FBPlaybackResolutionMosConfidenceLevel="high" FBAbrPolicyTags="avoid_on_cellular,avoid_on_cellular_intentional,hvq_www_inline,hvq" FBQualityClass="hd" FBQualityLabel="720p">
<BaseURL>https://video.fcmn1-1.fna.fbcdn.net/v/t39.25447-2/10000000_261215566008434_3702160830793337573_n.mp4?_nc_cat=104&amp;ccb=1-5&amp;_nc_sid=5aebc0&amp;efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfZ2VuM2Jhc2ljXzVzZWNnb3BfaHEyX2ZyYWdfMl92aWRlbyJ9&amp;_nc_ohc=YlhcB5cEiAEAX_6yXBk&amp;_nc_ht=video.fcmn1-1.fna&amp;oh=00_AT-6sAqFM4iww0moHHYd74fpSPqZ1KwiEQTvFwNjcFLXcA&amp;oe=61FED917</BaseURL>
<SegmentBase indexRangeExact="true" indexRange="964-9347" FBFirstSegmentRange="9348-1576464"><Initialization range="0-963"/></SegmentBase>
</Representation>`



this.flatListRef.current.scrollToIndex({animated:true,index:1})


//alert(MI_XML_UTILS.getNodeInnerText("BaseURL",MI_XML_UTILS.getNodesByTagName("Representation",rep)[1]))
     
return

    
     }



    render(){
      return (

        
    <View style={MainPanelStyle} >

     <Animated.FlatList ref={this.flatListRef} 
     showsHorizontalScrollIndicator={false}
    style={{  }}
    contentContainerStyle={{ /* width:"200%"*/ alignItems:"flex-start"  }}
/*
 "dispatchConfig",
 "_targetInst",
 "_dispatchListeners",
 "_dispatchInstances",
 "nativeEvent",
 "type",
 "target",
 "currentTarget",
 "eventPhase",
 "bubbles",
 "cancelable",
 "timeStamp",
 "defaultPrevented",
 "isTrusted",
 "isDefaultPrevented",
 "isPropagationStopped",*/
    //onScroll={((e)=>{verbo(Object.keys(e))}).bind(this)}
    //onScroll={((e)=>{verbo(e.type)}).bind(this)}
    onScroll={Animated.event([{nativeEvent:{contentOffset:
      
      {x:this.state.scrollXAnimated}}}],{useNativeDriver:false})}
    disableScrollViewPanResponder={true}
    nestedScrollEnabled={true}
    
    
        //endog tweaks

    
    horizontal
    
    initialScrollIndex={0}
    pagingEnabled

    data= { [{key:"1",p:"input"},{key:"2",p:"settings"},{key:"3",p:"playground"}]}
    renderItem = {({item})=>{ 
        return (
        (item.p=="input")?
        <InputPanel 
          onShowAdvancedSettingsPress={this.handleOnAdvancedSettingsPressed} currentAppSettings={this.state.currentAppSettings} show_fetcher_bar={false} onAddTask={this.props.onAddTask}>
       
        </InputPanel> 

        //<Text style={{width:Dimensions.get("window").width}} >gj1</Text>

        :(item.p=="settings")?
        <SettingsPanel style={{opacity:this.state.scrollXAnimated.interpolate({inputRange:[0,320],
          outputRange:[0,1],easing:Easing.in(Easing.ease)})}} 
        currentAppSettings={this.state.currentAppSettings} onSettingsChanged={this.handleAppSettingsChanged} ></SettingsPanel>
        :(DEV_EXPO&& (item.p=="playground"))?
        <PlayGround/>
        : null)
    }}

    >
    </Animated.FlatList> 
    </View>
  
      )
    }
  
  
  }
  
  
  




