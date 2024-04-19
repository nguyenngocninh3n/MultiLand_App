import {View, StyleSheet, Image, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Colors} from '../utils/Colors';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

import firestore from '@react-native-firebase/firestore'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Post = ({navigation}) => {
  const [PostData,setPostData] = useState([])
  
  useEffect(() => {
    firestore().collection("posts").orderBy('timestamp','desc').onSnapshot((res) => {
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

  },[])


  const GetImage =({source}) => {
    if(source=="" || source == null) {   return;  }
    else {   return (   <Image source={{uri:source}} style={styles.postImg} />  )  }
  }

  return (
    <SafeAreaView style={styles.postContainer}>
    <FlatList 
              scrollEnabled={false}
              data={PostData}
              horizontal={false}
              renderItem={({item}) => (                        
                  <View key={item.ownerID}>
                    <PostHeader data={item} navigation={navigation} />
                    <GetImage source={item.image}/>
                    <PostFooter data={item} navigation={navigation} />
                    
                </View>              
              )}
        />  
    </SafeAreaView>
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
  postImg_none: {
    width:0,
    height:0,
    margin:0,
  },
});

export default Post;
