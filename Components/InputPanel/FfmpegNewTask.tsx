

import React, { Component, createRef, RefObject } from 'react';
import { Animated, StyleSheet, Text, View, Platform,StatusBar, TextInput, FlatList, Image, Modal, Switch,AsyncStorage, Alert, AlertButton, ProgressBarAndroid, ColorPropType, VirtualizedList, Picker, Dimensions, PermissionsAndroid, StyleProp, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedbackComponent, TouchableNativeFeedbackComponent, TouchableHighlightBase, ImageBackground, ImageBackgroundComponent, ImageSourcePropType, Group, ViewPagerAndroid, SliderComponent, Slider } from 'react-native';
import SvgMi, { st } from './SvgMi';
import { ButtonPretty } from './ButtonPretty';
import { verbo } from './ghost-yvdl';
import RNShare from 'react-native-share';
import RNPicker from "react-native-document-picker"
import fn from 'react-native-fs'
import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg';
import RNFetchBolb from "rn-fetch-blob"

const DEV_EXPO = false

const FTIP_wraper : StyleProp<ViewStyle> = {

     
    flexDirection:"column",
    width:"100%",

   // backgroundColor:"maroon",
    //height:150
    

}


const FTIP_head : StyleProp<ViewStyle> = {
marginTop:6,
paddingVertical:4,
paddingHorizontal:4,

    
    flexDirection:"row",
    alignItems:"center",
    alignSelf:"flex-start",
    
    backgroundColor:"#fff0",
    
}

const FTIP_head_text : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  fontSize:12,
  color:'mediumseagreen',

  marginHorizontal:2,  
  marginVertical:5,  


}



const FTIP_head_text_pressed : StyleProp<TextStyle> = {
  //fontFamily:"sans-serif-light",
  color:'lightseagreen',
}




const FTIP_content : StyleProp<ViewStyle> = {
  width:'100%',
 // minHeight:10,
  alignSelf:"center",

  //backgroundColor:'red',
  flexDirection:"column"

    
}



type ffmpegInput = "audio"|"video"|"image"|"url"


type ffmpegOutput =  "audio"|"video"|"image"
    


type FfmpegPreset = {
    name:string
    command:string,
    inputs:Array<ffmpegInput>
    outputs:Array<ffmpegOutput>
}

type FfmpegTaskInputPanelProps = {
    presetslist: Array<FfmpegPreset>,
    
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    
}


type FfmpegTaskInputPanelState= {
    contentStyle?:StyleProp<ViewStyle>
    inputs:Array<{name:string,path:string}>
    args:Array<any>
    outputs:Array<{uri:string}>
    showFullSize:boolean
    watchMode: boolean
   
}


export default class  FfmpegTaskInputPanel extends Component<FfmpegTaskInputPanelProps,FfmpegTaskInputPanelState>{
    outputImageRef: RefObject<FtipImageOutput>;
    isCycleRunning: boolean;
    last_args: Array<any>;
    toggleWtchMode(val){

        this.setState({watchMode:val})
        if(val){
            this.run()
        }

    }
    
    constructor(props:FfmpegTaskInputPanelProps){
        super(props)
        this.state = {
            inputs : [],
            args  : [""],
            outputs : [],
            showFullSize:false,
            watchMode:false

           
        }

        this.args = [0.7,12,0.5]
        this.outputImageRef= createRef()
        this.isCycleRunning=false
        RNFFmpegConfig.disableLogs()
    }



   async startCycle(){
       if(this.isCycleRunning){
           return
       }
       this.isCycleRunning = true
       verbo("startcicle  here")


        while(this.has_inputs_or_args_change()&&this.state.watchMode){
            await this.run()

        }

        verbo("startcicle  quiting")

        
        this.isCycleRunning = false
    }
    has_inputs_or_args_change() {
        verbo(" has_inputs_or_args_change here")

        RNFFmpegConfig.registerNewFFmpegPipe().then(t=>{
            
        })

        RNFFmpegConfig.writeToPipe( )


       let out=  !(this.args.concat([]) === this.last_args)
       this.last_args= this.args.concat([])
       verbo(" has_inputs_or_args_change returing " + out)

       return out
    }


