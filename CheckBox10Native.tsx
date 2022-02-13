
import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle } from 'react-native';
import SvgMi, { st } from './SvgMi';
import fsrn from 'react-native-fs'

const default_props:ICheckBox10_props = {
    disabled:false,
    checked:true,
    size : 14,
    color: "cyan",
    icon: st.yass_chk_small,
    widthCaption:false,
   
    
}

export interface ICheckBox10_props {
    disabled?:boolean;
    checked:boolean;
    size? : number;
    color?: string;
    icon?: string;
    caption?:string;
    widthCaption?:boolean;
    onChange?(new_value:boolean):void;
}

const cb10WraperStyle: StyleProp<ViewStyle> = 
{
paddingVertical:2, 
paddingHorizontal:2,


display:"flex", flexDirection:"row",
 alignContent:"center" ,
justifyContent:"flex-start",


}

const cb10FramStyle:StyleProp<ViewStyle> = 
{
//backgroundColor:"grey",
backgroundColor:"#1c1c1c",
//transition: "all ease 200ms",
alignItems:"center", 
justifyContent:"center",

alignContent:"center",
marginVertical:2, 	
marginHorizontal:4,
 width:14,
height:14,
marginRight:0,

borderRadius:3,
borderWidth:1,
borderColor:"#666666",
//border:"solid 1px #007a99",

}
const cb10FramStyle_checked_modifier: StyleProp<ViewStyle>= {
    //boxShadow:"0 0 2px #0498bd",
    borderWidth:1,
    borderColor:"#0498bd",

}
const cb10FramStyle_disabled_modifier:StyleProp<ViewStyle>= {
    //boxShadow:"none",
    borderWidth:1,
    borderColor:"#333333",


}
const cb10ImgStyle:StyleProp<ViewStyle> = 
{
   
   
    //color:"#cccccc",
  
    paddingVertical:2, 
paddingHorizontal:4,
    backgroundColor:"transparent",
    width:2, height:4,
    minWidth:9,
    minHeight:9,
    
    position:"relative",
    bottom:0.5, left:0
}
const cb10ImgStyle_disabled:StyleProp<ViewStyle> = 
{
   

    //color:"#cccccc",
    
    paddingVertical:2, 
paddingHorizontal:4,
    backgroundColor:"transparent",
    width:4,
    minWidth:9,
    minHeight:9,
    
    position:"relative",
    bottom:0.5, left:0
}



const cb10CaptionView:StyleProp<ViewStyle> = 
{
   

   
    paddingVertical:2, 
paddingHorizontal:4,
    backgroundColor:"transparent",

}

const cb10CaptionText:StyleProp<TextStyle> = 
{
   

    marginRight:4,
   fontSize:11,
    color:"#ccc",
    backgroundColor:"transparent",
    
}


export default class CheckBox10Native extends Component<ICheckBox10_props,ICheckBox10_props>{

    constructor(props: Readonly<ICheckBox10_props>){
        super(props)
        this.state = {...default_props, ... props }
            

     this.handleClick = this.handleClick.bind(this)
        
    }



    handleClick(){

        if(this.state.disabled){
            return
        }
       
        this.setState(state=>{return {checked:!state.checked}},()=>{
            if(this.props.onChange){
                this.props.onChange(this.state.checked)
            }
            
        })

    
    }


   
    render(){


        return (

            <View key="cb10-wraper" style={cb10WraperStyle}  onTouchStart={this.handleClick}>

                 {this.state.widthCaption &&
                 <View key="cb10-caption" style={cb10CaptionView}>
                      <Text style={cb10CaptionText}>{this.state.caption} </Text>

                 </View>
                }
                <View key="cb10-fram" style={ [cb10FramStyle, this.state.checked
                && cb10FramStyle_checked_modifier, this.state.disabled
                && cb10FramStyle_disabled_modifier] }>

                   { this.state.checked && <SvgMi color={this.state.disabled?"#666": "#0498bd"} width={10} height={10}  xmldata={this.state.icon} 
                    style={(this.state.disabled===true)? cb10ImgStyle_disabled:  cb10ImgStyle}
                   key = {this.state.disabled?"iconOff":"Icon-blue-cyan-filter"}
                   
                   />}
                </View>

                


                

            </View>


        )


    }


}

