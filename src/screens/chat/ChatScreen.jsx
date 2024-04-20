import { useEffect, useRef, useState } from "react"
import firestore from '@react-native-firebase/firestore'
import { SafeAreaView, FlatList, TextInput, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler";

import AntDesign  from 'react-native-vector-icons/dist/AntDesign';

export default ChatScreen = ({navigation, oldScreen, user_1_Data, user_2_Data}) => {

    var user_1 = user_1_Data;
    var user_2 = user_2_Data;
    const [chats, setChats] = useState([])
    const [chats_length, setChats_length] = useState(1);
    const [doc_chatID, setDoc_chatID] = useState(null);
   
    const chatRef = useRef(null)
    var userChat_state = null;
    const [contentValue, setContenValue] = useState('')

    useEffect(()=>{
        firestore().collection('chats').doc(user_1.uid + user_2.uid).onSnapshot((res)=> {
            if(res.data() != null && res.data() != undefined) {
                console.log('............luồng làm việc: đi vào if 1')

                setDoc_chatID(user_1_Data.uid+user_2_Data.uid)
                setChats(res.data())
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
    },[chats])

    useEffect(()=>{

            console.log('--------------vào luồng này');
            setTimeout(()=>{chatRef.current.scrollToEnd({animated:false})},1000);
            
        }
    ,[chats_length])
    


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

    const ShowOneChat = ({avatar, content, stylechat,styleContent, id}) => {
        userChat_state = id;
        return (
            <View style={stylechat}>
                <View style={styles.item_container} >
                    <View style={styles.item_avatar}> 
                        <GetImage source={avatar} />
                    </View>
                    <Text style={styleContent}>{content}</Text>
                </View>
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
                styleContent = {styles.item_content_1}
                 id={item.item.userID}
                  />
            </View>)
            else {
                return (<View>
                    < ShowOneChat avatar= ''
                    content= {item.item.content}
                    stylechat = {styles.styleUser_1 }
                    styleContent = {styles.item_content_1}
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
                                    styleContent = {styles.item_content_2}
                                    id={item.item.userID}
                                    />
            else {
                return < ShowOneChat avatar= {user_2.avatar} 
                                     content= {item.item.content}
                                     stylechat = {styles.styleUser_2 }
                                    styleContent = {styles.item_content_2}
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

    const showInfoBeforeAdd = ({timestamp,value}) => {
     console.log(   
                    'userID_1: ',user_1.uid,
                    'userID_2: ',user_2.uid,
                    'userName_1: ',user_1.name,
                   ' userName_2: ',user_2.name,
                    'userAvatar_1:', user_1.avatar,
                    'userAvatar_2: ',user_2.avatar,
                   ' dateModified: ',timestamp,
                        'content:',value,
                        'timestamp: ',timestamp,
                    )
    }

    const AddChat = () => {
        // console.log('kiem tra thong tin: ****\n \n \n \n ');
        // console.log('user_1', user_1.uid)
        // console.log('user_2', user_2.uid)
        // console.log('docID', doc_chatID);
        let value = contentValue;
        setContenValue('')
        let timestamp = Date.now();
        showLog()
        console.log(   
            'userID_1: ',user_1.uid,
            'userID_2: ',user_2.uid,
            'userName_1: ',user_1.name,
           ' userName_2: ',user_2.name,
            'userAvatar_1:', user_1.avatar,
            'userAvatar_2: ',user_2.avatar,
           ' dateModified: ',timestamp,
            
                'content:',value,
                'timestamp: ',timestamp,
            )

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
                    dateModified: timestamp,
                }).catch(error=>console.log('loi khi cap nhat chat data: ',error))
               1
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
                    dateModified: timestamp,
                    data: [{
                        userID: user_1.uid,
                        content:value.toString(),
                        timestamp: timestamp,
                    }],
                })
                .then(res=> {console.log('them chat data thanh cong: ',res);
                            })
                .catch(error => console.log('loi khi them chat data: ', error) )   
            }
        })
        
    }

    
    const sendChat = () => { AddChat();  }

    const GetFlatList = () => {
        if(chats.data != undefined) return ( 
               <SafeAreaView style={styles.chat_container}>
                 <FlatList 
                        // inverted
                        // data={[...chats.data].reverse()}
                        // ref={chatRef} 
                        // keyExtractor={(item,index)=>index.toString()}
                        
                       
                        data={chats.data}
                        // initialScrollIndex={chats.length-1}
                        ref={chatRef}
                        // onContentSizeChange={}
                        // onLayout={() => chatRef.current.scrollToEnd() }
                        
                       // onScrollToIndexFailed={()=> {}}
                        renderItem={({item})=>(
                            <ShowChat item={item} />
                        )}  
                />
               </SafeAreaView>
        )
    }

      
   const [textInput_style, setTextInput_style] = useState(styles.textInput_styleOut)
   const textInputInt = () =>{
    setTextInput_style(styles.textInput_styleIn)
   }

   const textInputOut = () => {
    setTextInput_style(styles.textInput_styleOut)
   }
   useEffect(()=>{textInputOut},[])


    const onGoBack = () => {
        if(oldScreen=='ChatHome') {
            navigation.navigate('ChatHome')
        } else {
            navigation.navigate('NavigationOtherScreen',{name:'UserProfile', user: user_2_Data})
        }
    }
    const onViewProfile = () => {
        navigation.navigate('NavigationOtherScreen',{name:'UserProfile', user: user_2_Data})
    }

    return (
        <View style={styles.container}>
            <View  style={styles.chat_header}>
                <TouchableHighlight onPress={onViewProfile} style={styles.touchHightlight} underlayColor={'#fff'}  onPress={onGoBack}>
                    <AntDesign name="leftcircleo" color='#13f' size={30} />
                </TouchableHighlight>
                <GetImage style={styles.avatar} source={user_2.avatar} />
                <Text  onPress={onViewProfile} style={styles.textName}>{user_2.name}</Text>
            </View>
            <View style={{flexDirection:'column',justifyContent:'space-between'}} >
        
                       <SafeAreaView onPressIn={textInputOut} style={{...textInput_style,height:'80%'}}>
                         <GetFlatList / >
                       </SafeAreaView>
            
                    <View>
                        <TextInput style={styles.textInput} onBlur={textInputOut} onFocus={textInputInt}  placeholder="Nhắn tin.." multiline={true}   value={contentValue} onChangeText={(value) =>{setContenValue(value)}} />
                        <TouchableHighlight onPress={sendChat} >
                        <Text style={styles.btnSend}>Gửi</Text>
                        </TouchableHighlight>
                     </View>
                </View>
            </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'column',

    },
    touchHightlight: {
        width:60,
        paddingLeft:20,
      
    },
    chat_header: {
        flexDirection: 'row',
        alignItems:'center',
        width: '100%',
        height: 60,
        borderBottomColor:'#bbb',
        borderBottomWidth:1,
        marginBottom:10,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 25,
        backgroundColor: '#00f',
        marginLeft:20,
    },
    textName: {
        marginLeft:20,
        fontSize:18,
        color:'#0af'

    },
    chat_container: {
        paddingLeft:12,
        paddingRight:12,
    },
    textInput: {
        width:'100%',
        borderTopColor:'#ccc',
        borderWidth:1,
        paddingLeft:10,
        fontSize:16,
    },
    btnSend: {
        backgroundColor: '#00f',
        color:'#fff',
        height:50,
        textAlign:'center',
        fontSize:20,
        paddingTop:10,
    },
    styleUser_1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop:10,
        
    },
    styleUser_2: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop:10,
    },
    item_container: {
        flexDirection:'row',
        alignItems:'center',
    },
    item_avatar: {
        width:42, 
        height:42, 
        marginRight:30,
    },
    item_content_1: {
        fontSize: 16,
        marginTop:-20,
        maxWidth:'100%',
        backgroundColor:'#06f',
        color:'#fff',
        padding:10,
        borderRadius:10,
    },
    item_content_2: {
        fontSize: 16,
        marginTop:-20,
        maxWidth:'100%',
        backgroundColor:'#eea',
        padding:10,
        borderRadius:10,
    },
    textInput_styleIn: {
    marginBottom:-60,
    paddingLeft:10,
  },

  textInput_styleOut: {
    borderWidth:1,
    marginBottom:0,
    borderTopColor:'#dda',
    paddingLeft:10,
  }
})