    /**
     * replaces every $i1 , $arg4 .. in the command string with the passed 
     * args , and inputs and runs the resolved ffmpeg command
     * @param command 
     * @param args 
     */
    run(command?, inputs=this.state.inputs, args=this.args,output_img?){
        verbo("run here")

    
        // arg0: ratio, arg1: blur, arg2: darkness,
        // arg3: i_height , arg4:i_width

        return new Promise((resolve,reject)=>{


          output_img = "/storage/emulated/0/YVDL/" + "mi-edited-"+ inputs[0].name

let blury_sides = '-y -i b.jpg -vf "split=3 [main][r][l]; color=c=black@$arg2:s=$arg4*$arg0x$arg3, split [buff][black_]; [l]  crop=iw/2:ih:iw/2:0,avgblur=sizeX=$arg1 [cl]; [r] crop=iw/2:ih:0:0,avgblur=sizeX=$arg1 [cr];   [buff][cr] overlay=0:0 [m];[m][cl] overlay=W-w:0 [sides] ; [sides][black_] overlay=0:0 [sides_dark]; [sides_dark][main]  overlay=(W-w)/2:0 " -frames:v 1 $o0'
     let blury_sides_no_darkness = ` -y -i $i0 -vf "split=4 [main][main2][r][l]; [main2] scale=w=iw*$arg0:h=ih, colorlevels=rimax=0:gimax=0:bimax=0:aimax=0.5  , split [buff][black_]; [l]  avgblur=sizeX=$arg1 [cl]; [r] avgblur=sizeX=$arg1 [cr];   [buff][cr] overlay=0:0 [m];[m][cl] overlay=W-w:0 [sides] ; [sides][black_] overlay=w:h [sides_dark]; [sides_dark][main]  overlay=(W-w)/2:0 " -frames:v 1 $o0`  


let comm =  '-i $i0 -vf "avgblur=sizeX=$arg1" darkness=$arg2 ratio=$arg0 ' + output_img
       let resolved = blury_sides_no_darkness.replace(/\$(arg|i|o)(\d*)/g , (m,arg_i,index)=>{
          // alert(arg_i)
           let ix = Number(index)
           let replacement = 
           (arg_i === "i")?"'"+inputs[ix].path+"'" : 
           (arg_i === "arg")?args[ix]+"":
           (arg_i === "o")?output_img+"":
           "error"
           return replacement
       })


       verbo(resolved)

       if(DEV_EXPO){
           resolve("dev_expo")
       }

       RNFFmpeg.execute(resolved).then(()=>{
        this.setState({outputs:[ { uri: "file://"+ output_img}]})
        this.outputImageRef.current.setState({selected:{ uri: "file://"+ output_img}})
        this.outputImageRef.current.forceUpdate()
        verbo("outouts[0] is: file://"+ output_img )
        resolve("ok")
        verbo("run resolved ok")
        
})
        .catch((err)=>{
            verbo(err.message||err)
            reject("ffmpeg failed")
        })

    })
    }
   

    args:Array<any>

