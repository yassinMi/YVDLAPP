


import React, { createRef, RefObject, Component } from 'react'
import { StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle, TextStyleAndroid, ImageSourcePropType, ProgressBarAndroid } from 'react-native';



export type ProgressBarProps = {
   // key:any, 
    progress:{d:number,t:number},
    showPercent?:boolean,
    wraperStyle?:StyleProp<ViewStyle>,
    useNative?:boolean,
    nativeColor?:string

}

const style_ProgressBarWraper:StyleProp<ViewStyle> = {
    
alignSelf:"stretch",
height:4,

}
const style_ProgressBar:StyleProp<ViewStyle> = {
    alignSelf:"center",
    borderRadius:50,
    backgroundColor:"rgb(77, 77, 77)",
    overflow:"hidden",
    /* 
    border: solid 0px rgb(153, 153, 153),
  border-radius: 50px,
  background-color: rgb(77, 77, 77),
  overflow: hidden,
backgroundColor:"red", */
width: "95%",
height:4
}
export default class  ProgressBar extends Component<ProgressBarProps,ProgressBarProps> {

 constructor(props:ProgressBarProps){
     super(props)
     this.state = {progress: props.progress || {d:0,t:1}}
     const noderef = createRef()
     this.wraperref = createRef();

 }

 wraperref : RefObject<View>
 componentDidMount(){
  /*  let wraper = this.wraperref.current
   wraper.style.top=0
   wraper.style.right=0


      wraper.style.width='100%' */
   /*  wraper.style.width='0%'
    wraper.style.top='-40px' 
    wraper.style.right='-80px' 
   
   setTimeout(() => {
    wraper.style.top='0px'
    wraper.style.right='0px' 


       wraper.style.width='100%'
   }, 10);  */
 }

 /* @blue-cyan: #00ccff;
@orange-accent: #ffa500;
@blue-vs:#007acc; */

    render(){
        let fillerwidth = 100* this.state.progress.d/this.state.progress.t
       let percent:number|string =Math.ceil( fillerwidth*10) /10
        percent = Number.isNaN(percent)?"0%":percent+"%"
        //todo if the progressBar style was messed up go back here in the root view  style={{...style_ProgressBarWraper,...this.props.wraperStyle}} i switched from the expand to list 
        return (
            <View ref={this.wraperref} style={[style_ProgressBarWraper,this.props.wraperStyle]} > 
               {this.props.showPercent&&
                <Text>
                    {percent} 
                </Text>}
           
             {this.props.useNative? 
             
             <ProgressBarAndroid indeterminate={false} style={style_ProgressBar} styleAttr="Horizontal" progress={(this.props.progress.d/this.props.progress.t)||0} color={this.props.nativeColor||"cadetblue"} ></ProgressBarAndroid>
            
            :
            <View  style={style_ProgressBar}>
            <View  style={{width:fillerwidth+"%",  height: "100%", backgroundColor: "#00ccff"}}></View>
        </View>
            
            }
               
            </View>
        )

    }
}
