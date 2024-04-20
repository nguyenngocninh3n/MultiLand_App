import { useEffect, useState } from "react";

import firestore, {Filter} from '@react-native-firebase/firestore'
import { FlatList, TextInput } from "react-native-gesture-handler";
import { View, Button, Text,Image, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import auth from '@react-native-firebase/auth'

export default ChatHome = ({navigation}) => {

    const [user, setUser] = useState({})
    const [chats, setChats] = useState([])
    useEffect(()=>{
        firestore().collection('users').doc(auth().currentUser.uid).get()
                    .then(documentSnapshot => {
                        if(documentSnapshot.exists)
                        {
                            setUser(documentSnapshot.data())
                        }
                    })
                    .catch(error => {console.log(error)})
    },[])

    useEffect(() => {
        firestore().collection('chats')
        .orderBy('dateModified','desc')
        .onSnapshot((res)=>{
            console.log('ket qua res: ',res)
            let arr = []
            if(res != null) {
                
                res.forEach(documentSnapshot => {
                    console.log("gia tri cac comment: ",documentSnapshot.data())
                    let item = documentSnapshot.data();
                    if(item.userID_1 == user.uid || item.userID_2 == user.uid) {
                            arr.push(item);
                        }
                    })
                        console.log('danh sach tat ca chatdata cua user la: ',arr);
                        setChats(arr);
              }
        })
    },[user])


    const GetTime = ({timestamp}) => {
        let date_temp =  new Date(timestamp);
        if(Date.now()- timestamp <= 50400000) {
        var date_string = date_temp.getHours().toString() + ':' + date_temp.getMinutes().toString();
        }
        else if (Date.now() - timestamp <= 50400000*7) {
            let day = date_temp.getDay() + 1;
            var date_string = 'Thứ ' + day;
        }
        else {
            var date_string = 'error'
        }
        console.log('gia tri time la: ',date_string)
        return <Text >{date_string}</Text>

    };

    const GetImage =({source}) => {
        if(source=="" || source == null) {  return; }
        else {  return ( <Image source={{uri:source}}   style={styles.avatar}  />  )  }
    }

    const toChatSceen = (item) => {
        console.log('..............gia tri item la: ',item)
        if(user.uid == item.userID_2) {
        firestore().collection('users').doc(item.userID_1).get()
        .then(documentSnapshot => {
            if(documentSnapshot.exists)
            { 
                let userData =documentSnapshot.data();
                navigation.navigate('NavigationOtherScreen',{name:'ChatScreen', oldScreen:'ChatHome',user:user, user_2:userData})
            }
        })
        .catch(error => {console.log(error)})
        } else {
            firestore().collection('users').doc(item.userID_2).get()
            .then(documentSnapshot => {
                if(documentSnapshot.exists)
                { 
                    let userData =documentSnapshot.data();
                    navigation.navigate('NavigationOtherScreen',{name:'ChatScreen', oldScreen:'ChatHome',user:user, user_2:userData})
                }
            })
            .catch(error => {console.log(error)})
        }
        
    }

    const ShowItem = ({item}) => {
        let item_avatar, item_name, item_content, item_time = null
        if(item.userID_1 == user.uid ) {
            item_avatar = item.userAvatar_2
            item_name =  item.userName_2;
        }
        else {
            item_avatar = item.userAvatar_1;
            item_name =  item.userName_1;
        }
        if(item.data[item.data.length-1].userID == user.uid) {
           
            item_content = "Bạn: " + item.data[item.data.length-1].content;
        }
        else {
         
            item_content = item.data[item.data.length-1].content;
        }
       
        item_time = item.data[item.data.length-1].timestamp;


        return (
            <View>
           <TouchableHighlight onPress={()=>{
            console.log('gia tri item: ',item)
            toChatSceen(item)}} underlayColor='rgba(0,0,0,0.05)'  >
            <View style={styles.item_container}>
            <GetImage source={item_avatar} />
            <View style={styles.column} >
                <Text style={styles.item_name}>{item_name}</Text>
                <View style={styles.row}>
                    <View style={styles.item_lastContent}>
                        <Text >{item_content}</Text>
                    </View>
                    <View style={styles.item_lastTime}>
                        <GetTime timestamp={item_time} />
                    </View>
                </View>
            </View>
            </View>
           </TouchableHighlight>
        </View>
        )

    }

    return (
        <View style={styles.container}>
            <View style={styles.search_container}>
                <TextInput style={styles.search_inp} placeholder="Tìm kiếm..." />
                <Text style={styles.search_btn} >Search</Text>
            </View>
            <FlatList 
                      data={chats}
                      horizontal={false}
                      renderItem={({item})=>(
                       <ShowItem item={item} />
                      )}    
                      />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    search_container: {
        flexDirection: 'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#eec'

    },
    search_inp: {
        flex:1,

    },
    search_btn: {
        width: 50,

    },
    item_container: {
        flexDirection:'row',
        padding:10,

    },
    column: {
        flexDirection: 'column',
        justifyContent:'space-between',
        marginLeft: 20,
        width:'100%',
    },
    row: {
        flexDirection:'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems:'center'
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 25,
    },
    item_name: {
        fontSize:18,
        color: '#2ae',
        marginBottom:5,
    },
    item_lastTime: {
        width: 100,

    },
    item_lastContent: {
        maxWidth:'100%',

    },

})



/*

**** CHAT DATA

document: user_1.uid + user_2.uid

 chatID: user_1.uid+user_2.uid,
                    userID_1: user_1.uid,
                    userID_2: user_2.uid,
                    userName_1: user_1.name,
                    userName_2: user_2.name,
                    userAvatar_1: user_1.avatar,
                    userAvatar_2: user_2.avatar,
                    data: [{
                        userID: user_1.uid,
                        content:value,
                        timestamp: timestamp,
                    }],

*/