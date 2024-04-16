import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import Like from '../assets/images/like.jpeg';
import Shock from '../assets/images/shock.jpeg';
import Heart from '../assets/images/heart.jpeg';
import {Colors} from '../utils/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import  Modal from 'react-native-modal';
import Comments from '../screens/comment/Comments';

import EvilIcons from 'react-native-vector-icons/EvilIcons'
const PostFooter = ({data}) => {

  const [reaction,setReaction] = useState({})
  const [reaction_state, setReaction_state] = useState(false)
  const [userID, setUerID] = useState(auth().currentUser.uid)
  const [dataPost, setDataPost] = useState(data)
  const [init,setInit] = useState(false)

  const [comment_state, setComment_state] = useState(false)


  useEffect(()=>{GetDataReaction(); },[])

  useEffect(()=>{
    
    if(reaction != undefined && init == true) {
      uploadReaction();
    
    }
    if(init == true) {
      if(reaction_state == true) {   uploadAmountReactionInPost(1);  }
      else {   uploadAmountReactionInPost(-1);  }
    
    }

  },[reaction_state])

  const CreateReaction = () => {
    firestore().collection('reactions').doc(userID+dataPost.postID).get()
                .then(documentSnapshot => {
                  if(!documentSnapshot.exists) {
                    let timePost = Date.now().toString();
                    let reactionID = userID+dataPost.postID;
                      firestore()
                            .collection('reactions').doc(reactionID)
                            .set({
                                reactionID: reactionID,
                                postID: dataPost.postID,
                                state:true,
                                dateModified: timePost   })
                            .then( () => {  
                                // setInit(true)
                                console.log("tao reaction thanh cong")  
                                setReaction_state(true) 
                              })
                            .catch(error => { console.log("loi khi tao reaction object: ",error)  })                
                  }  } )
                .catch(error => {console.log('loi khi tao Reaction: ',error)})
  }

  const GetDataReaction = () => {
    firestore()
        .collection('reactions').doc(userID+dataPost.postID).get()
        .then(documentSnapshot => { 
          if(documentSnapshot.exists) {
            setReaction(documentSnapshot.data() )
            setReaction_state(documentSnapshot.data().state)
            console.log("GetDataReaction: Hoan thanh get data")
          }
          else {
            setReaction(undefined)
            console.log("GetDataReaction:datareaction khong ton tai")
          }
        })
        .catch(error => {console.log('loi khi get data reaction: ',error)})  
  }

  const uploadReaction = () => {
    firestore()
        .collection('reactions').doc(reaction.reactionID)
        .update({  state: reaction_state, })
        .then(() => {  })
        .catch(error => { console.log("loi khi uploadReaction: ", error)  });
  }

  const logAllItem =(value) => {
    console.log('=========Sau day la log all item =======')
    console.log("***log cua phan: ",value)
    console.log("userID: ",userID)
    console.log('reaction: ',reaction)
    console.log('datapost: ', dataPost)
    console.log('reaction_state', reaction_state)
    console.log('=========End log all item =======')

  }

  const uploadAmountReactionInPost = (value) => {
    firestore()
        .collection('posts').doc(dataPost.postID)
        .update({  like: dataPost.like+value   })
        .then(() => {  })
        .catch(error => { console.log("loi khi uploadReaction Aomount Post: ", error)  });
    dataPost.like = dataPost.like+value;
  }

  const  onReaction = async () => {
    setInit(true)
     if((reaction == {} || reaction == undefined ) && init == false) {
      CreateReaction()}
    else {
      if(reaction == undefined) GetDataReaction();
      await setReaction_state(reaction_state==true?false:true)
    }
    
  
  }

  const ShowComment = () => {
    return (
      
        <Modal isVisible={comment_state} 
               animationIn={'slideInUp'}
              //  animationInTiming={300}
               animationOut={'fadeOutDown'}
               animationOutTiming={900}
               onBackButtonPress={()=>setComment_state(false)}
               onBackdropPress={()=>setComment_state(false)}
               style={{  marginTop:100, marginBottom:50,  borderRadius:20,backgroundColor:'#fff', width:'90%', }}
        >
          <Comments dataPost = {data} />
        </Modal>
      
    )
  }
  
  const  onComment = () => {
    setComment_state(true);
    
  }

  return (
    <View style={styles.postFotterContainer}>
      <View style={styles.footerReactionSec}>
        <View style={styles.row}>
          <Image source={Like} style={styles.reactionIcon} />
          <Image source={Shock} style={styles.reactionIcon} />
          <Image source={Heart} style={styles.reactionIcon} />
          <Text style={styles.reactionCount}>{data.like} likes</Text>
        </View>
        <Text style={styles.reactionCount}>{data.comment} comments</Text>
      </View>
      <View style={styles.userActionSec}>
        <View  style={styles.row}>
          <TouchableOpacity onPress={onReaction}
            
            >
            {/* <EvilIcons name='heart' size={20} /> */}
          <Text   style={reaction_state?{color:'#f00', fontSize:18, fontWeight:'bold'}:{color:'#000'}}>{reaction_state?'Đã like':'Like'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={onComment}>
          <Text style={styles.reactionCount}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
         <TouchableOpacity>
         <Text style={styles.reactionCount}>Share</Text>
         </TouchableOpacity>
        </View>
      </View>
   
    <ShowComment />
    </View>
  );
};

const styles = StyleSheet.create({
  reactionIcon: {
    height: 20,
    width: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postFotterContainer: {
    padding: 16,
  },
  reactionCount: {
    color: Colors.grey,
    fontSize: 14,
    paddingLeft: 5,
  },
  footerReactionSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
    paddingBottom: 15,
  },
  userActionSec: {
    marginTop: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PostFooter;
