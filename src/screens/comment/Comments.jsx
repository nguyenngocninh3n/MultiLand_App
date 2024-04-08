import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'

import Modal from 'react-native-modal'

export default Comments = ({dataPost}) => {
    const [comments, setComments] = useState([])
    const userID = auth().currentUser.uid;
    const [user, setUser] = useState(undefined)
    const [commentContent, setCommentContent] = useState("")
    const[sendComment_state, setSendComment_state] = useState(false)

   useEffect(()=>{
        firestore().collection("comments").where('postID','==',dataPost.postID).onSnapshot((res) => {
          const comment_arr = []
          if(res != null) {
            console.log('comments exists')
            res.forEach(documentSnapshot => {
                console.log("gia tri cac comment: ",documentSnapshot)
              comment_arr.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.data().commentID,
              });
            });
          }
          else {
            console.log('comments not exists')
          }
          setComments(comment_arr);
        })
   },[])


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

    useEffect(()=>{
      if(sendComment_state == true) {
        const unsubscriber = firestore().collection('posts').doc(dataPost.postID)
        .update({comment:dataPost.comment+1})
        .then(()=>{console.log('update so luong comment thanh cong')})
        .catch(error =>{console.log('loi khi update so luong comment in post: ',error)})

        return () => unsubscriber;
      }
    },[sendComment_state])

    const updateCommentInPost =() => {
      firestore().collection('posts').doc(dataPost.postID)
                  .update({comment:dataPost.comment+1})
                  .onSnapshot(documentSnapshot => {console.log(documentSnapshot)})
                  .catch(error =>{console.log('loi khi update so luong comment in post: ',error)})
  }

    const PostComment = async  () =>  {
        let timePost = Date.now();
        let commentID = userID + dataPost.postID + timePost;
        firestore().collection('comments').doc(commentID)
                    .set({
                        commentID:commentID,
                        postID:dataPost.postID,
                        userID:userID,
                        userName: user.name,
                        avatar: user.avatar,
                        dateModified: timePost,
                        comment: commentContent,
                        key: commentID,
                    })
                    .then(ref=>{console.log('ref: ',ref),
                    setCommentContent(""),
                    // updateCommentInPost();123
                    setSendComment_state(!sendComment_state)
                    setSendComment_state(!sendComment_state)

                })
                    .catch(error => {console.log(error)})
        
        
    }

    const GetImage =({source}) => {
      if(source=="") {  return; }
      else {  return ( <Image source={{uri:source}}  style={styles.avatar} />  )  }
    }
  
   const [textInput_style, setTextInput_style] = useState(styles.textInput_styleOut)
   const textInputInt = () =>{
    setTextInput_style(styles.textInput_styleIn)
   }

   const textInputOut = () => {
    setTextInput_style(styles.textInput_styleOut)
   }
   useEffect(()=>{textInputOut},[])


    return (
        <View>
            <View height="85%">
                <FlatList   style={{ backgroundColor:'#fff'}}
                data={comments}
                horizontal={false}
                renderItem={({item}) => (
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <GetImage source={item.avatar} />
                            <View style={styles.column}> 
                                <Text style={styles.userNameText}>{item.userName}</Text>
                                <Text style={styles.commentText}>{item.comment}</Text>
                            </View>
                        </View>
                    </View>
              
                )}
                />
            </View>
            <View backgroundColor='#eee' >
                <TextInput  style={textInput_style}
                onPressOut={textInputOut}
                 onPressIn={textInputInt}  value={commentContent}  onChangeText={value => setCommentContent(value)} placeholder='viết bình luận....' multiline={true}  numberOfLines={2}  />
                <TouchableOpacity style={{ alignItems:'center', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10 ,backgroundColor:'#00f' }} onPress={PostComment}>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize:14}}>Gửi</Text>
                </TouchableOpacity>
            </View>
      </View>

 
    )
}
const styles = StyleSheet.create({
  container: {
      backgroundColor: '#eee',
      borderRadius: 20,
      marginBottom:20,
      marginLeft: 10,
      marginRight:10,
      padding:5,
  },
  row: {
      flexDirection: 'row',
  },
  column: {
    flexDirection:'column'
  },
  avatar: {
    width:48,
    height:48,
    borderRadius:50,
    marginRight:10
  },
  userNameText: {
    fontSize:16,
    fontWeight:'300',
    color:'#00f',
  },
  commentText: {
    fontSize:16,
    fontWeight:'300',
  },
  textInput_styleIn: {
    borderWidth:1,
    borderTopColor:'#dda',
    backgroundColor:'#eee',
    marginTop:-40, 
    paddingLeft:10,
   
  },

  textInput_styleOut: {
    borderWidth:1,
    borderTopColor:'#dda',
    
    paddingLeft:10,
  }
})