import {View, TextInput, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import Profile from '../assets/images/img1.jpeg';
import CameraRoll from '../assets/images/cameraroll.png';
import {Colors} from '../utils/Colors';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
const SubHeader = ({navigation, user}) => {

  // const user = userData;
  // const [user,setUser] = useState({});

  // useEffect(()=> {
  //   firestore()
  // .collection('users')
  // .doc(auth().currentUser.uid)
  // .get()
  // .then(documentSnapshot => {
  //   console.log('User exists: ', documentSnapshot.exists);
  //   if (documentSnapshot.exists) {
  //     console.log('User data: ', documentSnapshot.data());
  //     setUser(documentSnapshot.data())
  //   }
  // });
  // },[])

  const createNewPost = () =>{
    navigation.navigate('newpost')
  }

  const GetImage =({source}) => {
    if(source=="" || source == null) {  return; }
    else {  return ( <Image source={{uri:source}} style={styles.profileStyle} />  )  }
  }

  return (
    <View style={styles.container}>
      <GetImage source={user.avatar} />
      <View style={styles.inputBox} >
        <TouchableOpacity onPress={createNewPost}>
        <Text style={styles.inputStyle}>Thêm nội dung mới...</Text>
        </TouchableOpacity>
      </View>
      <Image source={CameraRoll} style={styles.cameraRoll} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  profileStyle: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 30,
    paddingHorizontal: 20,
    width: '70%',
    paddingVertical: 8,
  },
  inputStyle: {
    fontSize: 16,
    color: Colors.grey,
  },
});

export default SubHeader;
