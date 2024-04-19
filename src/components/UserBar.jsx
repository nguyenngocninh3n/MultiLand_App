import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { useState, useEffect } from "react"
export default UserBar = ({navigation,userData }) =>{


    const [follow_user, setFollow_user] = useState(null)
    const [follow_state, setFollow_state] = useState(false)
    const [followingData, setFollowingData] = useState([])
    const [user, setUser] = useState(userData)
   
    const startFunction =  () => {
      const value1 = firestore().collection('users').doc(auth().currentUser.uid).onSnapshot(documentSnapshot => {
        if(documentSnapshot.exists) setFollow_user (documentSnapshot.data());
     })

     firestore().collection("users").doc(userData.uid).onSnapshot((res) => {
      const comment_arr = []
      if(res != null) 
        console.log('comments exists')
            setUser(res.data());
    })
      const value3 = getFollowingData();
    }

    useEffect(  ()=> {
      
       
          startFunction();
       

   },[])
    
   
    const getFollowingData =  () => {
        
      firestore().collection('followings').doc(auth().currentUser.uid).get().then((res)=>{
        let following_temp = []  
        if(res.exists) {
               following_temp = res.data().data;
              console.log('hoàn thành get following in funtion',following_temp)
         
          let map = new Map()
          if(following_temp!=null && following_temp != undefined ) {
              for (const item of following_temp) {
                  map.set(item.uid,item); }
              console.log('gia tri cua map: ',map)
              console.log('gia tri cua user.uid',user.uid)
              if(map.has(user.uid)) {
                setFollow_state(true)
                console.log('========>>>>>>>>>>>>> true')
              }
              else {
                setFollow_state(false);
                console.log('========>>>>>>>>>>>>> fallse')}
          }
        }
      })
      }

  
  const updateUserInfo = async () => {
    let value = follow_state?1:-1;
    await firestore().collection('users').doc(follow_user.uid)
    .update({following: user.following+value})
    
    await firestore().collection('users').doc(user.uid)
    .update({follower: user.follower+value}).then(res => {
  
    })
    startFunction()
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