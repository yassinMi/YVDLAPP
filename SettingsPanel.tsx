




import React, { Component, createRef } from 'react';
import { Animated, StyleSheet, Text, View, ScrollView, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, ViewStyle, StyleProp, Clipboard, TextStyle } from 'react-native';

//
import DiskInfo from "./DiskInfo"
import TaskCard from "./TaskCard"
 import Swipeable, { Swip } from './Swipeable';
import { ButtonPretty } from './ButtonPretty';
import ProgressBar from './ProgressBar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Svg from 'react-native-svg';
import SvgMi, { st } from './SvgMi';
import { OptionsPanel } from './InputPanel';
import { Palette } from './theme';
import MiMenuItem from './MiMenuItem';
import MiMenuGroupHeader from './MiMenuGroupHeader';

import { IPostInfo , AppSettings} from './rev02types';



export const HalfSection : StyleProp<ViewStyle> ={
  //height:80,
  paddingLeft:6,
  paddingRight:6,
  
  paddingTop:6,
  flex:1,
  //alignSelf:"stretch",
  flexDirection:"column",
  alignContent:"flex-start",
  //backgroundColor:"#3c3c3c",
  maxWidth:"50%",
  alignItems:"flex-start",
  justifyContent:"flex-start"


}


export const twoHalfsWraper : StyleProp<ViewStyle> ={
  
    marginTop:0,
    paddingVertical:4,
    alignSelf:"flex-start", flexDirection:"row",
    alignItems:"flex-start",
    justifyContent:"flex-start",
    //backgroundColor:"#322",
   
}




const  style_InputPanel : ViewStyle ={

  
  zIndex:20,

 // maxHeight: 200,   // so important cuz the whole MainPannel thing should be free to shrink as the InputPenel shrinks, so this sibling shouldn't be hiding it, and leting the content overflows here is no problem 
  flexDirection: "column",

  justifyContent: "flex-start",
//alignSelf: "stretch",
alignItems: "center",
backgroundColor: "#1c1c1c",
marginBottom:20,
paddingBottom:10

  //borderWidth: 1,
 //borderStyle: "dashed",//
//borderColor: "darkslategray"
}

 


const text_style : TextStyle= {
  fontSize:11, backgroundColor:"#222c",
  width:140,paddingHorizontal:4,color:"#999",
  height:22,
}



type SettingsPanelProps={
  onSettingsChanged:(settings:AppSettings)=>void
  currentAppSettings:AppSettings
  style?:any //used for transfering animated values such as opac from parent as the user scrols

}
type SettingsPanelState={
  

}

export default class SettingsPanel extends Component<SettingsPanelProps,SettingsPanelState>{
    constructor(props){
      super(props)
    }

    
   
