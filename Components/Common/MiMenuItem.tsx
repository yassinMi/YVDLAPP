

import { prependOnceListener } from 'process';
import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase } from 'react-native';
import { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import SvgMi, { st } from './SvgMi';

//this thing aims to clone the one in blokada app: the settings items that either contain direct input or lead yo to a right slide screen that has more
//options
//
const wraper_style : StyleProp<ViewStyle> = {

     
    
    width:"85%",
    
    marginVertical:4,
   
    height:42,
    flexDirection:"row",
   
    borderRadius:4,
    
    
    paddingHorizontal:6,
   
    backgroundColor:"#1c1c1c",
    //backgroundColor:"#1c1c1c",
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center"

   // backgroundColor:"maroon",
    //height:150
    

}




const head_style : StyleProp<ViewStyle> = {

paddingVertical:0,
paddingHorizontal:12,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"center",
                         //another justifySelf hing that i deleted "start"
    marginLeft:4,

    
    backgroundColor:"seagreen",
    
}


const valueBox_style : StyleProp<ViewStyle> = {

    paddingVertical:0,
    paddingHorizontal:12,
    
        
        flexDirection:"row",
        alignItems:"center",
        alignSelf:"center",
    
        
        backgroundColor:"seagreen",
        
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
  fontSize:11,
  color:'#eee',//cool low key blue white
  
  marginHorizontal:2,    
}

const text_disabled_style : StyleProp<TextStyle> = {
    
    color:'#444',//cool low key blue white
    
  }
const value_text_style : StyleProp<TextStyle> = {
    //fontFamily:"sans-serif-light",
    fontSize:12,
    color:'#dfefff',//cool low key blue white
    
    marginHorizontal:4,    
  }




const text_selected_style : StyleProp<TextStyle> = {
    //fontFamily:"sans-serif-light",
    color:'lightseagreen',
  }

  
  










type MiMenuItemProps = {
    tilte:string,
    isParent?:boolean,//parent has diff behavior: shows an arrow and doesnt have values, 
    /**
     * this works equivalent to setting the selectedIndex except it has additional step for indexOF
     */
    selected?:string,
    selectedIndex?:number
    isDisabled?:boolean,
    values:string[],
    iconXmldata:any,
    style?:StyleProp<ViewStyle>
    onSelectionChanged? : (value)=>void
    onParentPress? : ()=>void //only parent type sires this when the body i pressed
    
}


type MiMenuItemState= {
    selected:string
    selectedIndex:number
}


export default class  MiMenuItem extends Component<MiMenuItemProps,MiMenuItemState>{
    
    constructor(props:MiMenuItemProps){
        super(props)
        this.state = {
           selected: props.selected || props.values[0],
           selectedIndex: (props.selected&&props.values.indexOf(props.selected))|| props.selectedIndex || 0
        }

        this.handlePress=this.handlePress.bind(this)
        this.handlePerentPress=this.handlePerentPress.bind(this)
    }


   

    pressIn(){
        //this.setState({pressed:true})

    }
    pressOut(){
        //this.setState({pressed:false})

    }

   
    getSelectedValue(){
        return this.props.values[this.state.selectedIndex]
    }
     handlePress(){
       

        if(this.props.isDisabled)return



        let newstateIndex = (this.state.selectedIndex+1)%this.props.values.length

        requestAnimationFrame(() => {
            this.props.onSelectionChanged&&this.props.onSelectionChanged(this.props.values [newstateIndex])

        });
        this.setState((old)=>{return {selectedIndex:newstateIndex}})
        //alert("ok"+this.state.selectedIndex)
     }
     handlePerentPress(){

       
        if(this.props.isDisabled) return
        if(!this.props.isParent) return

        //alert("parent click")
      if(!this.props.onParentPress) return
        this.props.onParentPress()
      
     }

    render(){

        return <TouchableHighlight underlayColor='#8880'  onPress={this.props.isParent?this.handlePerentPress:null}  style={[wraper_style,this.props.style,(this.props.isDisabled&&{backgroundColor:"#111",opacity:0.8})]}>
           
               
            <View style={{flexDirection:"row",flex:1,}}>

                <View style={{backgroundColor:"#0000",flex:1, flexDirection:"row", alignItems:"center"}} >
                    <SvgMi height={32} width={32} xmldata={this.props.iconXmldata} color={(this.props.isDisabled)?"#444":"#eee"}  > </SvgMi>
                    <Text style={[text_style,(this.props.isDisabled&&text_disabled_style)]} > {this.props.tilte} </Text>
                </View>

                {(!this.props.isParent)&&
                <View key={"values section"} style={{backgroundColor:"#0000",flexDirection:"row", alignItems:"center"}} >
                
                <TouchableOpacity activeOpacity={this.props.isDisabled?1:0.4} /* underlayColor='#8880'*/  onPress={!this.props.isDisabled?this.handlePress:undefined} style={{ backgroundColor:"#0000" ,  justifyContent:"center", height:"100%"}}>
                    <View key={"values section"} style={{backgroundColor:"#0000",flexDirection:"row", height:"70%", alignSelf:"center", alignItems:"center"}} >
                        <View key={"separator"} style={{backgroundColor:"#555", marginHorizontal:4, width:1, height:"80%", }} />
                        <Text style={[value_text_style,{color:"#0e8"},(this.props.isDisabled&&text_disabled_style)]} > {this.getSelectedValue()} </Text>
                    </View>
                </TouchableOpacity>  
                </View>  
               }
                {this.props.isParent&&<SvgMi height={22} style={{alignSelf:"center"}} width={22} xmldata={st.chevron_right} color={false?"#00c0c0":"#eee"}  > </SvgMi>
                  }
            </View>
           
        </TouchableHighlight>
        
    }
}



