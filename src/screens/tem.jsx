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

const UserProfile = ({navigation, route}) => {
  
  

  const [user, setUser] = useState({})
  const [PostData,setPostData] = useState([])
  const [follow_user, setFollow_user] = useState(null)
  const [follow_state, setFollow_state] = useState(false)

  useEffect(()=> {
    console.log('******get user****')
    firestore().collection('users').doc(route.params.dataUser.uid).get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists) {
          setUser(documentSnapshot.data())
          console.log('kiem tra get user o user profile : ',user)
      }
      else { console.log('get user, thất bại: ')}
    }).catch( error => {console.log('lỗi khi get user: ', error)})
      
  },[])

  useEffect(() => {
    const subscriber = firestore().collection("posts").where("ownerID","==",route.params.dataUser.uid).onSnapshot((res) => {
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
    console.log('b******get follow user****')

    firestore().collection('users').doc(auth().currentUser.uid).get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists) {
          setFollow_user (documentSnapshot.data());
          console.log('get user, thanh cong: ', follow_user)
      }
      else { console.log('get user, thất bại: ')}
    }).catch( error => {console.log('lỗi khi get user: ', error)})
    console.log('gia tri userfollow trong function get: ', follow_user)
},[follow_state])

  
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

useEffect(()=>{
    if(follow_user != null) updateUserInfo();
},[follow_state])

const updateUserInfo = () => {
  let value = follow_state?1:-1;
  firestore().collection('users').doc(follow_user.uid).update({following: user.following+value})
  .then(documentSnapshot => {console.log('update user info thanh cong')})
  .catch(error => {console.log('loi khi update infor: ', error)});
  
  firestore().collection('users').doc(user.uid).update({follower: user.follower+value})
  .then(documentSnapshot => {console.log('update user info thanh cong')})
  .catch(error => {console.log('loi khi update user infor: ', error)});
  
}

const createFollower = ( follow_user, user) => {
  let arr = [follow_user]
  firestore().collection('followers').doc(user.uid).set({
    followerID: user.uid,
    data: arr,
  })
  .then(ref => {  console.log('tạo follower thành công: ',ref) })
  .catch(error => {console.log('lỗi khi tạo follower: ',error)}) 
}

const createFollowing = (currentUser_id, user) => {
  let arr = [user]
  firestore().collection('followings').doc(auth().currentUser.uid).set({
    followingID: currentUser_id,
    data: arr,
  })
  .then(ref => {  console.log('tạo following thành công: ',ref) })
  .catch(error => {console.log('lỗi khi tạo following: ',error)}) 
}

const updateFollowing = (currentUser_id, following, user) => {
    let arr = following.data;
    arr.push(user)
    firestore().collection('followings').doc(currentUser_id)
                .update({
                    data: arr,
                }).then(res => {console.log('update following thanh cong: ', res)})
                  .catch( error => {console.log('update following that bai: ', error)})
}

const updateFollower = (follower, follow_user, user) => {
  let arr = follower.data;
  arr.push(follow_user)
  firestore().collection('followers').doc(user.uid)
              .update({   data: arr,
              }).then(res => {console.log('update follower thanh cong: ', res)})
                .catch( error => {console.log('update follower that bai: ', error)})
}


const [followingData, setFollowingData] = useState(null)
useEffect(()=>{
  let  currentUser_id = auth().currentUser.uid;
   firestore().collection('followings').doc(currentUser_id).get()
  .then(documentSnapshot => {
    if(documentSnapshot.exists) {
        console.log('following có ton tại: ',documentSnapshot )
        let following = documentSnapshot.data();
        setFollowingData(following)
    }
    else {
        console.log('following khong ton tại: ',documentSnapshot )
    }
  })

  if(followingData!=null && followingData != undefined )
        {
            let map = new Map()
            for (const item of followingData.data) {
                map.set(item.uid,item);
             
            }
            console.log('***** In ra danh sach map: ', map)
            if(map.has(route.params.dataUser.uid)) {
              setFollow_state(true)
            } else setFollow_state(false)
        }

}, [])

const onFollower = () => {
 
  firestore().collection('followers').doc(user.uid).get()
  .then(documentSnapshot => {
    if(documentSnapshot.exists) {
        console.log('follower có ton tại: ',documentSnapshot )
        let follower = documentSnapshot.data();
        updateFollower(follower,follow_user,user)
    }
    else {
        console.log('follower khong ton tại: ',documentSnapshot )
        createFollower(follow_user,user)
    }
  }).catch(error => {'lôi khi followr: ',error})
}

const onFollowing = () => {
 
  let  currentUser_id = auth().currentUser.uid;
  firestore().collection('followings').doc(currentUser_id).get()
  .then(documentSnapshot => {
    if(documentSnapshot.exists) {
        console.log('following có ton tại: ',documentSnapshot )
        let following = documentSnapshot.data();
        updateFollowing(currentUser_id,following,user)
    }
    else {
        console.log('following khong ton tại: ',documentSnapshot )
        createFollowing(currentUser_id,user)     
    }
  })
}
const onFollow = () => {
  let value = !follow_state;
  setFollow_state(value)
    onFollowing();
    onFollower();
    
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
            <Text style={styles.userInfoTitle}>{user.follower}</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{user.following}</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
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