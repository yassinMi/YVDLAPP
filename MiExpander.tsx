

import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase } from 'react-native';
import SvgMi, { st } from './SvgMi';



const expander_wraper : StyleProp<ViewStyle> = {

     
    flexDirection:"column",
    width:"100%",

   // backgroundColor:"maroon",
    //height:150
    

}


const expander_head : StyleProp<ViewStyle> = {
marginTop:6,
paddingVertical:4,
paddingHorizontal:4,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"flex-start",
    
    backgroundColor:"#fff0",
    
}

const expander_head_text : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  fontSize:11,
  color:'mediumseagreen',
  marginHorizontal:2,    
}



const expander_head_text_pressed : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  color:'lightseagreen',
}




const expander_content : StyleProp<ViewStyle> = {
  width:'100%',
 // minHeight:10,
  alignSelf:"center",

  //backgroundColor:'red',
  flexDirection:"column"

    
}





type MiExpanderProps = {
    tilte:string,
    expanded?:boolean
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    textStyle?:StyleProp<TextStyle>
    textStylePressed?:StyleProp<TextStyle>
}


type MiExpanderState= {
    expanded:boolean
    pressed?:boolean
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    textStyle?:StyleProp<TextStyle>
}


export default class  MiExpander extends Component<MiExpanderProps,MiExpanderState>{
    
    constructor(props:MiExpanderProps){
        super(props)
        this.state = {
            expanded : props.expanded,
            pressed : false

        }

    }

    pressIn(){
        this.setState({pressed:true})

    }
    pressOut(){
        this.setState({pressed:false})

    }
    toggle_expand(){
       
        this.setState((old)=> ({expanded:!old.expanded}))

    }

    render(){

        return <View style={[expander_wraper,this.props.style]}>

            <View style={{flexDirection:"row", alignContent:"center"}}>

               <TouchableHighlight onPressIn={this.pressIn.bind(this)}  
               onPressOut={this.pressOut.bind(this)} activeOpacity={1} 
               underlayColor='#8880' onPress={this.toggle_expand.bind(this)}>

              <View style={expander_head} >
                <Text style={[expander_head_text,this.props.textStyle,
                    (this.state.pressed && expander_head_text_pressed),(this.state.pressed&& this.props.textStylePressed)]} > {this.props.tilte} </Text>
                <SvgMi height={24} width={24} xmldata={this.state.expanded?st.expand_less:st.expand_more} color={this.props.textStyle.color}  > </SvgMi>
            </View>

            </TouchableHighlight>
            </View>

             


            {this.state.expanded &&

            <View style={[expander_content,this.props.contentStyle]}>
                {this.props.children} 
               

            </View>
            }

        </View>
        
    }
}



