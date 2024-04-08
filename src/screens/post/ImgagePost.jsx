import {View, StyleSheet, Image, Text, Alert, VirtualizedList} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Colors} from '../../utils/Colors';

import firestore from '@react-native-firebase/firestore'
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context';

const ImagePost = (props) => {
  const userIDProfile = auth().currentUser.uid
  console.log('image post info: userID', userIDProfile);
  const [PostData,setPostData] = useState([])
  


  useEffect(() => {
    const subscriber = firestore().collection("posts").where("ownerID","==",auth().currentUser.uid).onSnapshot((res) => {
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
    <SafeAreaView style={styles.postContainer}>
    <View style={{backgroundColor:'#f00',width:100,height:100}}>
        <Text onPress={()=>{console.log('gia tri datapost: ',PostData)}}>hiiiii</Text>
    </View>

    <FlatList data={PostData}
              key={Math.ceil(PostData.length /3) ?? 2}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
            
              horizontal={false}
              renderItem={({item}) => (                        
                  <View  key={item.ownerID}>
                    <Image source={{uri:item.image}} style={styles.postImg} />
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
    margin:10,
    width:'150',
    height:150,

  },
});

export default ImagePost;
