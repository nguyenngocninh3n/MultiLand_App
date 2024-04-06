import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'


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

    const PostComment = () => {
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
                    setSendComment_state(!sendComment_state)
                })
                    .catch(error => {console.log(error)})
    }

    return (
        <View>
            <View style={{height:'85%'}}>
                <FlatList  style={{ backgroundColor:'#fff'}}
                data={comments}
                horizontal={false}
                renderItem={({item}) => (
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Image source={{uri:item.avatar}} style={styles.avatar} />
                            <View style={styles.column}> 
                                <Text style={styles.userNameText}>{item.userName}</Text>
                                <Text style={styles.commentText}>{item.comment}</Text>
                            </View>
                        </View>
                    </View>
              
                )}
                />
            </View>
            <View style={{  flexDirection:'column'}}>
                <TextInput value={commentContent} style={{ borderWidth:1, borderTopColor:'#dda',marginTop:10, marginRight:5, marginLeft:5}} onChangeText={value => setCommentContent(value)} placeholder='viết bình luận....' multiline={true}  numberOfLines={2}  />
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
  }
})