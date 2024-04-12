import {StyleSheet, View, ScrollView, } from 'react-native';
import React, { useEffect, useState } from 'react';
import SubHeader from '../components/SubHeader';
import Stories from '../components/Stories';
import {Colors} from '../utils/Colors';
import Post from '../components/Post';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
const HomeScreen = ({navigation}) => {

  const [user,setUser] = useState({});

  useEffect(()=> {
    firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .get()
  .then(documentSnapshot => {
    if (documentSnapshot.exists) {
      setUser(documentSnapshot.data())
    }
  });
  },[])

  return (
    
      <ScrollView style={{ marginLeft:0}} >
      <View style={{flexDirection:'column'}}>
      <SubHeader navigation={navigation} user={user} />
      <Stories user={user} />
    <Post navigation={navigation} />
    </View>
    </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
  },
});

export default HomeScreen;
