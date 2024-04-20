import { StyleSheet, Text, TouchableOpacity, View, Image, TouchableHighlight } from "react-native"
import OwnerBar from "./OwnerBar";
import auth from '@react-native-firebase/auth'
import UserBar from "./UserBar";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore'
export default ProfileHeader = ({navigation, PostData, userData}) => {

 
 
  const [user, setUser] = useState(userData)
  const [oldScreen, setOldScreen] = useState('')
      useEffect(()=>{
        firestore().collection("users").doc(userData.uid).onSnapshot((res) => {
         
          if(res != null) 
            {
                setUser(res.data());
                if(userData.uid == auth().currentUser.uid) {
                  setOldScreen('OwnerProfile')
                }
              else {
                setOldScreen('UserProfile')
              }
            }
        })
       
   },[userData])


    const GetImage =({source, style}) => {
        if(source=="" || source == null) {   return;  }
        else {   return (   <Image source={{uri:source}} style={style} />  )  }
    }

    const GetBar =(userItem) => {
        if(userData.uid == auth().currentUser.uid) {
          return <OwnerBar />
        }
      else {
        return <UserBar navigation={navigation} userData={userData} />
      }
    }

    return (
        <View >
            <TouchableHighlight>
            <View style={styles.container}>
                <GetImage source={userData.avatar} style={styles.userImg} />
                <Text style={styles.userName}>{userData.name}</Text>
            </View>
            </TouchableHighlight>
           <View style={{marginTop:-10}}>
                <GetBar userItem={userData} />
           </View>
            <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{PostData.length}</Text>
                <Text style={styles.userInfoSubTitle}>Posts</Text>
            </View>
            <View style={styles.userInfoItem}>
                <TouchableOpacity
                onPress={()=>{ 
                navigation.navigate('NavigationOtherScreen', {name:'FollowerScreen', oldScreen:oldScreen, user:userData})}
                }>
                    <Text style={styles.userInfoTitle}>{user.follower}</Text>
                    <Text style={styles.userInfoSubTitle}>Followers</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userInfoItem}>
                <TouchableOpacity
                onPress={()=> 
                {
                    navigation.navigate('NavigationOtherScreen',{name:'FollowingScreen',oldScreen:oldScreen, user:userData})}
                }
                >
                    <Text style={styles.userInfoTitle}>{user.following}</Text>
                    <Text style={styles.userInfoSubTitle}>Following</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        backgroundColor: '#fff',
        marginTop:-50,
        marginBottom:20,
      },
    userImg: {
        marginTop:400,
        marginBottom:0,
        height: 150,
        width: 150,
        borderRadius: 75,
        borderColor: '#eee',
        borderWidth:1,
      },
      userName: {
        fontSize: 24,
        fontWeight: '500',
        color:'#0f5fff',
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
    
})