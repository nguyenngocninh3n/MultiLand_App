import {View, Text, Image, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import Like from '../assets/images/like.jpeg';
import Shock from '../assets/images/shock.jpeg';
import Heart from '../assets/images/heart.jpeg';
import {Colors} from '../utils/Colors';
import VectorIcon from '../utils/VectorIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import firebase from '@react-native-firebase/app'


const PostFooter = ({data}) => {

  const [reaction,setReaction] = useState({})
  const [reaction_state, setReaction_state] = useState(false)
  const [user,setUser] = useState({});

  const [dataPost, setDataPost] = useState(data)
  const [init,setInit] = useState(true)

  useEffect(()=> {
    firestore()
      .collection('users').doc(auth().currentUser.uid).get()
      .then(documentSnapshot => {
          if (documentSnapshot.exists) {
              console.log('User exist: ', documentSnapshot.data());
              setUser(documentSnapshot.data())
          }
          else {
            console.log("User not exist")
          }
      });
      GetDataReaction();
    },[])

  useEffect(() => {
    if(!init) {
        while(reaction==undefined) {
          GetDataReaction();
        }
       setReaction_state(!reaction_state)
    }
  },[init])
  
  useEffect(() => {
    if(!init) {
      uploadReaction(reaction_state)
      if(reaction_state) 
        uploadAmountReactionInPost(1);      
      else
        uploadAmountReactionInPost(-1)
    }

  },[reaction_state])  


  const m_CreateReaction = () => {
    var timePost = Date.now().toString();
    firebase.firestore()
            .collection('reactions').doc(user.uid+dataPost.postID)
            .set({
                reactionID: user.uid+dataPost.postID,
                postID: dataPost.postID,
                state:reaction_state,
                dateModified: timePost,
            })
            .then( () => {
              console.log("tao reaction thanh cong")
              setInit(false);
            }
            )
            .catch(error => {rej(error)
              console.log("gia tri cua error: ",error)
            });   
  }

  const CreateReaction = () => {
    console.log("===> datapost: ",dataPost)
    console.log("===> dataUser: ",user)
    firebase.firestore()
      .collection('reactions')
      .doc(user.uid+data.postID)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          console.log("Reaction not exist -> create reaction")

          console.log( 'reactionID: ',user.uid+dataPost.postID,
           ' postID: ',dataPost.postID,
           ' state: ',reaction_state,
           ' dateModified: ',Date.now().toString())
          firebase.firestore()
            .collection('reactions').doc(user.uid+dataPost.postID)
            .set({
                reactionID: user.uid+dataPost.postID,
                postID: dataPost.postID,
                state:reaction_state,
                dateModified: Date.now().toString(),
            })
            .then( () => {
              console.log("tao reaction thanh cong")
              setInit(false);
            }
            )
            .catch(error => {rej(error)
              console.log("gia tri cua error: ",error)
            });   
         }
         else {
          console.log("Reaction exist")
         }
         
      }
      );
     
  }

  const GetDataReaction = () => {
    firebase.firestore()
    .collection('reactions').doc(user.uid+dataPost.postID).get()
    .then(documentSnapshot => {
        setReaction(documentSnapshot.data())
     })  
    console.log("get data reaction trong function: ", reaction)
  }

  const uploadReaction = (value) => {
    firestore()
        .collection('reactions').doc(reaction.reactionID)
        .update({
            state: reaction_state,
            })
        .then(() => {
  });
  }

  const uploadAmountReactionInPost = (value) => {
    firestore()
        .collection('posts')
        .doc(dataPost.postID)
        .update({
            like: dataPost.like+value,
            })
            .then(() => {
  });
  }

  const  onReaction = () => {
    if(reaction == null) 
    {
      m_CreateReaction();
    }
    else {
      setInit(false)
      setReaction_state(!reaction_state)
    }
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
        <Text style={styles.reactionCount}>{data.comments} comments</Text>
      </View>
      <View style={styles.userActionSec}>
        <View style={styles.row}>
          <TouchableOpacity style={{backgroundColor:reaction_state?Colors.primaryColor:Colors.white}} onPress={onReaction}>
          <Text  style={styles.reactionCount}>Like</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity>
          <Text style={styles.reactionCount}>Comment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
         <TouchableOpacity>
         <Text style={styles.reactionCount}>Share</Text>
         </TouchableOpacity>
        </View>
      </View>
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
