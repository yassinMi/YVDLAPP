
import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle } from 'react-native';
import CheckBox10Native from './CheckBox10Native';
import fsrn from 'react-native-fs'



type tags = {
    title:string;
    artist?:string;
    album?:string;
    genre?: string;

}

const tagEntryStyle: StyleProp<ViewStyle> = 
{
    flexDirection:"row",
alignItems:"center", 
justifyContent:"flex-start",
alignContent:"center",
marginBottom:4
}
const tagValueInputStyle: StyleProp<TextStyle> = 
{
  fontSize:11,
   color:"#cccccc",
  
   
    paddingHorizontal:4,
    paddingVertical :2,
    backgroundColor:"#1e1e1e",

}
const tagkeyStyle: StyleProp<TextStyle> =  {
    marginRight:6,
minWidth:60,
//backgroundColor:"grey",
textAlign:'right',
color:"whitesmoke",
fontSize:11,
}
export default class FfmpegOptionsPickerNative extends Component<{tags:tags},{tags:tags}>{

    constructor(props: Readonly<{tags:tags}>){
        super(props)
        this.state = {

        tags:props.tags||{title:""}

        }
        
    }



    render(){


        return (

            <View key="FfmpegOptionsPicker" style={{marginLeft:16,marginTop:16}}>
                
                <CheckBox10Native widthCaption caption="Download with ffmpeg" checked={false} />

                <CheckBox10Native widthCaption caption="Embedded thumbnail" checked={true} />
                
                <OptionSection title="metadata:" />

                <View  style={tagEntryStyle}>
                    <Text key="tag-key1" style={tagkeyStyle}>Title:</Text>
                    <TextInput key="tag-value1" style={tagValueInputStyle} value="Something Just Like This" />
                </View>

                <View key="tag-entry2" style={tagEntryStyle}>
                    <Text key="tag-key2"  style={tagkeyStyle}>Artist:</Text>
                    <TextInput key="tag-value3" style={[tagValueInputStyle, {width:100}]} value="hjghhg" />
                </View>

                <View key="tag-entry3" style={tagEntryStyle}>
                    <Text key="tag-key3"  style={tagkeyStyle}>Format:</Text>
                    <TextInput key="tag-value3" style={[tagValueInputStyle, {width:30}]} value="mp3" />
                </View>





            </View>


        )


    }


}


function OptionSection(props:{title:string}) {
    return (
        <Text style={{margin:6,fontWeight:"bold",color:'#eee',fontSize:11}}>
                   {props.title}
                </Text>
    )
    
}