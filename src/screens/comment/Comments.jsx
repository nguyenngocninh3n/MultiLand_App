import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { Alert, SafeAreaView, Button,FlatList, TextInput, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'

import Modal from 'react-native-modal'

export default Comments = ({navigation,dataPost}) => {
    const [comments, setComments] = useState([])
    const userID = auth().currentUser.uid;
    const [user, setUser] = useState(undefined)
    const [commentContent, setCommentContent] = useState("")
    const[sendComment_state, setSendComment_state] = useState(false)
    const [options_state, setOptions_state] = useState(false);
    const [selected, setSelected] = useState(null);

   useEffect(()=>{
        firestore().collection("comments").where('postID','==',dataPost.postID).onSnapshot((res) => {
          const comment_arr = []
          if(res != null) {
          
            res.forEach(documentSnapshot => {
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

    const PostComment = () =>  {
        let timePost = Date.now();
        if(selected != null) {
          firestore().collection('comments').doc(selected.commentID).update({
            dateModified:timePost,
            comment: commentContent,
          }).then(()=>{
            console.log('cập nhật comment thành công');
            return;

          })
            .catch(error => {console.log('lỗi khi cập nhật comment: ',error)})
        } else {
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
                    setSendComment_state(!sendComment_state)

                })
                    .catch(error => {console.log(error)})
              }
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


   const deleteComment = () => {
        firestore().collection('comments').doc(selected.commentID)
               .delete()
               .then(()=> {console.log('xoa bình luận thanh cong')
                      let oldNum = dataPost.comment
                      let num =  parseInt(oldNum) - 1;
                      console.log('-----------gia tri comment id: ',oldNum, ' ',typeof oldNum);
                      console.log('-----------gia tri num: ',num);
                      
                      firestore().collection('posts').doc(selected.postID)
                      .update({comment:num})
                      .then(()=>{console.log('giảm số lượng comment thành công');setSelected(null)})
                      .catch(error =>{console.log('loi khi update số lượng cmt: ',error)})
              })
               .catch(error=>{console.log('loi khi xoa comment: ', error)})
    }

    const editComment = () => {
      setCommentContent(selected.comment);
      setOptions_state(false)
    }

  
   const GetOptions = () => {
    return (
      <SafeAreaView style={{flexDirection:'column',  justifyContent:'center'}}>
        <Modal style={{flexDirection:'column', marginLeft:0, marginBottom:0, justifyContent:'flex-start',height:100,width:'100%', marginTop:740, backgroundColor:'#fff'}}
            onBackdropPress={()=>{setOptions_state(false);setSelected(null)}}
            onBackButtonPress={()=>{setOptions_state(false);setSelected(null)}}
            isVisible={options_state}
        >
            <View style={styles.optionContainer_item}>
              <TouchableOpacity  onPress={editComment}>
                <Text style={styles.optionText}>Sửa bình luận</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionContainer_item}>
              <TouchableOpacity onPress={deleteComment}>
                <Text style={styles.optionText} >Xóa bình luận</Text>
              </TouchableOpacity>
            </View>
        </Modal>
      </SafeAreaView>
    )
  }
   const GetComment = ({item}) => {
    
    const onDeleteComment = ({item}) => { }
    const GetImage =({source}) => {
        if(source=="") {  return; }
        else {  return ( <Image source={{uri:source}}  style={styles.avatar} />  )  }
      }
      return (
        <View  style={styles.container_item}>
            <TouchableHighlight underlayColor='#ccc'  
                                onLongPress={()=>{
                                  console.log('item: ',item)
                                        setSelected(item);
                                        setOptions_state(true)}}>
                <View style={styles.row}>
                      <GetImage source={item.avatar} />
                      <View style={styles.column}> 
                            <Text style={styles.userNameText}>{item.userName}</Text>
                            <Text style={styles.commentText}>{item.comment}</Text>
                      </View>
                </View>
            </TouchableHighlight>
           
        </View>
      )}

 
      
      
  return (
        <View style={styles.container} >  
            <View height="85%">
                <FlatList   style={{ backgroundColor:'#fff'}}
                data={comments}
                horizontal={false}
                renderItem={({item}) => (
                    <GetComment item={item} />
                )}
                />
            </View>
            <View  style={textInput_style} backgroundColor='#eee' >
                <TextInput 
                onPressOut={textInputOut}
                 onPressIn={textInputInt} onFocus={textInputInt}  value={commentContent}  onChangeText={value => setCommentContent(value)} placeholder='viết bình luận....' multiline={true}  numberOfLines={2}  />
                <TouchableOpacity style={{ alignItems:'center', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10 ,backgroundColor:'#00f' }} onPress={PostComment}>
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize:14}}>Gửi</Text>
                </TouchableOpacity>
            </View>
             <GetOptions />
      </View>

 
    )
}
const styles = StyleSheet.create({
  optionContainer_item: {
    width:'100%', 
    borderColor:'#eee', 
    paddingLeft:10, 
    justifyContent:'center',
    height:50,
    borderWidth:1,
  },
  optionText: {
      fontWeight:'700',
      fontSize:18,
  },

  container_item: {
      backgroundColor: '#eee',
      borderRadius: 20,
      marginTop:20,
      marginLeft: 10,
      marginRight:10,
      padding:5,
  },
  row: {
      flexDirection: 'row',
  },
  column: {
    flexDirection:'column',
  },
  avatar: {
    width:48,
    height:48,
    borderRadius:50,
    marginRight:10,
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
    marginTop:-50, 
    paddingLeft:10,
  },

  textInput_styleOut: {
    borderWidth:1,
    borderTopColor:'#dda',
    paddingLeft:10,
  }
})