



import React, { Component, createRef } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, StyleProp, ViewStyle } from 'react-native';


import DiskInfo from "./DiskInfo"
import TaskCard from "./TaskCard"
 import Swipeable, { Swip } from './Swipeable';
import { ButtonPretty } from './ButtonPretty';
import ProgressBar from './ProgressBar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Svg from 'react-native-svg';
import SvgMi, { st } from './SvgMi';
import { PRIMARY, Palette } from './theme';




type YTabsProps = {

  onChange : (ix :number )=>void
    selected:number
    /**distributes this over all child items 02rev  */
    itemsSelectedColor?:string
    itemsSelectedTextColor?:string


}


type YTabsState = {
  selected:number
}



const YtabsStyle : StyleProp<ViewStyle> = {
  margin:0, 
  padding: 4,
  paddingHorizontal:8,
  
  alignSelf:"stretch",
  maxHeight:80,
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between",
  borderBottomColor : "#555",
  paddingVertical:1,
  //borderBottomWidth:1,

  //backgroundColor:"#222",
  
 } 



const text_BasicLight_style  = {
  color: "#ffffff",

  
}



 export default class YTabs extends Component<YTabsProps,YTabsState>{
    constructor(props){
      super (props)
  
      this.state={
  
  
        selected: props.selected || 0
      }
  
      this.changeSelected=this.changeSelected.bind(this)
      
    }
  
  
    changeSelected(new_ix){
      //this.props.onChange(new_ix) // so no need to set state here, cuz the parent will update me 
      this.setState({selected:new_ix})
  

      requestAnimationFrame(()=>{//02rev ui enhancment wraping this 
        this.props.onChange(new_ix) // so no need to set state here, cuz the parent will update me 
  
      })
      
    }
    render(){
      return (
  
      <View style = {YtabsStyle} > 
         
  
         <ItemY  ix={0} changeSelected={this.changeSelected}  isDisabled={false} selected={this.state.selected} title="Facebook" iconXmlData={st.facebook_icon} icon  selectedColor={this.props.itemsSelectedColor} selectedTextColor={this.props.itemsSelectedTextColor} ></ItemY> 
         <ItemY ix={1} changeSelected={this.changeSelected} isDisabled={false}  selected={this.state.selected}  title="Youtube" iconXmlData={st.yvdl_youtube_64} icon selectedColor={this.props.itemsSelectedColor} selectedTextColor={this.props.itemsSelectedTextColor} ></ItemY> 
         <ItemY ix={2} changeSelected={this.changeSelected} isDisabled={true}  selected={this.state.selected} title="Instagram" iconXmlData={st.yvdl_instagram_64} icon selectedColor={this.props.itemsSelectedColor} selectedTextColor={this.props.itemsSelectedTextColor} ></ItemY> 
         <ItemY ix={3} changeSelected={this.changeSelected} isDisabled={true}  selected={this.state.selected} title="URL" iconXmlData={st.add_link} icon  selectedColor={this.props.itemsSelectedColor} selectedTextColor={this.props.itemsSelectedTextColor} ></ItemY> 
         
       
       </View>
      )
    }
  
  
  }
  





















const defaulSelectedColor = Palette.Ytabs
const defaulSelectedTextColor = Palette.YtabsText


  type ItemYProps = {
    changeSelected : (ix)=>void
    isSelected?:boolean
    isDisabled:boolean //add n the 31-jan-22 update to enhance ui
    selected : number
    ix:number
    icon ?: boolean // dont use
    iconXmlData ?: string
    title ?:string,
    selectedColor?:string
    selectedTextColor?:string

  }
  type ItemYState = {
    isSelected:boolean
    isDisabled:boolean //add n the 31-jan-22 update to enhance ui
  }
  class ItemY extends Component<ItemYProps,ItemYState>{
    constructor(props:ItemYProps){
      super (props)
      let dummy_props={
        label:"Facebook",
        icon: "path/to/svg",
        isSelected : true,
        ix:"  ",
       // changeSelected() 
      }
      this.state={
        isSelected : props.ix===props.selected,
        isEnabled: props.isDisabled
      }
  
      this.selectMe=this.selectMe.bind(this)
      
    }

    
  
    amIselected(){
      return(this.props.selected===this.props.ix)
    }
    selectMe(){
      this.props.changeSelected(this.props.ix)
    }
    render(){
      return (
      <View onTouchStart={()=> this.props.isDisabled|| this.selectMe()} style = {{margin:0,
        
        padding: 4,
        minHeight:60,
        minWidth:45,
        borderBottomColor: this.amIselected() ? this.props.selectedColor||defaulSelectedColor :"transparent",
       // flex:1,
        alignContent:"flex-end",
    
        borderBottomWidth: 1.5,
        flexDirection:"column"
       } } >
         { this.props.icon &&
          <View style={{minHeight:32,minWidth:32,flex:1,alignContent:"center",justifyContent:"center",alignItems:"center"}}>
            {/* <Image source={this.props.icon} style={{ width:30,height:30,resizeMode:"contain",
            shadowColor:"#f00", ... (this.amIselected()? { tintColor: "orange"} : {tintColor:"#fff"} ) }}></Image> */}
         
         <SvgMi xmldata={this.props.iconXmlData} color={ this.props.isDisabled?"#444444": this.amIselected()?this.props.selectedColor||defaulSelectedColor:"white"} ></SvgMi>
         
         </View>}
         <View>
            <Text style={{...text_BasicLight_style,color:this.props.isDisabled?"#444444":this.amIselected()?this.props.selectedTextColor||defaulSelectedTextColor:"#dddddd",textAlign:"center"}}>{this.props.title}</Text>
  
         </View>
       
       
       </View>
      )
    }
  
  
  }
  
  