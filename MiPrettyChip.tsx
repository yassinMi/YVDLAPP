

import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase } from 'react-native';
import SvgMi, { st } from './SvgMi';

//this is called a chip but it's really a radioBox, 
//with more of a checkbox functionanlity : doesnt take care of the excusive selection logic, do it yourself through the hosting parent

const wraper_style : StyleProp<ViewStyle> = {

     
    flexDirection:"column",
   //   width:"100%",
   
   // backgroundColor:"maroon",
    //height:150
    

}


const head_style : StyleProp<ViewStyle> = {
marginTop:6,
paddingVertical:16,
paddingHorizontal:16,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"flex-start",
    
    backgroundColor:"#fff0",
    
}

const head_pressed_style : StyleProp<ViewStyle> = {
    marginTop:6,
    paddingVertical:16,
    paddingHorizontal:16,
    
        
        flexDirection:"row",
        alignItems:"center",
        alignSelf:"flex-start",
        backgroundColor:"#2c2c2c"
        
    }

const text_style : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  fontSize:14,
  color:'#dfefff',//cool low key blue white
  
  marginHorizontal:2,    
}





const text_selected_style : StyleProp<TextStyle> = {
    //fontFamily:"sans-serif-light",
    color:'lightseagreen',
  }

  
  










type MiPrettyChipProps = {
    tilte:string,
    isSelected?:boolean
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    textStyle?:StyleProp<TextStyle>
    textStylePressed?:StyleProp<TextStyle>
    selectedRadioIx:number
    ix:number
    changeSelected : (ix)=>void
}


type MiPrettyChipState= {
    isSelected:boolean
    pressed?:boolean
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    textStyle?:StyleProp<TextStyle>
}


export default class  MiPrettyChip extends Component<MiPrettyChipProps,MiPrettyChipState>{
    
    constructor(props:MiPrettyChipProps){
        super(props)
        this.state = {
            isSelected : props.ix===props.selectedRadioIx,
            pressed : false

        }

        this.selectMe=this.selectMe.bind(this)
    }


    amIselected(){
        return(this.props.selectedRadioIx===this.props.ix)
      }
      selectMe(){
        this.props.changeSelected(this.props.ix)
      }

    pressIn(){
        this.setState({pressed:true})

    }
    pressOut(){
        this.setState({pressed:false})

    }

   
     

    render(){

        return <View   style={[wraper_style,this.props.style]}>

            <View style={{flexDirection:"row", alignContent:"center"}}>

               <TouchableHighlight onPressIn={this.pressIn.bind(this)}  
               onPressOut={this.pressOut.bind(this)} activeOpacity={1} 
               underlayColor='#8880' onPress={()=>  this.selectMe()}>

              <View style={[head_style,(this.state.pressed&&head_pressed_style)]} >
              <SvgMi height={20} width={20} xmldata={this.amIselected()?st.radio_button_checked:st.radio_button_unchecked} color={this.amIselected()?"#00c0c0":"#dfefff"}  > </SvgMi>

                <Text style={[text_style,this.props.textStyle,
                      ,(this.state.pressed&& this.props.textStylePressed)]} > {this.props.tilte} </Text>
                
            </View>

            </TouchableHighlight>
            </View>
        </View>
        
    }
}



