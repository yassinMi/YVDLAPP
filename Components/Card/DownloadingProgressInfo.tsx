
import React, { createRef, RefObject, Component } from 'react'

import { ButtonPretty } from './ButtonPretty'

import { StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle, TextStyleAndroid, ImageSourcePropType } from 'react-native';
import { IDownloadProg } from './ghost-yvdl';
import { st } from './SvgMi';




const downloadProgressInfo_Style:StyleProp<ViewStyle> = {
    width: "100%",
    flex:1 ,
    flexDirection:"row",
    justifyContent: "space-between" ,
   
    paddingHorizontal:4,
    paddingVertical:2 , 
    marginBottom: 2 ,
    alignContent: "center",
     alignItems: "center" ,
    alignSelf: "stretch" ,
}

const speed_style = {
    fontSize: 11 ,
    minWidth: 80 ,
    //background-color: red;
    
   // color: "#0df259" ,
    color:'lightseagreen',
    marginLeft: 6 ,
}
const percent_style ={
    minWidth: 50,
    fontWeight:"bold",
   // background-color: red;
    
    fontSize: 12 ,
    color: "white" ,
}
const pretty_preset  = {
    spanStyle:{fontSize:11,color:"#eee"},
   
     iconChild :true,
    style:{flexDirection:"row-reverse",elevation:2,borderWidth:0.5,borderColor:"#444", marginRight:-2,} ,
    Wraper_rest_color:"#242424" ,
    wraper_pressed_color:"#444444"
    

}
type DownloadingProgressInfo_props={
    key?:any
download_prog:IDownloadProg;
onCancel?():void



}

type DownloadingProgressInfo_state={
    
download_prog:IDownloadProg;
speed:number;
onCancel():void


}
export default class DownloadingProgressInfo extends Component<DownloadingProgressInfo_props,DownloadingProgressInfo_state>{ // it showns speed:     |    percent     | cancelButton
    constructor(props: DownloadingProgressInfo_props){
        super(props)
        this.state={
            speed: 1 ,
            download_prog:props.download_prog,
           
            onCancel:props.onCancel

        }
        
        this.last_download_prog ={d:0,t:props.download_prog.t},
        this.timer =  setInterval(() => {
            
                let new_speed= (this.state.download_prog.d-this.last_download_prog.d)
                //console.log("state.download_prog.d:" + this.props.download_prog.d)
                //console.log("state.last_download_pro.d:" +this.last_download_prog.d)
                //console.log("new speed:" + new_speed)
                this.last_download_prog=this.props.download_prog
                this.setState({ speed:Math.floor(new_speed/1024)})
         

        }, 1000);
    }
    last_download_prog:IDownloadProg
    timer:any
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    
    render(){
        return(
            <View  style = {downloadProgressInfo_Style} >
               <Text  style={speed_style} >{this.state.speed} Kb/s</Text>
               <Text style={percent_style} >{Math.ceil (100*(this.props.download_prog.d/this.props.download_prog.t)) || "0"} %</Text>
               {/* <button className='cancelButton'>Cancel</button> */}
               <ButtonPretty {...pretty_preset} onClick={this.props.onCancel}  caption="Cancel" 
                    iconMiProps={{xmldata: st.cancel}} 
                    > 
                    </ButtonPretty>
               <ButtonPretty  />
            </View>
        )
    }
}