

import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase } from 'react-native';
import SvgMi, { st } from './SvgMi';

//works with MiMenuItem as a title for a group of related items
//options
//
const wraper_style : StyleProp<ViewStyle> = {

     
    flexDirection:"row",
    width:"85%",
    
   
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:4,
    marginTop:8,
   // backgroundColor:"maroon",
    //height:150
    

}


const head_style : StyleProp<ViewStyle> = {

paddingVertical:0,
paddingHorizontal:12,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"center",

    
    backgroundColor:"seagreen",
    
}



const text_style : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  fontSize:12,
  color:'#666',//cool low key blue white
  
  marginHorizontal:6,    
}






  










type MiMenuGroupHeaderProps = {
    tilte:string,
   
}


type MiMenuGroupHeaderState= {
    
}


export default class  MiMenuGroupHeader extends Component<MiMenuGroupHeaderProps,MiMenuGroupHeaderState>{
    
    constructor(props:MiMenuGroupHeaderProps){
        super(props)
        this.state = {
           

        }

        
    }


   

     

    render(){

        return <View   style={[wraper_style,this.props.style]}>

            <View style={{flexDirection:"column",  width:"100%", alignContent:"center"}}>

             

              <View style={{flexDirection:"column",  width:"100%", alignContent:"center"}} >
             
                <Text style={[text_style]} > {this.props.tilte} </Text>
                
               
              </View>
              <View style={[{height:0.8,backgroundColor:"#222", marginTop:4, marginHorizontal:4}]} >
             
            
           </View>
              
            </View>
        </View>
        
    }
}



