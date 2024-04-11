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
import auth, { firebase } from '@react-native-firebase/auth';

import PostHeader from '../components/PostHeader';
import PostFooter from '../components/PostFooter';
import firestore from '@react-native-firebase/firestore'
import { TransitionIOSSpec } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';

const UserProfile = ({navigation, user}) => {
  
  

  // const [user, setUser] = useState(user)
  const [PostData,setPostData] = useState([])
  const [follow_user, setFollow_user] = useState(null)
  const [follow_state, setFollow_state] = useState(false)
  const [followingData, setFollowingData] = useState(null)

  const renderUser =() => {
    firestore().collection('users').doc(user.uid).get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists) { /* setUser(documentSnapshot.data());*/  console.log('thong tin user khi cap nhat: ',user) }
      else console.log('check thay doi user: none')  })
      
  }


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


  useEffect(()=> {
    firestore().collection('users').doc(auth().currentUser.uid).get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists) setFollow_user (documentSnapshot.data());
   })
   getFollowingData();
  },[])

    const getFollowingData = async () => {
      var arr;
      await firestore().collection('followings').doc(auth().currentUser.uid).get()
      .then(documentSnapshot => {
        if(documentSnapshot.exists) {
            let following = documentSnapshot.data();
           arr = following.data
            setFollowingData(arr)
            // console.log('hoàn thành get followingData', followingData)
            console.log('hoàn thành get following', arr)

        }
        })

        let map = new Map()
        if(arr!=null && arr != undefined ) {
            for (const item of arr) {
                map.set(item.uid,item); }
            if(map.has(user.uid)) {
              setFollow_state(true)
              console.log('========>>>>>>>>>>>>> true')
            }
            else {
              setFollow_state(false);
              console.log('========>>>>>>>>>>>>> fallse')}
        }
        setFollowingData(arr)
    }


const updateUserInfo = async () => {
  let value = follow_state?1:-1;
  await firestore().collection('users').doc(follow_user.uid)
  .update({following: user.following+value})
  
  await firestore().collection('users').doc(user.uid)
  .update({follower: user.follower+value}).then(res => {

  })
  getFollowingData();
}

const createFollower = ( follow_user, user) => {
  let arr = [follow_user]
  firestore().collection('followers').doc(user.uid).set({
    followerID: user.uid, data: arr,
  })
}

const createFollowing = (currentUser_id, user) => {
  let arr = [user]
  firestore().collection('followings').doc(auth().currentUser.uid).set({
    followingID: currentUser_id, data: arr,
  })
}

const updateFollowing = (currentUser_id, following, user) => {
    let arr = following.data;
    if(follow_state == true) arr.push(user)
    else{
      let map = new Map();
      for(const item of arr)
        map.set(item.uid,item)
      map.delete(user.uid);
      let new_arr = [];
      map.forEach((value,key) =>{new_arr.push(value)})
      arr = new_arr;
    }
    firestore().collection('followings').doc(currentUser_id)
   .update({ data: arr  })
}

    const updateFollower = (follower, follow_user, user) => {

      let arr =[] = follower.data;
      if(follow_state == true) arr.push(follow_user)
      else{
        let map = new Map();
        for(const item of arr)
          map.set(item.uid,item)
        map.delete(follow_user.uid);
        let new_arr = [];
        map.forEach((value,key) =>{new_arr.push(value)})
        arr = new_arr;
      }
      firestore().collection('followers').doc(user.uid)
                  .update({   data: arr })
    }

    
    const onFollower = () => {
    
      firestore().collection('followers').doc(user.uid).get()
      .then(documentSnapshot => {
        if(documentSnapshot.exists) {
            let follower = documentSnapshot.data();
            updateFollower(follower,follow_user,user)
        }
        else createFollower(follow_user,user)
      }).catch(error => {'lôi khi followr: ',error})
    }

    const onFollowing = () => {
      let  currentUser_id = auth().currentUser.uid;
      firestore().collection('followings').doc(currentUser_id).get()
      .then(documentSnapshot => {
        if(documentSnapshot.exists) {
            let following = documentSnapshot.data();
            updateFollowing(currentUser_id,following,user)
        }
        else createFollowing(currentUser_id,user)     
      })
    }

    const onFollow = async  () => {
      let value = !follow_state;
      setInit(false)
      setFollow_state(value)
      
    } 
    const [init,setInit] =  useState(true)
    useEffect(()=>{
      if(!init) {
        onFollowing();
      onFollower();
      renderUser();
      updateUserInfo();
      }
    },[follow_state])

    const onLogout = () => {
      auth().signOut()
        .then(() => Alert.alert('Thong bao','User signed out!'))
        .catch(error => console.log('error :', error));
    };

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
        <GetImage source={user.avatar} style={styles.userImg} />
        
        <Text style={styles.userName}>{user.name}</Text>
       
       
        <View style={styles.userBtnWrapper}>
        <TouchableOpacity style={{backgroundColor:'#f00'}} onPress={()=>console.log('gia tri fl_user: ',user)}>
        <Text fontSize='24'>textttt</Text>

        </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor:'#1ff', padding:10}} onPress={onFollow} >
                <Text style={styles.userBtnTxt}>{follow_state?'Following':'Follow'}</Text>
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