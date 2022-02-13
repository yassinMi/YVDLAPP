/**
 * 08-feb-2022 ok i'm doomed officially no progress this semester.. whatever
 * since i'm running alot of tests as i learn new thngs from animaions, guesture responding and more.. 
 * i often have to keep switching betwen working on these tests and working of the actual app 
 * this part of the app will allow me to kepp both things coexist the app is there and the playground is just 
 * another page like settings page
 * 
 */

import React, { Component, createRef } from "react"
import {ARTText,TouchableHighlight,PanResponder, Animated,ScrollView,TouchableOpacity, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions } from 'react-native';
import { runInThisContext } from "vm";
import { verbo } from "./GeneralUtils";


type PlayGround_props = {}
type PlayGround_state = {}
export class PlayGround extends Component<PlayGround_props,PlayGround_state>{
    mainFLref: any;


    /**
     *
     */
    constructor(props:PlayGround_props) {
        super(props);
        this.state={};

            
        this.mydata=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((e)=>{return{key:e.toString(),v:e}})

    }

    mydata:any

    rnd(){
        verbo(Object.keys( this.mainFLref.current || {none:0}))
        let sres=this.mainFLref.current.getScrollResponder();
        //alert(Object.keys( sres))
    
       
        if(sres&&sres.scrollResponderHandleStartShouldSetResponder){
          alert("yes");
          (sres.scrollResponderHandleStartShouldSetResponder=(()=>{verbo("asked"); return true}))
    
        }
        //alert(this.mainFLref.current?._listRef?._scrollRef.getScrollResponder().scrollResponderHandleStartShouldSetResponder )
        //alert("search dev")
    }

    render(){
        return(

          <View style={{width:Dimensions.get("window").width}}>

         

            <ScrollView>

              {/*<FlatList  data={this.mydat}  ref={this.mainFLref}


     // nestedScrollEnabled={true}
      //disableScrollViewPanResponder={true}


 style={{backgroundColor:"yellow",maxHeight:250}}
renderItem={(itemm)=>{
  if(itemm.item.v==2){
    return (<GTestFlatList></GTestFlatList>)
  }
  else return (<Text  style={{color:"white",backgroundColor:"grey"}} >{(itemm.item.v.toString())} okkk </Text>)
}}
 >
  
</FlatList>*/}
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<TouchableHighlight onPress={()=>{}} underlayColor={"#861"} >
  <View style={{backgroundColor:"#222", height:300,width:"90%",
flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
<Text style={{color:"white"}}>I'm a TouchableHighlight with GTest child component:</Text>
  <GSwipeableTest>
    <View style={{height:80,backgroundColor:"#519"}}>
      <Text>Child that should swipe</Text>
    </View>
  </GSwipeableTest>
  </View>
  
</TouchableHighlight>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>
<Text style={{color:"white"}}>scroll</Text>


</ScrollView>
</View>

        )


    }

}








type GSwipeableTest_props = {

}
type GSwipeableTest_state = {}

/**
 * let's run some pan responder tets here
 */
 class GSwipeableTest extends Component<GSwipeableTest_props,GSwipeableTest_state> {
  scrllAnim: any;
   _panResponder: any;
   sc: any;
  
   _handlePanResponderEnd: any;
   innerScrollRef:any
  constructor(props:GSwipeableTest_props){
   
   
    super(props)
    this.state={
      animatedValue: new Animated.Value(0)
      
    }
    this._handlePanResponderMove=this._handlePanResponderMove.bind(this)
    this._handlePanResponderGrant=this._handlePanResponderGrant.bind(this)

    this.scrllAnim= new Animated.ValueXY()
    this.sc = new  Animated.ValueXY();
    this.innerScrollRef=createRef<ScrollView> ()
     Animated.spring(this.sc, {toValue:this.scrllAnim,useNativeDriver: false}).start()
    this._panResponder=PanResponder.create({

      onStartShouldSetPanResponder: this. _handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this. _handleMoveShouldSetPanResponder,
      onPanResponderGrant: this. _handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this. _handlePanResponderEnd,
      onPanResponderTerminate: this. _handlePanResponderEnd,
    })
  }
  capruredOffset:number

  _handlePanResponderGrant(e,gestureState){
    verbo(Object.keys( this.innerScrollRef.current.getScrollResponder().state))

    
   

   /// this.innerScrollRef.current.
  }

  _handlePanResponderMove(e,gestureState){
    //verbo(Object.keys(e.nativeEvent))
   // Animated.event([{nativeEvent:{locationY:this.scrllAnim}}])(e)
  // verbo(Object.keys(e))
  // this.innerScrollRef.current.scrollTo({y:0,x:gestureState.dx})


  }
  _handleMoveShouldSetPanResponder(){
    return true
  }
  _handleStartShouldSetPanResponder(){
    return true
  }
  render(){
    return (<Animated.View   {...this._panResponder.panHandlers} 
      style={{backgroundColor:"#266",width:180,height:200,
    flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <Animated.ScrollView
       nestedScrollEnabled={true}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: this.state.animatedValue }
            }
          }
        ],
        { useNativeDriver: true } // <-- Add this
      )} ref={this.innerScrollRef} horizontal pagingEnabled style={{backgroundColor:"#662"}}
      