    render(){

        return <View style={[FTIP_wraper,this.props.style]}>

            {this.state.showFullSize&& < View  onTouchStart={(()=>(this.setState({showFullSize:false}))).bind(this)}
            style={{
                minWidth:Dimensions.get('window').width,
                //backgroundColor:"yellow",
                        height:320,
                        
                        
                        flexDirection:"column",
                        alignContent:"center",
                        alignItems:"center",
                        justifyContent:"flex-start"


            }}
            
            >

                <Image  source={this.outputImageRef.current.props.selected} style={ {
                        width:Dimensions.get('window').width,
                        height:300,
                       
                        resizeMode:"contain",

                    }
                }></Image>
            </View>}

{ 
            <View key="inputs_go_outputs" style={{flexDirection:"row",overflow:"visible",
            opacity:this.state.showFullSize?0:1,
            scaleY:this.state.showFullSize?0:1,
           // backgroundColor:"red",
            alignItems:"center",justifyContent:"space-between",paddingHorizontal:12}}>
            <View key="inputs"> 
               <FlatList
               horizontal
               data={this.props.presetslist[0].inputs}
                renderItem = {({item,index})=>{
                    return   <FtipImageInput onSelection={ ((info)=> this.setState({inputs:[info]})).bind(this)} style={{marginHorizontal:4}} title={"input #" + index}></FtipImageInput>
                }}
               >

               </FlatList>
              
               
           </View>


             <View key="goButton">
                 <ButtonPretty
                 onLongClick={(()=>this.toggleWtchMode(true)).bind(this)}
                  
                 //Wraper_rest_color="#444"
                 style={{borderRadius:400,width:30,height:30}}
                 iconMiProps = {{xmldata:st.label_important, color:this.state.watchMode?"firebrick":"#eee" }}
                 touchableHighlightStyle={{borderRadius:400}}
                 onClick={ (()=>{ this.state.watchMode?this.toggleWtchMode(false):this.run() }).bind(this)}
                 
                 >

                 </ButtonPretty>
                 
                 
                 </View> 
             <View key='outputs' style={{overflow:"visible",flexDirection:"column",alignContent:"center",
            
            alignItems:"center",
           // backgroundColor:"orange",
            }}> 
             <FtipImageOutput ref={this.outputImageRef} onShowFull={(()=>{this.setState({showFullSize:true})}).bind(this)} 
             selected={this.state.outputs[0]}  style={{marginHorizontal:4,
             overflow:"visible" ,

            
            }} title={"Output" }></FtipImageOutput>
             </View> 


            </View>

}

            <Text style={{color:"#ccc", marginLeft:12,fontSize:12,marginTop:12,marginBottom:6}}>
                Args:
            </Text>
            <View key="ARGS" style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",paddingHorizontal:12}}>
            


              
            <SliderInput caption="Ratio" min={1} max={2} onChange={((v)=>{this.args[0] = v ; this.state.watchMode&&this.startCycle()  }).bind(this)}   />
            <SliderInput caption="Blur"  min={0} max={80} onChange={((v)=>{this.args[1] = v ;  this.state.watchMode&&this.startCycle() }).bind(this)}  />
            <SliderInput caption="Darkness"  min={0} max={1} onChange={((v)=>{this.args[2] = v ;  this.state.watchMode&&this.startCycle() }).bind(this)}   />



            </View>




         
           


        </View>
        
    }
}






























type FtipImageinputProps = {
    title:string
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    onSelection : (info:{name:string,path:string})=>void
    
}


type FtipImageinputState= {

     selected:ImageSourcePropType
   
}



export  class  FtipImageInput extends Component<FtipImageinputProps,FtipImageinputState>{
    selectPic () {

        if(DEV_EXPO){


            this.setState({selected:{uri:"file://"+"/storage/emulated/0/YVDL/b.jpg"}})
                this.props.onSelection({name:"b",path:"/storage/emulated/0/YVDL/b.jpg"})

                return
        }
        
       RNPicker.pick({"copyTo":"documentDirectory","mode":"open","type":RNPicker.types.images}).then(res=>{
            alert(res.fileCopyUri + "   " )
            verbo(res.fileCopyUri)
            verbo( res.uri)
            verbo(res.name)
            verbo(res.type)
            
            
            RNFetchBolb.fs.stat(res.uri).then((stats)=>{
                verbo( stats.path)
                this.setState({selected:{uri:"file://"+stats.path}})
                verbo("set state: " + "file://"+stats.path)
                this.props.onSelection({name:res.name,path:stats.path})

            })
            
       })

    } 
    
    constructor(props:FtipImageinputProps){
        super(props)
        this.state = {

            
              selected:require("./assets/dummy/task2.jpg")
           
        }

    }

    pressIn(){
       

    }
    pressOut(){
      

    }
    toggle_expand(){
       
       

    }

    render(){

        return <View  style={[{
            flexDirection:"column",
            justifyContent:"flex-start",
            //backgroundColor:"red"


        },this.props.style]} >

           

             
                 
                 <ImageBackground 
                 imageStyle={{
                     resizeMode:"contain",
                     width:60,
                     borderRadius:6,
                     
                    
                    }}
                 
                 style={{width:60,
                    elevation:4,
                 
                 }} source={this.state.selected}  width={60} >
                 <View style  = {{
                     width:60,height:60,borderColor:"white",
                     borderWidth:0.5,

                     
                     borderRadius:6,
                     flexDirection:"row",
                     alignItems:"center",justifyContent:"center",alignContent:"center"
                     
                 }} >
                      <View>
                          <TouchableHighlight onPress={this.selectPic.bind(this)} activeOpacity={0.7} underlayColor="white" style={{borderRadius:40,padding:5}} >
                          <SvgMi xmldata={st.image} color="white" ></SvgMi>
                          </TouchableHighlight>
                 </View>
                  
                 </View>
                 </ImageBackground>



                <Text style={{
                    //backgroundColor:"green",
                    color:"#aaa", fontSize:11,height:16, width:60,textAlign:"center"
                }} >{this.props.title}</Text>
                 


             

            

        </View>
        
    }
}
