    render(){
      return(
        <Animated.View  style={[{...style_InputPanel,backgroundColor:"transparent", width:Dimensions.get("window").width, },this.props.style]}>
  
        
  
       <View style={{minHeight:400,
       //backgroundColor:"firebrick",
       zIndex:45,
       overflow:"visible",
      // height:400,
       flexDirection:"column",
       alignSelf:'flex-start',
       
      
       
      }}>

     
        
       

   
        <ScrollView style={{ flexDirection:"column",  paddingVertical:2,backgroundColor:null,minWidth:"100%"} }
        
        contentContainerStyle={{alignItems:"center",}}
        >
      

        <MiMenuGroupHeader tilte={"General"}   />

        
       <MiMenuItem  tilte={"Use mobile mode (low quality)"}  values={["Yes","No"]}
       selected={(this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode?"Yes":"No"} iconXmldata={st.phoneAndroid} 
       isDisabled={false}
       onSelectionChanged={((val)=>
       this.props.onSettingsChanged({Legacy:{UseLegacyMode:val=="Yes"?true:false}}as AppSettings)).bind(this)}
       selectedIndex={1}
        isParent={false} 
        />

        <MiMenuItem tilte={"Use Auto-fill"} selected={(this.props.currentAppSettings as AppSettings).General.EnableAutoFill?"Yes":"No"} values={["Yes","No"]}   iconXmldata={st.autoFix} 
        isDisabled={(this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true}
         onSelectionChanged={((val)=>
          this.props.onSettingsChanged({General:{EnableAutoFill:val=="Yes"?true:false}}as AppSettings)).bind(this)}
        />


        <MiMenuGroupHeader tilte={"Auto-fill settings"}  />



       <MiMenuItem  tilte={"Video quality"} values={["Highest","720p","420p","Lowest"]} iconXmldata={true? st.hd:st.moviesLocal} 
       selected={(this.props.currentAppSettings as AppSettings).AutoFillSettings.PreferedVideoQuality}
       onSelectionChanged={((val)=>this.props.onSettingsChanged({AutoFillSettings:{PreferedVideoQuality:val}}as AppSettings)).bind(this)} 
       isDisabled={((this.props.currentAppSettings as AppSettings).General.EnableAutoFill==false)
      ||((this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true)}
         />
       
       
       <MiMenuItem  tilte={"Thumbnail"} values={["Yes","No"]} iconXmldata={st.image} 
       selected={(this.props.currentAppSettings as AppSettings).AutoFillSettings.EnableThumbnail?"Yes":"No"} 
       isDisabled={((this.props.currentAppSettings as AppSettings).General.EnableAutoFill==false)
        ||((this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true)}
       onSelectionChanged={null} />
      
      
       <MiMenuItem  tilte={"File name source"} values={["og-title","description","title" ]}  iconXmldata={st.titleFelds}
       selected={(this.props.currentAppSettings as AppSettings).AutoFillSettings.PreferedNameSource}
       isDisabled={((this.props.currentAppSettings as AppSettings).General.EnableAutoFill==false)
        ||((this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true)}
        
        onSelectionChanged={((val)=>
          this.props.onSettingsChanged({AutoFillSettings:{PreferedNameSource:val}}as AppSettings)).bind(this)}
     
          />


       <MiMenuItem  tilte={"Output location"} values={["Downloads","YVDLFolder"]} iconXmldata={st.folder} 
       selected={(this.props.currentAppSettings as AppSettings).AutoFillSettings.OutputLocation}
       isDisabled={false}
       onSelectionChanged={((val)=>
        this.props.onSettingsChanged({AutoFillSettings:{OutputLocation :val=="Downloads"?"Downloads":"YVDLFolder"}}as AppSettings)).bind(this)}
       />
      

      


      
       <MiMenuGroupHeader tilte={"Advanced"}   />


<MiMenuItem tilte={"Download streams first"} values={["Yes","No"]} isParent={false} iconXmldata={st.saveAlt} 
  isDisabled={(this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true}
  onSelectionChanged={null}
  />

<MiMenuItem tilte={"Video codec"} values={["Copy","h264"]} isParent={false} iconXmldata={st.tune} 
  isDisabled={(this.props.currentAppSettings as AppSettings).Legacy.UseLegacyMode==true}
  onSelectionChanged={null}
  />

      </ScrollView>

     { false&&  <View style={{alignSelf:"flex-start",marginLeft:20,flexDirection:"row",alignContent:"center",alignItems:"center"}}>
  
  <Text style={{color:"#aaa", marginRight:4, fontSize:12}}>Audio format: </Text>

  


</View>}


            {false&&<View style={[twoHalfsWraper, { marginTop: 24 }]}>
            <View style={HalfSection}>
                <ButtonPretty Wraper_rest_color={Palette.appBackground}
                  iconFirst
                  spanStyle={{ fontFamily: "sans-serif-light", color: "white" }}
                  touchableHighlightStyle={{ alignSelf: "flex-start", marginLeft: 8, marginBottom: 11 }}
                  style={{ elevation: 0, flexDirection: "row-reverse" }} iconChild
                  iconMiProps={{ xmldata: st.mi_cleaner, color: "steelblue" }} caption="Cleaner">
                </ButtonPretty>
              </View>
              <View style={HalfSection}>
              </View>
              
            </View>}
       
  
            </View>
        
        
        </Animated.View> 
      )
    }
  }
  
  
  