      >
      <Animated.View  style={{}}>

<Text style={{color:"white"}}>GSwipeableTest wraper</Text>
{this.props.children}
</Animated.View>
<View  style={{backgroundColor:"white",width:150,height:100}} >

</View>

      </Animated.ScrollView>
      
      

    </Animated.View>)
  }

 }





















































/**
 * let's run some pan responder tets here
 */
 class GTest extends Component{
  scrllAnim: any;
   _panResponder: any;
   sc: any;
   _handlePanResponderGrant: any;
   _handlePanResponderEnd: any;

  constructor(props){
   
    super(props)
    this.state={
      
    }
    this.scrllAnim= new Animated.ValueXY()
    this.sc = new  Animated.ValueXY();
     Animated.spring(this.sc, {toValue:this.scrllAnim,useNativeDriver: false}).start()
    this._panResponder=PanResponder.create({

      onStartShouldSetPanResponder: this. _handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this. _handleMoveShouldSetPanResponder,
      onPanResponderGrant: this. _handlePanResponderGrant,
      onPanResponderMove: Animated.event(
        [null, // ignore the native event
        // extract dx and dy from gestureState
        // like 'pan.x = gestureState.dx, pan.y = gestureState.dy'
        {dx: this.scrllAnim.x, dy: this.scrllAnim.y}
      ],{useNativeDriver: false}),
      onPanResponderRelease: this. _handlePanResponderEnd,
      onPanResponderTerminate: this. _handlePanResponderEnd,
    })
  }
  

  _handlePanResponderMove(e){
    //verbo(Object.keys(e.nativeEvent))
   // Animated.event([{nativeEvent:{locationY:this.scrllAnim}}])(e)

  }
  _handleMoveShouldSetPanResponder(){
    return true
  }
  _handleStartShouldSetPanResponder(){
    return true
  }
  render(){
    return (<Animated.View   {...this._panResponder.panHandlers} style={{backgroundColor:"red",minWidth:20,height:200,
    flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <Animated.View  style={{transform:[{ translateY:this.sc.y},{ translateX:this.sc.x}]}}>

      <Text style={{color:"white"}}>GTest: Pan Responder Tests Copmonent</Text>
      </Animated.View>
      

    </Animated.View>)
  }

 }




 
/**
 * let's run some pan responder tets here
 */
 class GTestFlatList extends Component{

  flat_key
   myData: { key: number; v: number; }[];
  constructor(props){
   
    super(props)
    this.state={
      tr:0
    }

    this.flat_key= createRef<FlatList>()
    this.myData=[1,2,3,4,5,6,7,8,9,10,12,14,15,16].map((i)=>({key:i,v:i}))
   this.handleTweaks=this.handleTweaks.bind(this)

  }
  componentDidMount(){

   
    this.handleTweaks()
    //this.flat_key.current.getScrollResponder().scrollResponderHandleStartShouldSetResponder=(()=>true)
  }

  handleTweaks(){


    let rr = this.flat_key.current.getScrollResponder()

   
       alert(Object.keys( rr||{noneee:0}))
      
  }

  render(){
    return (
    <View style={{backgroundColor:"blue",maxHeight:100}}>
      {<FlatList 
      // nestedScrollEnabled={true}
      

      
     data={this.myData}  ref={this.flat_key} 
     
     renderItem={(item)=>(<TouchableOpacity onPress={()=>{}}>
<Text style={{color:"white",width:100,marginVertical:4}}
     >GTestFlatList: {item.item.v.toString()} </Text>
     </TouchableOpacity> )}
     >

    </FlatList>}

    </View>
    )
  }

 }
 

