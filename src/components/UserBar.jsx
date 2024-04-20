import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { useState, useEffect } from "react"
export default UserBar = ({navigation,userData }) =>{


    const [follow_user, setFollow_user] = useState(null)
    const [follow_state, setFollow_state] = useState(false)
    const [followingData, setFollowingData] = useState([])
    const [followerData, setFollowerData] = useState([])
    const [user, setUser] = useState(userData)
   
    const startFunction =  () => {
      firestore().collection('users').doc(auth().currentUser.uid).onSnapshot(documentSnapshot => {
        if(documentSnapshot.exists) setFollow_user (documentSnapshot.data());
     })
     firestore().collection("users").doc(userData.uid).onSnapshot((res) => {
      const comment_arr = []
      if(res != null) 
            setUser(res.data());
    })
      getFollowingData();
      getFollowerData();
    }

    useEffect(  ()=> {
          startFunction();
   },[])
    
   
    const getFollowingData =  () => {
        
      firestore().collection('followings').doc(auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
          if(documentSnapshot.exists) {
            let arr = [];
            let temp = documentSnapshot.data().data;
            temp.forEach(value => {
              value.ref.get().then(res=> {
                arr.push(res.data())
                if(res.data().uid == userData.uid ) setFollow_state(true)
              })
            })
            setFollowingData(arr)
          }
      })
      
      }
      
      const getFollowerData =  () => {
        firestore().collection('followers').doc(userData.uid).
        onSnapshot(documentSnapshot => {
            if(documentSnapshot.exists) {
              let arr = [];
              let temp = documentSnapshot.data().data;
              temp.forEach(value => {
                value.ref.get().then(res=> {
                  arr.push(res.data())
                })
              })
              setFollowerData(arr)
  
            }
        })
        
        }
  
  const updateUserInfo = async () => {
    let value = follow_state?1:-1;
    await firestore().collection('users').doc(follow_user.uid)
    .update({following: follow_user.following+value})
    
    await firestore().collection('users').doc(user.uid)
    .update({follower: user.follower+value})
    // startFunction()
  }
  
  const createFollower = ( follow_user, user) => {
    let ref = firestore().collection('users').doc(follow_user.uid);
    let arr = [{ref: ref}]
    firestore().collection('followers').doc(user.uid).set({
      followerID: user.uid, data: arr,
    })
  }
  
  const createFollowing = (follow_user, user) => {
    let ref = firestore().collection('users').doc(user.uid);
    let arr = [{ref: ref}]
    firestore().collection('followings').doc(follow_user.uid).set({
      followingID: follow_user.uid, data: arr,
    })
  }
  
  const updateFollowing = async (following, follow_user_uid) => {
    var arr = [] ;
    let ref =  firestore().collection('users').doc(user.uid);
    if(follow_state == true) {
      following.push({ref:ref});
      arr = following;
    } 
    else {
          let temp_arr = [];
          followingData.forEach((item,index) => {
            if(item.uid != user.uid) temp_arr.push(following[index])
          });
          arr = temp_arr;
        }
    firestore().collection('followings').doc(follow_user_uid).update({ data: arr  })
  }

  const updateFollower = async (follower, user_uid) => {
    var arr = [] ;
    let ref =  firestore().collection('users').doc(follow_user.uid);
    if(follow_state == true) {
      follower.push({ref:ref});
      arr = follower;
    } 
    else {
          let temp_arr = [];
          followerData.forEach((item,index) => {
            if(item.uid != follow_user.uid) temp_arr.push(follower[index])
          });
          arr = temp_arr;
        }
    firestore().collection('followers').doc(user_uid).update({ data: arr  })
  }
  
     
  
      
      const onFollower = () => {
        firestore().collection('followers').doc(user.uid).get()
        .then(documentSnapshot => {
          if(documentSnapshot.exists) {
              let follower = documentSnapshot.data().data;            
              updateFollower(follower,user.uid)
        }
          else createFollower(follow_user,user)
        }).catch(error => {'lôi khi followr: ',error})
      }
  
      const onFollowing = () => {
        firestore().collection('followings').doc(follow_user.uid).get()
        .then(documentSnapshot => {
          if(documentSnapshot.exists) {
              let following = documentSnapshot.data().data;            
              updateFollowing(following,follow_user.uid)
        }
          else createFollowing(follow_user,user)     
        })
      }
  
      const onFollow =  () => {
        let value = !follow_state;
        setInit(false)
        setFollow_state(value)
        
      } 
      const [init,setInit] =  useState(true)
      useEffect(()=>{
        if(!init) {
          onFollowing();
        onFollower();
       
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
        <View style={styles.userBtnWrapper}>
              <TouchableOpacity style={{backgroundColor:'#1ff', padding:10}} onPress={onFollow} >
                <Text style={styles.userBtnTxt}>{follow_state?'Following':'Follow'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor:'#1ff', padding:10}} onPress={
                ()=>navigation.navigate('NavigationOtherScreen',{name:'ChatScreen',user:follow_user, user_2:userData})} >
                <Text style={styles.userBtnTxt}>Nhắn tin</Text>
              </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
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
})