//import { StatusBar } from 'expo-status-bar';
import React, { Component, createRef ,RefObject} from 'react';
import {ARTText,TouchableHighlight,PanResponder, Animated, Easing,ScrollView,TouchableOpacity, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions } from 'react-native';
/* import {createAppContainer} from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";

 */

 //i

import FfmpegTaskDialog from "./InputPanel/FfmpegNewTask"
import MainPanel from "./MainPanel/MainPanel"
import Header from "./Header/Header"
import DiskInfo from "./MainPanel/DiskInfo"
import Swipeable, { Swip } from './Common/Swipeable';
import SvgMi, { st } from './Common/SvgMi';
import { Palette } from './Common/theme';
import { verbo } from "../Services/GeneralUtils"
import SplashScreen from 'react-native-splash-screen'



 let t = new Alert 
 



 const FunctionalText = (str,title)=>(<Text style={{color:"white",marginVertical:4}}>{title+str} </Text>)
 FunctionalText.defaultProps = {str:"default text here",title:"defTitle: "}
 
 




export  class App extends Component {

  constructor(props){
   
    super(props)
    this.state={
      selectedWebsiteIx : 1  ,
      scrollXAnimated:new Animated.Value(0)
    }

    this.handleWebsiteChange=this.handleWebsiteChange.bind(this)
    this.handleSearchPressed=this.handleSearchPressed.bind(this)
    this.handleMenuPressed=this.handleMenuPressed.bind(this)
    this.onObtainedHeaderRef=this.onObtainedHeaderRef.bind(this)
    this.onObtainedMainPanelRef=this.onObtainedMainPanelRef.bind(this)

  }

  mainPanelRef = {}
  headerRef = {}
  componentDidMount(){

    setTimeout(() => {
      SplashScreen.hide()

    }, 200); 
    //todo this delay works around the awkward white screen that shows up in 
    /**
     * between the dark#050505 splashscreen and the dark#050505 app 
     * that's becquse there seems to be a delay between componentDidmount and the time the app is
     * actuallly rendered 
     * consider the folowing two solutions: 
     * make that intermidiate screen itself dark #050505 through some native theme configuring if possible
     * this will look like the logo disapearing before the app elemnts show app which is nice
     * second move this hide call to another sort of event where t's garanteed that the app is visible  
     */
  }

   handleWebsiteChange(ix){
     this.props
     // this.setState({selectedWebsiteIx:ix})
  }

  
  handleSearchPressed(){
    alert("search dev")
  }

  handleMenuPressed(){
    alert("menu dev")
  }

  bothRefsObtained(){
    this.headerRef&&this.headerRef.pushAnimatedRef(this.mainPanelRef?.state?.scrollXAnimated?.interpolate({inputRange:[0,340],
      outputRange:[0,1]}))
    //this.setState({scrollXAnimated:this.mainPanelRef?.state?.scrollXAnimated})

  }

  hasObtainedHeaderRef=false
  hasObtainedMPRef=false
  onObtainedMainPanelRef(ref){
    
    this.mainPanelRef=ref
    if(this.hasObtainedHeaderRef){
       this.bothRefsObtained()
    }
    this.hasObtainedMPRef=true

  }
  onObtainedHeaderRef(ref){
    
    this.headerRef = ref
    if(this.hasObtainedMPRef){
      this.bothRefsObtained()
      
    }
    this.hasObtainedHeaderRef=true
    
  }


  render(){

  
   return (
    <View   style={ styles.container}>



      <Header opacAnime={this.state.scrollXAnimated.interpolate({inputRange:[0,300],
          outputRange:[0,1],easing:Easing.ease})} searchPressed={this.handleSearchPressed}
      ref={(ref)=>{this.onObtainedHeaderRef(ref)}}
       menuPressed={this.handleMenuPressed} onAddTask={this.onHandleAddTask}  ></Header>
      

      <MainPanel ref={(ref)=>{this.onObtainedMainPanelRef(ref)}} />
    
   

{/*        <MiSwipeable child_width={Dimensions.get("screen").width} style= {{width:Dimensions.get("screen").width*0.7}}>


          <TaskCard>
            
          </TaskCard>
           </MiSwipeable> */}

{     // <FfmpegTaskDialog presetslist={[{name:"instagramify",inputs:['image',"image"]},{"name":"trim"}]} ></FfmpegTaskDialog>
}       
          

 
      <Text style={styles.oneliner_footer}>te v0.2.3</Text> 
      {/* <Text style={{backgroundColor:"green",height:45,marginVertical:25}} >te5455 </Text> 
      <Text style={{backgroundColor:"green",height:45,marginVertical:25}} >te54552 </Text> 
      <Text style={{backgroundColor:"green",height:45,marginVertical:25}} >te5455 3</Text> 
      <Text style={{backgroundColor:"green",height:45,marginVertical:25}} >te5455 4</Text> 
 */}
      <StatusBar  style="auto" />
    </View>
  )}
}







const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:"column",
    backgroundColor: Palette.appBackground,
    margin:0,
    width:"100%", maxWidth:"100%",minWidth:"100%",
    maxHeight:"100%",
    alignContent:"flex-start",
    justifyContent:"flex-start",
    alignItems: 'center',
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop:  StatusBar.currentHeight }
      }),
      padding:0,
      paddingTop:0
  },
 
  text:{
    color: "#ffffff",

    
  },
  oneliner_footer:{
    color: "#556689",

    fontSize:9,
    marginBottom:2,
    position:'absolute',
    bottom:0
  },
 
  go_button:{
   marginTop: 5,
   marginEnd: 3,
   fontSize:8
  },
 
}

);















