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
} from 'react-native';

import ProfileHeader from '../../components/ProfileHeader';
import { Colors } from '../../utils/Colors';
import auth, { firebase } from '@react-native-firebase/auth';

import PostHeader from '../../components/PostHeader';
import PostFooter from '../../components/PostFooter';
import firestore from '@react-native-firebase/firestore'
import { TransitionIOSSpec } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';

const UserProfile = ({navigation, user}) => {

  const [PostData,setPostData] = useState([])
 
  useEffect(() => {
    const subscriber = firestore().collection("posts").where("ownerID","==",user.uid).onSnapshot((res) => {
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
   
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <View>
          <ProfileHeader navigation={navigation} userData={user} PostData={PostData} />
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
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  userImg: {
    marginTop:400,
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
    fontSize:16,
    fontWeight:'500'
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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