type FtipImageOutputProps = {
    title:string
    contentStyle?:StyleProp<ViewStyle>
    style?:StyleProp<ViewStyle>
    selected:ImageSourcePropType
    onShowFull:()=>void

    
}


type FtipImageOutputState= {

    selected:ImageSourcePropType
    augmented:boolean
     
   
}



export  class  FtipImageOutput extends Component<FtipImageOutputProps,FtipImageOutputState>{
    showPic () {

this.props.onShowFull()
    } 
    
    constructor(props:FtipImageOutputProps){
        super(props)
        this.state = {

              augmented:false,
             selected: null
           
        }

    }

    pressIn(){
       

    }
    pressOut(){
      

    }
    toggle_expand(){
       
       

    }

    render(){

        return <View  style={[{
            flexDirection:"column",
            justifyContent:"flex-start",
           // backgroundColor:"green"



        },this.props.style]} >


           
           

             
                 
                 <ImageBackground 
                 imageStyle={{
                    resizeMode:"contain",

                     width:60,
                     borderRadius:6,
                     
                    
                    }}
                 
                 style={{width:60,
                    elevation:4,
                 
                 }} source={this.state.selected}  width={60} >
                 <View style  = {{
                     width:60,height:60,borderColor:"white",
                     borderWidth:0.5,

                     
                     borderRadius:6,
                     flexDirection:"row",
                     alignItems:"center",justifyContent:"center",alignContent:"center"
                     
                 }} >
                      <View>
                          <TouchableHighlight onPress={this.showPic.bind(this)} activeOpacity={0.7} underlayColor="white" style={{borderRadius:40,padding:5}} >
                          <SvgMi xmldata={st.search} color="white" ></SvgMi>
                          </TouchableHighlight>
                 </View>
                  
                 </View>
                 </ImageBackground>



                <Text style={{
                    //backgroundColor:"green",
                    color:"#aaa", fontSize:11,height:16, width:60,textAlign:"center"
                }} >{this.props.title}</Text>
                 


             

            

        </View>
        
    }
}










/**
 * onChanes is called continuously as the user grags, and it's range is min and max,
 */
type SliderInputProps ={
    caption:string
    max:number,
    min:number
    curv?:"linear"|"exp",
    onChange : (v:number)=>void
}
class SliderInput extends Component<SliderInputProps>{
   
    constructor(props){
        super(props)
    }

    onChange (value: number) {
        this.props.onChange(((this.props.max-this.props.min)*value)+this.props.min)
     }
    render(){
        return (
            <View style={{height:100,width:40, marginLeft:12,
                flexDirection:"column",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
                <View style={{borderRadius:100, height:80,width:30, backgroundColor:"#8881",
                flexDirection:"column",justifyContent:"center",alignContent:"center",alignItems:"center"}}>
                <Slider onValueChange={this.onChange.bind(this)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  
                style={{ height:20, width:80 , rotation:-90}}>
                </Slider>
                </View>
                <Text style={{
                    //backgroundColor:"green",
                    color:"#aaa", fontSize:11,height:16, width:60,textAlign:"center"
                }} >{this.props.caption}</Text>
  
             
             </View>
        )
    }
}





export class FfmpegPresetPicker extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <View key ="wraper" style={{ borderWidth:0.5,borderColor:"#333", 
            flexDirection:"column",height:60, overflow:"hidden", elevation:4, borderRadius:4, width:"100%",backgroundColor:"#131313"}}>
                <View key='head'  style={{ borderTopLeftRadius:4,borderTopRightRadius:4, paddingHorizontal:4, alignItems:"center",alignContent:"center", justifyContent:"space-between", flexDirection:"row",height:20,backgroundColor:"#0005"}}  >
                    <Text style={{color:"#999",fontSize:10}} >Preset:</Text>
                    <View style={{flexDirection:"row",alignItems:"center",alignContent:"center",}}>

                    <SvgMi xmldata={st.chevron_left} color="cadetblue" >

                    </SvgMi>

                 
                 <Text style={{color:"cadetblue",fontSize:11,textAlignVertical:"center",height:18}} >pixelize</Text>

                 

                 <SvgMi xmldata={st.chevron_right} color="cadetblue" >

                    </SvgMi>

                    </View>
                   

                </View>
                <View key="chosed_preset" >

                </View>
            </View>
        )
    }
}