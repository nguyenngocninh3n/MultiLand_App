import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View,Image } from "react-native"
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { SafeAreaView } from "react-native-safe-area-context"
import { TouchableHighlight } from "react-native-gesture-handler"


export default FriendScreen = ({navigation}) => {
  const [followings, setFollowings] = useState([])
  const [suggests, setSuggests] = useState([])
  const [users, setUsers] = useState([])

  const getData = async () => {
    let arr_id = [];
    // get followings data
    await firestore().collection('followings').doc(auth().currentUser.uid).get().then(documentSnapshot => {
                  if(documentSnapshot.exists) {
                    let arr = [];
                    let temp = documentSnapshot.data().data;
                    temp.forEach(value => {
                      value.ref.get().then(res=> { 
                        arr.push(res.data());
                        arr_id.push(res.data().uid);
                    })
                  })
                    setFollowings(arr)
                  }
              })
      //get User data
     await firestore().collection('users').get().then(documentSnapshot=> {
          if(documentSnapshot != null) {
            let arr_temp = [];
              documentSnapshot.forEach(item => {
                  if(arr_id.indexOf(item.data().uid)  == -1 ) {
                    arr_temp.push(item.data());
                  }
              })
              setSuggests(arr_temp)
          }
      });
    
 }

  useEffect( ()=> {
    getData();
  },[])

  const GetImage =({source}) => {
    if(source=="") {  return; }
    else {  return ( <Image source={{uri:source}}  style={styles.avatar} />  )  }
  }

  const GetItem = ({item}) => {
    return  (
    <View style={styles.item_container}>
      <View style={styles.item_avatar}>
          <GetImage source={item.avatar} />
      </View>
      <TouchableHighlight style={styles.item_name} underlayColor='#eee' onPress={()=>{}}>
          <Text style={styles.name}>{item.name}</Text>
      </TouchableHighlight>
    </View>
    )
  }


  return (
    <View>
      <Text onPress={()=>{console.log('followings: ',followings); console.log('sugguests: ',suggests)}}>FriendScreen</Text>
      <SafeAreaView style={styles.container_area}>
          <FlatList data={suggests} horizontal={false}
              renderItem={({item}) =>(
                <GetItem item ={item} />
              )} />
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({

    container_area: {
     
      width:'100%',
      height:'90%',

    },

    item_container: {
      flexDirection:'row',
      alignItems:'flex-start',
      width:'100%',
      padding: 20,
     
      
    },
    item_avatar: {
     marginRight:20,
    },
    item_name: {
      marginTop:10,
    },

    name: {
      fontSize:16,
    },
    avatar: {
      width:50,
      height:50,
      borderRadius:25,
    }

    
})