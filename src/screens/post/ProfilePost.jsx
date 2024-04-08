import {View, StyleSheet, Image, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Colors} from '../utils/Colors';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

import firestore from '@react-native-firebase/firestore'
import { FlatList, ScrollView } from 'react-native-gesture-handler';


const ProfilePost = ({navigation}) => {
  const [PostData,setPostData] = useState([])
  
  useEffect(() => {
    const subscriber = firestore().collection("posts").orderBy('timestamp','desc').onSnapshot((res) => {
      const posts = []
      if(res != null) {
        res.forEach(documentSnapshot => {
          posts.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
      }
      setPostData(posts);
    })

    return () => subscriber()
  },[])


  return (
    <View style={styles.postContainer}>
    <FlatList data={PostData}
              horizontal={false}
              renderItem={({item}) => (                        
                  <View key={item.ownerID}>
                    <PostHeader data={item} navigation={navigation} />
                    <Image source={{uri:item.image}} style={styles.postImg} />
                    <PostFooter data={item} />
                </View>              
              )}
        />  
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  postImg: {
    width: '90%',
  
    margin:20,
    height: 250,
  },
});

export default ProfilePost;
