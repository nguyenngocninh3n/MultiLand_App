import { useEffect, useState } from "react";

import firestore from '@react-native-firebase/firestore'
import { FlatList, TextInput } from "react-native-gesture-handler";
import { View } from "react-native";
import { Text } from "react-native-paper";


export default ChatHome = ({navigation, userData}) {

    const [user, setUser] = useState({})
    const [chats, setChats] = useState([])
    useEffect(()=>{
        firestore().collection('chats').where('chatID','==',user.uid)
        .onSnapshot((res)=>{
            let arr = []
            res.map((value, index)=>{
                arr.push(value)
            })
            console.log('danh sach tat ca chatdata cua user la: ',arr);
            setChats(arr);
        })
    },[])


    return (
        <View>
            <View>
                <TextInput placeholder="Tìm kiếm..." />
                <Text style={{backgroundColor:'#ccc', width:50}} >Search</Text>
            </View>
            <FlatList data={chats}
                      horizontal={false}
                      renderItem={({item})=>(
                        <View>
                            <View>
                                <GetImage source={item.userAvatar_2} />
                            </View>
                            <View>
                                <Text>{item.userName_2}</Text>
                                <View>
                                    <Text>{item.data[item.length-1].content}</Text>
                                    <Text>{item.data[item.length-1].time}</Text>
                                </View>
                            </View>
                        </View>
                      )}    

                      />
        </View>

    )
}

/*

**** CHAT DATA

document: userID_1

chatID: userID_1
userID_1: user.uid
userID_2: user.uid
userName_1: user.name
userName_2: user.name
userAvatar_1: user.avatar
userAvatar_2: user.avatar
data[
    {
        userID: user.uid,
        content:  "",
        time: date.now()
    }
],

*/