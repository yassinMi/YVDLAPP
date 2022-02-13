import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";

const styles = {

    swipeContainer: {
        flex: 1,
        flexDirection: "row",
        width: 300,
        alignSelf:"stretch",
        height: 60,
        marginTop: 5
       },
       swipeItem: {
        width: 300,
        height: 60,
        backgroundColor: "#2c2c2c",
        justifyContent: "center",
       // borderWidth: 1,
        
      //  borderColor: "slategrey"
       },
       swipeItemText: {
        textAlign: "center",
        color: "#fff",
        textAlignVertical:"center",

       },
       swipeBlank: {
        width: 300,
        height: 60
       }


}


export class Swip extends Component{



    constructor(props){
        super(props)
    }


     onScroll(e) {
        e.nativeEvent.contentOffset.x === 300 && this.props.onSwipe();
       
        }

         scrollProps = {
        horizontal: true,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        scrollEventThrottle: 10,
        onScroll:this.onScroll
        };

    render(){
        return (
            <View style={styles.swipeContainer}>
            <ScrollView   {...this.scrollProps}>
           {/*  //<TouchableOpacity>
            */} 
            <View style={styles.swipeItem}>
             {this.props.children}
            </View>
           {/*  </TouchableOpacity>
            */} 
            
            <View style={styles.swipeBlank} />
            </ScrollView>
            </View>
            );
           }
    }





export default function Swipeable({ onSwipe, name }) {
 function onScroll(e) {
 e.nativeEvent.contentOffset.x === 200 && onSwipe();

 }
 const scrollProps = {
 horizontal: true,
 pagingEnabled: true,
 showsHorizontalScrollIndicator: false,
 scrollEventThrottle: 10,
 onScroll
 };
 return (
 <View style={styles.swipeContainer}>
 <ScrollView  {...scrollProps}>
{/*  //<TouchableOpacity>
 */} 
 <View style={styles.swipeItem}>
  {}
 </View>
{/*  </TouchableOpacity>
 */} 
 
 <View style={styles.swipeBlank} />
 </ScrollView>
 </View>
 );
}
Swipeable.propTypes = {
 onSwipe: PropTypes.func.isRequired,
 name: PropTypes.string.isRequired
};