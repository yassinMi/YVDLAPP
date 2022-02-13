

import React, { createRef, RefObject }from"react"
import { StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle, TextStyleAndroid, ImageSourcePropType, Animated, TouchableHighlight, Easing } from 'react-native';
import SvgMi, { SvgMiProps } from "./SvgMi";


//import './ButtonPretty.less'

interface IColor {
    r:number,
    g:number,
    b:number,
}

/**
 * ratio 1 returns color1; ratio 0 returns color2
 * @param color1 
 * @param color2 
 * @param ratio 
 */
function blendColors(color1:IColor,color2:IColor,ratio:number){
    return {
        r: Math.floor ((color1.r*ratio)+(color2.r*(1-ratio))),
        g:Math.floor ((color1.g*ratio)+(color2.g*(1-ratio))),
        b:Math.floor ((color1.b*ratio)+(color2.b*(1-ratio)))
    }
}

function color_to_string (color:IColor){
    return  "#"
    + (color.r<16?"0":"")+ color.r.toString(16)
    + (color.g<16?"0":"") + color.g.toString(16)
    + (color.b<16?"0":"") + color.b.toString(16)
}

function color_from_str(string:string){
    if(!string){
        return undefined
    }
    
    let r = "55"
    let g = "55"
    let b = "55"

    

    let str = string.replace(/#(..)(..)(..)/,(m,r_,g_,b_)=>{
        r=r_; g=g_;b=b_;
        //alert(r +"/"+ g +"/" + b)
        return ("")
    })
    //r = r.replace(/00/,"0")
    return {
        r: Number("0x"+r),
        g: Number("0x"+ g),
        b: Number("0x"+ b)
    }
}
const style_rest_default :ViewStyle= {
 // flex:1,
  flexDirection:"row",
  alignItems:"center",
  alignContent:"center",
  justifyContent:"center",
  
    backgroundColor:"#1c1c1c",
    shadowColor:"#f00",
    elevation:5,
    alignSelf:"center",
    height:24,
    padding:0,
    
    
    shadowOffset:{width:40,height:5},
    shadowOpacity:800,
    shadowRadius:500,
    
    
}
const style_Text_rest : StyleProp<TextStyle>={
    color : "#aaa",
    alignSelf:"center",
    textAlign:"center",
    paddingVertical:2,
    paddingHorizontal:5,
    margin:0,

   // backgroundColor:"red"

}

export type pretty_props = {
    caption?:string;
    onClick?():void;
    onLongClick?():void;
    style?:StyleProp<ViewStyle>
    icon?:ImageSourcePropType
    forceExited?:boolean
    spanStyle?:StyleProp<TextStyle>
    forbidden?:boolean,
    wraper_pressed_color?:string,
    Wraper_rest_color?:string,
    iconChild?:boolean,
    iconMiProps?: SvgMiProps,
    animatedFeedback?: Animated.Value,
    touchableHighlightStyle?: ViewStyle,
    iconFirst?:boolean ,
    noFeedback?:boolean
}
export class ButtonPretty extends React.Component<pretty_props,pretty_props>{
    constructor(props: Readonly<pretty_props>){
        super(props)
        this.state = {
         caption : props.caption || null,
         icon : props.icon,
         forceExited: props.forceExited ,
         forbidden : props.forbidden ,
         animatedFeedback: new Animated.Value(0)  ,



        }

        this.state.animatedFeedback.addListener((vel)=>{
            this.animated_real_value = vel.value
            this.forceUpdate()
           
        })
        this.animated_real_value = 0;
        this.handleTouchStart=this.handleTouchStart.bind(this)
        this.handleTouchEnd=this.handleTouchEnd.bind(this)
        this.WrapperRef = createRef()
        this.pressed_color =  color_from_str (   props.wraper_pressed_color || "#1c7983")
        this.rest_color =color_from_str (  props.Wraper_rest_color || "#2c2c2c")
        this.style_rest = [style_rest_default, props.style]

    }

    animated_real_value:number

    WrapperRef:RefObject<View>
    style_rest:StyleProp<ViewStyle>
    color_couter_b = Number(0x53) 
    color_couter_g = Number(0x32) 
ratio_counter = 1

     
    handleTouchStart(){
        
        this.state.animatedFeedback.setValue(1)
        

    }


    rest_color:IColor
    pressed_color:IColor

    handleTouchEnd(){

      Animated.timing(this.state.animatedFeedback,{toValue:0,duration:300,useNativeDriver:false,easing:Easing.linear})
      .start()
      return
    
    }


    get_current_color(){
         return color_to_string(
            blendColors(  
                this.pressed_color,
                this.rest_color,
                this.animated_real_value))
    }


    render(){
        return (
            <TouchableHighlight  style={this.props.touchableHighlightStyle}  activeOpacity={1} 
            onPress={this.props.onClick} 
            onLongPress={this.props.onLongClick}
            onPressIn={this.handleTouchStart.bind(this) } onPressOut={this.handleTouchEnd.bind(this)}  >


            <Animated.View   ref={this.WrapperRef} 
            style={[this.style_rest,{backgroundColor:this.get_current_color(),
                flexDirection:this.props.iconFirst?"row-reverse":"row"}]} 
             >
                    { this.state.caption &&
                     <Text style={[style_Text_rest , this.props.spanStyle]}>{this.state.caption}</Text>
                    
                     
                     } 

                    { this.props.iconMiProps && <SvgMi   {  ...({ style:{height:80}, ...this.props.iconMiProps})} style={{minHeight:80}} >  </SvgMi>}
                         
                         
                          
                        

            </Animated.View>
            </TouchableHighlight>


        )
    }



    
}