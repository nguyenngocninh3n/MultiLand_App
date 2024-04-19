import { useState } from "react"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore'
import PostHeader from "../components/PostHeader";
import PostFooter from "../components/PostFooter";


export default Search =({navigation}) => {
    const [value, setValue] = useState();
    const [data, setData] = useState(null)

    const getData = () => {
        let arr = []
        firestore().collection('posts').orderBy('timestamp','desc').onSnapshot((res)=>{
            if(res != null) {
                res.forEach(documentSnapshot => {
                    let str = documentSnapshot.data().content;
                    console.log('gia tri str: ',str)
                    if(str.includes(value))
                        arr.push(documentSnapshot.data())

                    });
               console.log('res co ton tai:',res)
            } else console.log('gia tri rong')
        })
        console.log('gia tri data:',data)
        setData(arr)
    }
    const GetImage =({source}) => {
        if(source=="" || source == null) {   return;  }
        else {   return (   <Image source={{uri:source}} style={styles.postImg} />  )  }
      }

    return (
       <View>
            <View style={{flexDirection:'column',alignItems:'flex-end',marginRight:20, marginBottom:20}}>
                    <View style={{flexDirection:'row',  alignItems:'flex-start', borderBottomColor:'#ccc',borderBottomWidth:1}}>
                        <View style={{width:'90%',marginRight:10}}>
                            <TextInput value={value} onChangeText={setValue}  multiline={true} placeholder='Tìm kiếm...' />
                        </View>
                        <TouchableOpacity onPress={()=> {setValue('')}} >
                            <Text style={{fontSize:20, paddingTop:10,fontWeight:'700'}}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={getData} style={{backgroundColor:'#0af',padding:10, marginTop:10}} ><Text style={{color:'#fff'}} >Tìm kiếm</Text></TouchableOpacity>
            </View>
            <View >
                <FlatList data={data}
                horizontal={false}
                renderItem={({item})=> (
                    <View >
                    <PostHeader data={item} navigation={navigation} />
                    <GetImage source={item.image}/>
                    <PostFooter data={item} navigation={navigation} />
                    
                </View>        
                )}
                >

                </FlatList>
            </View>
       </View>
    )
}
const styles = StyleSheet.create({
    postImg: {
        width: '90%',
        margin:20,
        height: 250,
      },
})