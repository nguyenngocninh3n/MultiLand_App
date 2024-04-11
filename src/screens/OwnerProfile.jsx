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

import { Colors } from '../utils/Colors';
import auth from '@react-native-firebase/auth';

import PostHeader from '../components/PostHeader';
import PostFooter from '../components/PostFooter';
import firestore from '@react-native-firebase/firestore'

const OwnerProfile = ({navigation}) => {
  
  const [PostData,setPostData] = useState([])

  const [user,setUser] = useState({});

  useEffect(()=> {
    firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .get()
  .then(documentSnapshot => {
    
    if (documentSnapshot.exists) {
      // console.log('User data: ', documentSnapshot.data());
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


  
const onLogout = () => {
  auth()
    .signOut()
    .then(() => Alert.alert('Thong bao','User signed out!'))
    .catch(error => console.log('error :', error));
};


const GetImage =({source, style}) => {
  if(source=="" || source == null) {   return;  }
  else {   return (   <Image source={{uri:source}} style={style} />  )  }
}


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <GetImage source={user.avatar} style={styles.userImg} />
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userBtnWrapper}>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={onLogout}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
        </View>
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{PostData.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
              <TouchableOpacity
               onPress={()=>{ 
               navigation.navigate('NavigationOtherScreen', {name:'FollowerScreen', user:user})}
               }>
                 <Text style={styles.userInfoTitle}>{user.follower}</Text>
                  <Text style={styles.userInfoSubTitle}>Followers</Text>
             </TouchableOpacity>
          </View>
          <View style={styles.userInfoItem}>
              <TouchableOpacity
               onPress={()=> 
               {
                navigation.navigate('NavigationOtherScreen',{name:'FollowingScreen', navigation:navigation, user:user})}
               }
              >
                  <Text style={styles.userInfoTitle}>{user.following}</Text>
                  <Text style={styles.userInfoSubTitle}>Following</Text>
              </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postContainer}>
          <FlatList
             scrollEnabled={false}
             data={PostData}
              horizontal={false}
              renderItem={({item}) => (
                  <View style={{width:"100%",flex:1}} key={item.ownerID}>
                    <PostHeader data={item} user={user} />
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