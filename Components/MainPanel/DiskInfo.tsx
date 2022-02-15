import React from 'react'
import { ButtonPretty } from '../Common/ButtonPretty'
import { StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, StyleProp, ViewStyle, TextStyle } from 'react-native';
import SvgMi, { st } from '../Common/SvgMi';




export interface IDiskInfo {
    available?:number;
    used?:number;
}
const LOW_DISK = 52428800 // 50mb

const DiskInfoCWraperStyle:StyleProp<ViewStyle> = 
{
    

marginLeft:0,marginTop:0,
backgroundColor:"#1c1c1c00",
position:"relative",

//:-60,
alignSelf:"stretch",


marginStart:0,

padding:3,
paddingTop:0,
//width:,
display:"flex", flexDirection:"row", justifyContent:"space-around" 

, 

//borderColor: "blue",
//borderWidth :2
}

const entryStyle:StyleProp<ViewStyle> = 
{display:"flex",
//backgroundColor:"grey",

flexDirection:"row",
alignItems:"center", 
justifyContent:"flex-start",
alignContent:"center",
margin:4,
alignSelf:"stretch",
// width:"fit-content",
marginRight:10

}
const valueStyle:StyleProp<TextStyle> = 
{
  fontSize: 11,
   color:"#eee",
    padding:4,
   // backgroundColor:"#1c1c1c",
    backgroundColor:"transparent",
    //width:"fit-content"
}

const warning_modifier:StyleProp<TextStyle> ={
    color:"red",
    textShadowColor:'#ff000080',
    textShadowRadius:4
}
const keyStyle:StyleProp<TextStyle> = {
    marginRight:6,
    color:"#bbbbbb",
    fontSize:11

}


export default class DiskInfoC extends React.Component<{diskInfo:IDiskInfo},{diskInfo:IDiskInfo}>{

    constructor(props: Readonly<{diskInfo:IDiskInfo}>){
        super(props)
        this.state = {

            diskInfo:props.diskInfo ||{}

        }
        
    }



    isLow():boolean{
        return this.props.diskInfo.available<LOW_DISK
    }

    render(){


        return (

            [<View  key="diskInfo" style={DiskInfoCWraperStyle}>

                
                <View  style={entryStyle}>
                    <Text  style={keyStyle}>● Used Space:</Text>
                    <Text  style={valueStyle}  >{sizeFormatter (this.props.diskInfo.used)}</Text>
                </View>

                <View  style={entryStyle}>
                    <Text  style={keyStyle}>● Available Space:</Text>
                    <Text  style={valueStyle/* , ...(this.isLow()?warning_modifier:{}) */}  >{sizeFormatter (this.props.diskInfo.available)}</Text>
                </View>


                

            </View>,

            <DiskAlert key="diskAlert" diskInfo={this.props.diskInfo} > </DiskAlert>

]
        )


    }


}






































const diskAlertWraperStyle:StyleProp<ViewStyle> = 
{
    
backgroundColor:"#2c2c2c",
borderRadius: 6,

//:-60,
alignSelf:"center",
width:"95%",
position:"absolute",
bottom:8,



padding:3,
paddingTop:0,
//width:,
display:"flex", flexDirection:"row", justifyContent:"flex-start" 

}



type DiskAlertProps = {
    diskInfo: IDiskInfo
}

export  class DiskAlert extends React.Component<DiskAlertProps,DiskAlertProps>{

    constructor(props: Readonly<DiskAlertProps>){
        super(props)
        this.state = {

            diskInfo:props.diskInfo ||{}

        }
        
    }

    render(){
        return (

            <View  style={diskAlertWraperStyle}>

              <SvgMi xmldata={st.info} color="goldenrod" style={{alignSelf:"center", marginLeft:4,width:22,height:22}}  width={26} height={26} ></SvgMi>

                
                <View style={{
                    marginLeft:4,
                    marginRight:8,
                    height:"80%",
                    width:1,
                    backgroundColor:"#444",
                    alignSelf:"center",
                }}
                ></View>
                <View  style={entryStyle}>
                    <Text  style={keyStyle}>low space:</Text>
                    <Text  style={valueStyle}  >{sizeFormatter (this.props.diskInfo.available)}</Text>
                </View>

                <Text style={{
                    color:"deepskyblue" , fontSize:12, alignSelf:"center"
                }} 
                >Cleaner</Text>

                
          <ButtonPretty  style={{marginRight:4,elevation:0, right:4, position:"absolute"}} iconChild iconMiProps={{color:"#666", xmldata:st.cancel, height:26, width:26}}  ></ButtonPretty>

                

            </View>


        )


    }


}

















function sizeFormatter(size:number){
    return size>1073741824? (Math.ceil( size/107374182.4)/10).toString()+" Gb": 
     size>1048576? (Math.ceil( size/104857.6)/10).toString()+" Mb": 
    size >1024? (Math.ceil( size/102.4)/10).toString()+"Kb": size + " b"
}