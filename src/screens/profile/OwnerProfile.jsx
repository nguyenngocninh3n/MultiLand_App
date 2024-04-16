import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';

import { Colors } from '../../utils/Colors';
import auth from '@react-native-firebase/auth';

import PostHeader from '../../components/PostHeader';
import PostFooter from '../../components/PostFooter';
import firestore from '@react-native-firebase/firestore'

import ProfileHeader from '../../components/ProfileHeader';
const OwnerProfile = ({navigation}) => {
  const getUser = () => {
    let temp_user = {};
     firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .onSnapshot((documentSnapshot) => {
      if (documentSnapshot.exists) {
        temp_user = documentSnapshot.data()
      }
    });
  console.log('------------------kiem tra gia tri user trong firestore: ', temp_user)
    
    return temp_user;
  }
  const [PostData,setPostData] = useState([])
  const temp = getUser;
  console.log('gia tri temp: ',temp)
  const [user,setUser] = useState({});
  
  console.log('------------------kiem tra gia tri user: ', user)
  useEffect(()=> {
    firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .onSnapshot((documentSnapshot) => {
    if (documentSnapshot.exists) {
      setUser(documentSnapshot.data())
    }
  });
  },[])



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

  const GetImage =({source, style}) => {
    if(source=="" || source == null) {   return;  }
    else {   return (   <Image source={{uri:source}} style={style} />  )  }
}

const GetProfile = () => {

  console.log('*****************************Thong tin user: ', user)
  return   <ProfileHeader navigation={navigation} userData={user} PostData={PostData} />
  

}


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <View>
        <GetProfile userData={user} />
    {/* <ProfileHeader navigation={navigation} userData={user} PostData={PostData} /> */}

        </View>
        <View style={styles.postContainer}>
          <FlatList
             scrollEnabled={false}
             data={PostData}
              horizontal={false}
              renderItem={({item}) => (
                  <View style={{width:"100%",flex:1}} key={item.ownerID}>
                    <PostHeader data={item} navigation={navigation} user={user} />
                    <GetImage source={item.image} style={styles.postImg} />
                    <PostFooter data={item} />
                </View>
              )}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
 

    postContainer: {
      backgroundColor: Colors.white,
      
  
    },
    postImg: {
      width: '100%',
      height: 200,
      paddingLeft:200,
      paddingRight:200,
    },

});