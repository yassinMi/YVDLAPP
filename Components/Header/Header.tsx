


import React, { Component, createRef } from 'react';
import { Animated,TouchableOpacity, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, ViewStyle, StyleProp, TextStyle } from 'react-native';
import Easing from 'react-native/Libraries/Animated/src/Easing';
//
import DiskInfo from "./DiskInfo"
import TaskCard from "./TaskCard"
 import Swipeable, { Swip } from './Swipeable';
import { ButtonPretty } from './ButtonPretty';
import ProgressBar from './ProgressBar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Svg from 'react-native-svg';
import SvgMi, { st } from './SvgMi';
import { Palette } from './theme';
import { verbo } from './GeneralUtils';



const HeaderStyle : StyleProp<ViewStyle>= {
  marginBottom:0, marginVertical:0, padding: 6, paddingHorizontal:6,
  flex:1,
  flexDirection:"row",
  maxHeight:50,
  minHeight:50,
  alignItems:"center",
  justifyContent:"space-between",
  alignSelf:"stretch",
  backgroundColor: Palette.panel,
  //borderColor: "blue",
  //borderWidth:2,
  }

  //now ts more lke "current view lable"
  const AppNameStyle : StyleProp<ViewStyle>= {
    flex:4, margin:0,
    paddingHorizontal:6, backgroundColor:"transparent", 
     paddingVertical:4,
    alignSelf:"center",
  }
  const AppIconStyle : StyleProp<ViewStyle>= {
    
     margin:0, 
    paddingHorizontal:0,
     backgroundColor:"transparent", 
     alignSelf:"center",
   
  }
  /**now its version , switched it to show the title of view eg "Settings" with animation features*/
  const AppName_text_Style : StyleProp<TextStyle>= { 
    marginLeft:10,
    color: "#eee",fontWeight:"bold",
  fontSize:16, /*fontFamily:"sans-serif"*/
  }
  const headerControlsStyle : StyleProp<ViewStyle> = {
    flexDirection:"row", justifyContent:"space-between", 
    width:70,
    alignItems:"center", alignContent:"center", alignSelf:"center", 
    margin:0,paddingHorizontal:6, paddingVertical:0
  }

  type Header_props={
    searchPressed?:()=>void
    menuPressed?:()=>void
    
  }
  type Header_state={
    opacAnime:any

  }

export default class Header extends Component<Header_props,Header_state>{
    constructor(props){
      super (props)
      this.state={
        opacAnime:null
      }
      this.handleOnMenuPress=this.handleOnMenuPress.bind(this)
      this.handleOnSearchPress=this.handleOnSearchPress.bind(this)
    }

//called by app parent to deliver the animated that keeps track of hoz scroling
  
pushAnimatedRef(i){
  verbo("pushed: " )
  verbo(Object.keys(i||{none:1})) 
  if(i){
    this.setState({opacAnime:i})
  }
}
    handleOnSearchPress(){
      this.props.searchPressed&&this.props.searchPressed()

    }
    handleOnMenuPress(){
      this.props.menuPressed&&this.props.menuPressed()

//{translateX:this.state.opacAnime?.interpolate({inputRange:[0,1],outputRange:[0,100],easing:Easing.ease})||8}
    }
  
    render(){
      return (
  
      <View style = {HeaderStyle}>

          <View  style={AppIconStyle} >
              <SvgMi xmldata={st.catLogo4} height={52} width={52} 
               color={"#EEEEEE"}  ></SvgMi>
          </View>
          
          <View style={{flex:1,
              alignSelf:"flex-start",backgroundColor:"yellow"}} key="wraps animable things">
          < Animated.View opacity={this.state.opacAnime?.
          interpolate({inputRange:[0,1],outputRange:[0,1],
            easing:Easing.out(Easing.ease)})||1}  
          style={[{position:"absolute",left:0,top:10},
            {transform:[{translateX:this.state.opacAnime?.
            interpolate({inputRange:[0,1],outputRange:[80,0],
            easing:Easing.out(Easing.exp)})||0}]}]} >
              {true&&<Text style={AppName_text_Style} >Settings</Text>}
          </Animated.View >
          {<Animated.View opacity={this.state.opacAnime?.
          interpolate({inputRange:[0,1],outputRange:[1,0],
            easing:Easing.out(Easing.poly(50))})||1} 
           style={[{position:"absolute",left:0,top:10,
           transform:[{translateY:this.state.opacAnime?.
            interpolate({inputRange:[0,1],outputRange:[0,15],
            easing:Easing.out(Easing.in(Easing. poly(15)))})||0}],
           algnSelf:"center",
           
           }]} >
              {true&&<Text style={{color:"#eee",fontSize:16,
            fontWeight:"bold"}} >YV DOWNLOADER 0.2</Text>}
          </Animated.View >}

          </View>
         


          <View  style={headerControlsStyle} >
            <TouchableOpacity onPress={this.handleOnSearchPress} hitSlop={{left:10,right:10,top:10,bottom:10}} >
            <SvgMi xmldata={st.search } height={24} width={24} color="#eee" ></SvgMi>

            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleOnMenuPress}  hitSlop={{left:10,right:10,top:10,bottom:10}} >
            <SvgMi xmldata={st.menu } height={24} width={24} color="#eee" ></SvgMi>

            </TouchableOpacity>
          
          </View>
         

         {/*  <View  style={{margin:0,backgroundColor:"#2c2c2c",paddingHorizontal:6, paddingVertical:4}} >
              <Text style={{ color: "slategrey",}} >Settings</Text>
          </View> */}
          
        </View>
      )
    }
  
  
  }
  
  
  