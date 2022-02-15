





import React, { Component, createRef, LegacyRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View,ScrollView, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, StyleProp, ViewStyle } from 'react-native';



import DiskInfo from "./DiskInfo"
import TaskCard from "../Card/TaskCard"
 import Swipeable, { Swip } from '../Card/Swipeable';
import { ButtonPretty } from '../Common/ButtonPretty';
import ProgressBar from '../Card/ProgressBar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Svg from 'react-native-svg';
import SvgMi, { st } from '../Common/SvgMi';
import { YVDL_Task } from '../../Services/ghost-yvdl';
import {AppSettings, IOutputLocation, IPreferedNameSource, IPreferedQualty} from '../../Services/rev02types';


//


const dummy_post_info = {VideoSize:12651875,Title:"TaskCard-Native Title ",
ThumbnailUrl:"https://scontent.frba1-1.fna.fbcdn.net/v/t15.5256-10/p206x206/102353212_2939020122833296_8690144097513182762_n.jpg?_nc_cat=106&ccb=2&_nc_sid=ad6a45&_nc_ohc=9daEwd-wzcMAX9lI0CN&_nc_ht=scontent.frba1-1.fna&oh=6089747005712bcefc9a90c928f08f70&oe=5FFE141E",
VideoUrl:"https://video.frba1-1.fna.fbcdn.net/v/t42.9040-2/103376159_254424665645952_6464892085859354543_n.mp4?_nc_cat=111&ccb=2&_nc_sid=985c63&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=5krpvrELOCoAX8JNQD_&rl=300&vabr=102&_nc_ht=video.frba1-1.fna&oh=51506abf78b83b2156b4780566427009&oe=5FD786B3"}


const  output_container: StyleProp<ViewStyle> = {
  //flex:1,
  flexDirection:"column",
  alignSelf:"stretch",
  paddingHorizontal:5,
 
  //backgroundColor: "yellow",
  //alignContent:"center",
  maxHeight:340,
  paddingBottom:12,
  marginBottom:12,
}

type outputPropsType= {
  core_tasks:YVDL_Task[]
  sortBy: "newFirst"|"oldFirst"|"nrwFirst-pinDownloadings"|'oldFirst-pinDownloadings'


}
export default class Output extends Component<outputPropsType,outputPropsType>{
    flatlistref: RefObject<FlatList<YVDL_Task>>

    constructor(props:outputPropsType){
      super (props)
      this.state={
        core_tasks:props.core_tasks,
        sortBy : props.sortBy
      }
      this.addTask=this.addTask.bind(this)
      this.flatlistref = createRef()
    }

    isNoTasks(){
      return false
    }
    addTask(task_core:YVDL_Task){
      if(this.state.core_tasks.length>=5)
      {
        this.setState( (old)=> { 
          
          let concated =[task_core] .concat(old.core_tasks)

          return {core_tasks:concated}
  
        } )
      return}

     // alert("output level adding: " +task_core.my_id)
      this.setState( (old)=> { 
        let concated =[task_core] .concat(old.core_tasks)
        return {core_tasks:concated}

      } )
    }

    render(){

     
      
  
      if(this.isNoTasks()){
        return <Text style={{ borderColor: "blue",
        borderWidth :2, alignSelf:"stretch", textAlign:"center",color:"#1c1c1c"}}>No Tasks To Show</Text>
      }
      let tasks_cc = this.state.core_tasks.length || 0
      return (
  //<ScrollView   contentContainerStyle={{ justifyContent:"flex-start",}} style={[output_container]}>
  <View    style={[output_container,{justifyContent:"flex-start"}]}>
    
  
  
  {tasks_cc>0&&
  <OutputControls></OutputControls>
  }
  
  
 <FlatList  ref= {this.flatlistref}
  //inverted
  //invertStickyHeaders
  //inverted
  //stickyHeaderIndices={[2]}
     alwaysBounceVertical
     bouncesZoom
     fadingEdgeLength={10}
     initialNumToRender={12}
     
     
    indicatorStyle="black"
    ListFooterComponentStyle={{backgroundColor:"#882c2c"}}
    overScrollMode="always"
    showsVerticalScrollIndicator
    progressViewOffset={0}
    removeClippedSubviews
    windowSize={100}
    
    scrollToOverflowEnabled
    
    style={{paddingTop:0, }}
    contentContainerStyle={{flexDirection:"column"}}
        data = {this.state.core_tasks}
        renderItem = {({item,index})=>(
        
       
          <TaskCard
          uid={"deprecated"}
          key={item.key}
          parentnode = {this.flatlistref}
          deleteHandler = {((id)=>{this.setState (old=>({core_tasks:old.core_tasks.filter(tsk=>{return (tsk.my_id!==id) })}))  }).bind(this)}
          core= {item}
          wraperStyle={{marginVertical:4}}
          download_prog={ item.download_prog || {d:21,t:65}}
          status= { item.status}
          converting_prog= {item.conversion_prog}
        
          post_info={ item.post_info || dummy_post_info}
          post_info_v02={ item.post_info_v02 || undefined}
          
    
    
  
       // all these props should be wrapped in a single "core" prop and le the taskCard deal with it's core object

      id={item.my_id || 88888}
      mp3={item.mp3conversion}

        
        
        
        >
        </TaskCard>
  
  
  
     )}
        >
            


        </FlatList>
  
       
    
  </View>
 
      
  
      )
    }
  
  
  }
  
  












  

class OutputControls extends Component{
  constructor(props){
    super (props)
  }

  render(){
    return (

      <View style = {{margin:0,
        marginTop:4,
        paddingHorizontal:10,
        
        alignSelf:"stretch",
        maxHeight:30,
        minHeight:30,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
     // backgroundColor:"blue", 
       } } > 
         


        <View style={{
          flex:1, flexDirection:"row", alignItems:"center", alignContent:"center"
        }}>
        <SvgMi xmldata={st.sort} color="#ccc" ></SvgMi>
        <Text style={{color:"#ccc", marginLeft:4, fontFamily:"sans-serif-light",  fontSize:12, alignSelf:"center"}}>remove missing</Text>


          </View>        

         

       
       </View>
    )
  }


}


