

import React, { Component, createRef, RefObject, ReactNode, ReactElement } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase, SectionList } from 'react-native';
import SvgMi, { st } from './SvgMi';



const Swipeable_wraper : StyleProp<ViewStyle> = {

     
    flexDirection:"column",
    width:"100%",

   // backgroundColor:"maroon",
    //height:150
    

}


const Swipeable_head : StyleProp<ViewStyle> = {
marginTop:6,
paddingVertical:4,
paddingHorizontal:4,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"flex-start",
    
    backgroundColor:"#fff0",
    
}

const Swipeable_head_text : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  fontSize:11,
  color:'mediumseagreen',
  marginHorizontal:2,    
}



const Swipeable_head_text_pressed : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  color:'lightseagreen',
}




const Swipeable_content : StyleProp<ViewStyle> = {
  width:'100%',
 // minHeight:10,
  alignSelf:"center",

  //backgroundColor:'red',
  flexDirection:"column"

    
}





type MiSwipeableProps = {
   
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    
    //children?: ReactElement<View> //was merly a type trick now i used react's oficcial @type
    onSwipe : ()=>void,
    child_width?:number,
    onLongPress:()=>void
}


type MiSwipeableState= {
   
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    textStyle?:StyleProp<TextStyle>
}


export default class  MiSwipeable extends Component<MiSwipeableProps,MiSwipeableState>{
    
    constructor(props:MiSwipeableProps){
        super(props)
        this.state = {
           
          

        }
        this.hndlOnLongPress=this.hndlOnLongPress.bind(this)

    }

    pressIn(){

    }
    pressOut(){

    }
    toggle_expand(){
       

    }

    hndlOnLongPress(){

        this.props.onLongPress&&this.props.onLongPress()
    }

    render(){


        let child_width = this.props.child_width || this.props.children.props.style.width
        let child = this.props.children
        let placeHolder = <Animated.View style = {{
        width :2*child_width , height:50, backgroundColor:"transparent"
        }}></Animated.View>

        return <TouchableOpacity activeOpacity={0.7} delayLongPress={200}   onLongPress={this.hndlOnLongPress} propagateSwipe={true} style={[Swipeable_wraper,this.props.style]}>

        <FlatList 



disableScrollViewPanResponder={true}
    nestedScrollEnabled={true}

    //endog tweaks


        onScroll = { (e)=> {
            e.nativeEvent.contentOffset.x === (200) && this.props.onSwipe();
           
            }}

            onMomentumScrollEnd={(e)=> {
                e.nativeEvent.contentOffset.x > (child_width) &&   this.props.onSwipe();
               
                }}
        overScrollMode="never"

        showsHorizontalScrollIndicator={true}
        style={{ zIndex:100 }}
        contentContainerStyle={{   }}
        horizontal
        
        initialScrollIndex={0}
        
        //pagingEnabled
        snapToOffsets={[0,3*child_width]}

        data= {[{key:"1",p:"child"},{key:"2",p:"placeHolder"}]}
        renderItem = {({item})=>{
        return (
        (item.p=="child")?
        this.props.children 
        //<Text style={{width:Dimensions.get("window").width}} >gj1</Text>

        :(item.p=="placeHolder")?
        placeHolder
        : null)
    }}

    >
    </FlatList> 

           



        </TouchableOpacity>
        
    }
}



