
import  { Component, RefObject, createRef } from 'react'
import { StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle, TextStyleAndroid, ImageSourcePropType, ImageStyle, TouchableHighlight, Share, Linking } from 'react-native';

import React from 'react'
import TaskCard from './TaskCard'
import RNShare from 'react-native-share';
import fn from 'react-native-fs'
import {RNGetIntentMIUtils} from 'react-native-get-intent-mi';
import { ButtonPretty, pretty_props } from '../Common/ButtonPretty';
import { verbo } from '../../Services/GeneralUtils';
import SvgMi, { st } from '../Common/SvgMi';


const DEV_EXPO = false




//#region styles
    const  style_Getter : StyleProp<ViewStyle> = {
        flex : 1 ,
        flexDirection:"row",
        alignContent: "center" ,
        alignSelf: "stretch" ,
        width:"100%",
        justifyContent:"space-between" ,
        alignItems: "center" ,
        // backgroundColor: "#555" ,
        height: 60 ,
    } 
    const style_get : StyleProp<ViewStyle> = {
        alignSelf:"center",
        //backgroundColor:"green"
    }
    const style_further8actions : StyleProp<ViewStyle>= {
        //  backgroundColor:"#446",  
        width:"28%",
        maxWidth:"40%",
        flexDirection:"row",
        alignContent: "center" ,
        alignSelf: "center" ,
        justifyContent: "space-between" ,
        alignItems: "center" ,
    }
    const style_single_icon : StyleProp<ViewStyle> = {
       // margin: 0  ,// 6px ,
        marginHorizontal : 4,
        height:24,
        width:24,
        flexDirection:'row',
        alignContent:'center',
        justifyContent:"center",
        alignItems:"center"
       // backgroundColor:"#444" 
    }
    const style_single_icon__img : StyleProp<ImageStyle> = {
            width: 18 ,
            height: 18 ,
        }
    const style_tricky_place_holder : StyleProp<ViewStyle> = {
        width: 2 ,
        height: 2 ,
      // backgroundColor: "red" ,
    }


    const pretty_preset: pretty_props  = {
        spanStyle:{fontSize:12,color:"#eee"},
         iconChild :true,
        style:{flexDirection:"row-reverse",elevation:2,borderWidth:0.5,borderColor:"#444"} ,
        Wraper_rest_color:"#242424" ,
        wraper_pressed_color:"#444444"

    }






//#endregion styles






    type Getter_props = {
        parenttc:TaskCard
        taskid: number
        mp3: boolean
        mp3output: string
        mp4output:string
        output02rev:string
        onDeletePressed:()=>void
    }
    type Getter_state = {
        parenttc:TaskCard
        taskid: number
        mp3: boolean
        mp3output: string
        mp4output:string
    }
    



/** 
 * Getter is now Opener, but we'll keep it Getter for a while
 */
export default class Getter extends Component<Getter_props,Getter_state>{

    constructor(props: Readonly<Getter_props>){
        super(props)  

        this.hndlDeletePress=this.hndlDeletePress.bind(this)
        
    }

    
   share(){
        if(DEV_EXPO){
            alert("dev_expo mode")
            return
        }
        RNShare.open({url:"file://"+this.props.mp4output})
    }

   play(){
        if(DEV_EXPO){
            alert("play not suported")
            return
        }
        alert("play not suported")
   }

   openAs(){
       RNGetIntentMIUtils.startOpenAction(this.props.output02rev,null,false).then(()=>{
           verbo("done opening")
        }).catch(err=>{
           verbo(err)
       })
       //Linking.sendIntent("android.intent.action.VIEW",[{key:"data",value:""+this.props.output02rev}])
    //alert("openAs not suported")

   }
/**
 * 
 * this is not the right place for this.. shifting it to the tascCard through the onDeletePressed handle 02rev
 */
   remove(){


    

       if(DEV_EXPO){
           this.props.parenttc.deleteMe()
           return
       }
       fn.unlink(this.props.mp4output).then(()=>{
           this.props.parenttc.deleteMe()
           alert("deleted  file: "+this.props.mp4output)
       })
       .catch(()=>{
           this.props.parenttc.deleteMe()
           alert("couldn't delete:" + this.props.mp4output)
       })
   }

    hndlDeletePress(){
        requestAnimationFrame(() => {
            this.props.onDeletePressed&&this.props.onDeletePressed()
            });
      
   }


    render(){
        return (

            <View style={style_Getter}>

                <View style={style_tricky_place_holder} ></View>
                
                <View  style={style_get}>
                    <ButtonPretty  {...pretty_preset} onClick={this.openAs.bind(this)} 
                     iconMiProps={{xmldata:st.open_in_new}}  
                     caption="Open as">  
                    </ButtonPretty>
                </View>

                { this.props.mp3 && 
                 <View    style={style_get}>
                    <ButtonPretty {...pretty_preset} onClick={this.play.bind(this)}
                    iconMiProps={{xmldata: st.play_arrow}} 
                    caption="Play"> 
                    </ButtonPretty>
                </View> }
                 
                <View style={style_further8actions}>

                    <TouchableHighlight  activeOpacity={0.7} underlayColor="#444" 
                    hitSlop={{right:20,left:20,bottom:20,top:20}}
                    onPress={this.share.bind(this)} style={[style_single_icon,{borderRadius:40}] }>
                        <SvgMi color="#eee"  xmldata={st.share}   ></SvgMi>
                    </TouchableHighlight> 

                    <TouchableHighlight activeOpacity={0.7} underlayColor="#444" 
                    hitSlop={{right:20,left:20,bottom:20,top:20}}
                    onPress={this.hndlDeletePress} style={[style_single_icon,{borderRadius:40}] }>
                        <SvgMi color="#eee"  xmldata={st.delete}   ></SvgMi>
                    </TouchableHighlight> 

                   

                    <View style={style_single_icon}   >

                    </View>
                </View>

            </View>
        )
    }
}

























const Stages_style:StyleProp<ViewStyle> = {
    flex:1 ,
    alignContent: "center" ,
    flexDirection: "row",
    justifyContent: "flex-start", 
    alignItems: "center" ,
   
}
    const separator : StyleProp<ImageStyle> = {
        marginRight: 2 ,
        width: 14 ,
        height: 14 ,     
    }
    const highlighted :StyleProp<TextStyle> = {
        textAlign: "center" ,
        marginRight: 2 ,
        color: "#ffa500" ,
        fontSize: 10 ,
        fontFamily:"sans-serif-light",
    }
    const regular :StyleProp<TextStyle> = {
        textAlign: "center" ,
        color: "#ffffff46" ,
        marginRight: 2 ,
        fontSize: 10 ,
        fontFamily:"sans-serif-light",
    }









export function Stage(props: { stages: any; highlighted: any }) {
    let list_of_stages = props.stages
    let current_highlighted = props.highlighted
    let list_of_elements = []

  const arrow = <SvgMi style={{maxWidth:14,maxHeight:14,alignSelf:"center"}}  xmldata={st.double_arrow} color='#eee'  key="double_arrow" ></SvgMi>

  for (let i = 0; i < list_of_stages.length; i++) {
      const element = <Text key={i} style={(i==current_highlighted)?highlighted:regular}> {list_of_stages[i]} </Text>
      list_of_elements[list_of_elements.length] = element
      if(i <(list_of_stages.length -1 )    ){
          list_of_elements[list_of_elements.length] = arrow
      }
  }

  return( 
      <View style={Stages_style}>
          {list_of_elements}
      </View>
  )
  
}
