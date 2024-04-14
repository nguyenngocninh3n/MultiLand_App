import { useEffect, useState } from "react"
import firestore from '@react-native-firebase/firestore'
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"


export default ChatScreen = ({navigation,user_1_Data, user_2_Data}) => {

    var user_1 = user_1_Data;
    var user_2 = user_2_Data;
    const [chats, setChats] = useState([])
    // const [userChat_state, setUserChat_state] = useState(null)
    var userChat_state = null;
    const [contentValue, setContenValue] = useState('')

    useEffect(()=>{
        firestore().collection('chats').doc(user_1.uid + user_2.uid).onSnapshot((res)=> {
            if(res != null && res != undefined) {
                console.log('chat data co ton tai!',res.data())
                setChats(res.data())
            }
            else {
                firestore().collection('chats').doc(user_2.uid + user_1.uid).onSnapshot((res)=> {
                    if(res.data() != null && res.data() != undefined) {
                        console.log('chat data co ton tai!',res.data())
                        let user_temp = user_1;
                        user_1 = user_2;
                        user_2 = user_temp;
                        setChats(res.data())
                    }
                    else {
                        
                    }
            })}
        })
    },[])
    
    
    const formatDate = (timestamp) => {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return new Date(timestamp).toLocaleDateString(undefined, options);
    };

    const GetImage =({source}) => {
        if(source=="" || source == null) {  return; }
        else {  return ( <Image source={{uri:source}}   style={styles.avatar}  />  )  }
    }

    const ShowOneChat = ({avatar, content, stylechat, id}) => {
        console.log('gai tri tham so:',avatar,' ',content,' ',stylechat)
        // setUserChat_state(id);
        userChat_state = id;
        return (
            <View style={stylechat}>
                <View style={{width:50}}><GetImage style={styles.avatar} source={avatar} /></View>
                <View><Text style={styles.content}>{content}</Text></View>
            </View>
        )
    } 


    const ShowChat = (item) => {
        console.log('gia tri cua item la: ',item.item)
        if(item.item.userID == user_1.uid) {
            if(item.item.userID == userChat_state)
            return (<View>
                < ShowOneChat avatar= ''
                content= {item.item.content}
                stylechat = {styles.styleUser_1}
                 id={item.item.userID}
                  />
            </View>)
            else {
                // setUserChat_state(item.item.userID);
                return (<View>
                    < ShowOneChat avatar= ''
                    content= {item.item.content}
                    stylechat = {styles.styleUser_1 }
                    id={item.item.userID}
                     />
                </View>)
            }        
        } 
        else {
            if(item.item.userID == userChat_state)
                return < ShowOneChat avatar= {null} 
                                    content= {item.item.content}
                                    stylechat = {styles.styleUser_2 }
                                    id={item.item.userID}
                                    />
            else {
                // setUserChat_state(item.item.userID);
                return < ShowOneChat avatar= {user_2.avatar} 
                                     content= {item.item.content}
                                     stylechat = {styles.styleUser_2 }
                                     id={item.item.userID}
                                     />
            }       
        }
    }


    const AddChat = () => {
        let value = contentValue;
        setContenValue('')
        let timestamp = Date.now();
        firestore().collection('chats').doc(user_1.uid + user_2.uid).get().then((res)=> {
            if(res.exists) {
                console.log('chat data co ton tai!', chats.data)
                let arr = chats.data;
                arr.push( {
                    userID: user_1.uid,
                    content:value,
                    timestamp: timestamp,
                })
                firestore().collection('chats').doc(user_1.uid+user_2.uid).update({
                    data: arr,
                }).catch(error=>console.log('loi khi cap nhat chat data: ',error))

            }
            else {
                console.log('chat data khong ton tai!');    
                firestore().collection('chats').doc(user_1.uid+user_2.uid).set({
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
                })
                .then(res=> {console.log('them chat data thanh cong: ',res);
                             setInit(true)})
                .catch(error => console.log('loi khi them chat data: ', error) )   
            }
        })
        
    }
    const sendChat = () => {
       
       AddChat();
 
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chat_header}>
                <GetImage style={styles.avatar} source={user_2.avatar} />
                <Text style={styles.textName}>{user_2.name}</Text>
            </View>
            <FlatList style={styles.chat_container}
                    data={chats.data}
                    horizontal={false}
                    renderItem={({item})=>(
                        <ShowChat item={item} />
                    )}  
             />
             <View>
                <TextInput style={styles.textInput} value={contentValue} onChangeText={(value) =>{setContenValue(value)}} />
                <TouchableOpacity
                    onPress={sendChat}
                >
                <Text style={styles.btnSend}>Gửi</Text>
                </TouchableOpacity>
             </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {

    },
    chat_header: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: '#ffa'
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 25,
        paddingRight: 10,
        backgroundColor: '#00f',
        marginLeft:20,
    },
    textName: {

    },
    chat_container: {
        // width:'85%',
        paddingLeft:12,
        paddingRight:12,
    },
    textInput: {
        width:'80%',
        backgroundColor: '#eee'
    },
    btnSend: {
        backgroundColor: '#00f',
    },
    styleUser_1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#cfa',
        
    },
    styleUser_2: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#cfa',
       

    },
    content: {
        color: '#f00',
        fontSize: 16,
        fontWeight:'400',
       
    }


})

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