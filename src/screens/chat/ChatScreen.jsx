import { useEffect, useRef, useState } from "react"
import firestore from '@react-native-firebase/firestore'
import { SafeAreaView, FlatList, TextInput, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"


export default ChatScreen = ({navigation,user_1_Data, user_2_Data}) => {

    var user_1 = user_1_Data;
    var user_2 = user_2_Data;
    const [chats, setChats] = useState([])
    const [chats_length, setChats_length] = useState(1);
    const [doc_chatID, setDoc_chatID] = useState({});
    // const [userChat_state, setUserChat_state] = useState(null)
   
  
    var userChat_state = null;
    const [contentValue, setContenValue] = useState('')

    useEffect(()=>{
        firestore().collection('chats').doc(user_1.uid + user_2.uid).onSnapshot((res)=> {
            if(res.data() != null && res.data() != undefined) {
                console.log('............luồng làm việc: đi vào if 1')

                setDoc_chatID(user_1_Data.uid+user_2_Data.uid)
                setChats(res.data())
                // if(res.data().data.length != undefined) { setChats_length(res.data().data.length)}
            }
            else {
                firestore().collection('chats').doc(user_2.uid + user_1.uid).onSnapshot((res)=> {
                    if(res.data() != null && res.data() != undefined) {
                    console.log('............luồng làm việc: đi vào if 2')

                        let user_temp = user_1;
                        user_1 = user_2;
                        user_2 = user_temp;
                        setDoc_chatID(user_2_Data.uid+user_1_Data.uid)
                        setChats(res.data())
                // if(res.data().data.length != undefined) { setChats_length(res.data().data.length)}
                        
                    }
                    else {
                        console.log('chat data khong ton tai')
                    }
            })}
        })
       
    },[])
    
    useEffect(() => {
        if(chats.data != undefined) {
                let arr =chats.data;
                setChats_length(arr.length)
        }
    }
        
    ,[chats])

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
        // console.log('gai tri tham so:',avatar,' ',content,' ',stylechat)
        // setUserChat_state(id);
        userChat_state = id;
        return (
            <View style={stylechat}>
                <View style={{width:50, height:50, marginTop:20, marginLeft:20,}}><GetImage source={avatar} /></View>
                <View><Text style={styles.content}>{content}</Text></View>
            </View>
        )
    } 


    const ShowChat = (item) => {

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

    const showLog = () => {
        console.log('sau khi them chat data lan 1: ****\n \n \n \n ');
        console.log('user_1', user_1.uid)
        console.log('user_2', user_2.uid)
        console.log('docID', doc_chatID);
        console.log('gia tri chat: ',chats.data)
    }

    const AddChat = () => {
        console.log('kiem tra thong tin: ****\n \n \n \n ');
        console.log('user_1', user_1.uid)
        console.log('user_2', user_2.uid)
        console.log('docID', doc_chatID);

        let value = contentValue;
        setContenValue('')
        let timestamp = Date.now();
        firestore().collection('chats').doc(doc_chatID).get().then((res)=> {
            if(res.exists) {
                let arr = chats.data;
                arr.push( {
                    userID: user_1.uid,
                    content:value,
                    timestamp: timestamp,
                })
                firestore().collection('chats').doc(doc_chatID).update({
                    data: arr,
                }).catch(error=>console.log('loi khi cap nhat chat data: ',error))
               
            }
            else {
                console.log('chat data khong ton tai!');    
                firestore().collection('chats').doc(doc_chatID).set({
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
                            })
                .catch(error => console.log('loi khi them chat data: ', error) )   
            }
        })
        
    }
    const sendChat = () => {
       
       AddChat();
 
    }

    const GetFlatList = () => {
        let arr = [{}];
        if(chats.data != undefined) {
            arr = chats.data;
        }
        console.log('---------------length chat data: ',arr)
        if(chats.data != undefined) return ( 
            <View>
                <FlatList style={styles.chat_container}
                        // keyExtractor={(item,index)=>index.toString()}
                        // initialNumToRender={chats_length-1}
                        // onScrollToIndexFailed={()=>{}}
                        // initialScrollIndex={18}

                        // data={chats.data}
                        // horizontal={false}
                        // onLayout={() => {}}

                        inverted
                        data={[...chats.data].reverse()}
                        renderItem={({item})=>(
                            <ShowChat item={item} />
                        )}  
                />
        </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chat_header}>
                <GetImage style={styles.avatar} source={user_2.avatar} />
                <Text style={styles.textName}>{user_2.name}</Text>
            </View>
            <GetFlatList / >
             <View>
                <TextInput autoFocus={true} style={styles.textInput} value={contentValue} onChangeText={(value) =>{setContenValue(value)}} />
                <TouchableOpacity
                    onPress={sendChat}
                >
                <Text style={styles.btnSend}>Gửi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={showLog}
                >
                <Text style={{backgroundColor:'#f00', height:50}}>CheckLog</Text>
                </TouchableOpacity>
             </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'column'

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
        height:'50%',
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