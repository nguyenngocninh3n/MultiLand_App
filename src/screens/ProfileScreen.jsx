import {View, Text,Image, PermissionsAndroid, ScrollView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {Colors} from '../utils/Colors';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from './OwnerProfile';



const ProfileScreen = (navigation) => {
  const onLogout = () => {
    auth()
      .signOut()
      .then(() => Alert.alert('Thong bao','User signed out!'))
      .catch(error => console.log('error :', error));
  };

  

  return (
    <ScrollView>
       <View>
         <Image  />
       </View>
       <View>
         <Image />
       </View>
       <View>
       <Text></Text>
       </View>


    <View style={styles.container}>
      <Text style={styles.title}>Trang cá nhân</Text>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.imgButton}>
        <Text style={styles.logout}>Open Camera</Text>
      </TouchableOpacity>
     
      
    </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: Colors.primaryColor,
    fontWeight: '500',
    marginTop: 30,
  },
  logout: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '500',
  },
  logoutButton: {
  marginTop:200,
    backgroundColor: Colors.primaryColor,
    padding: 12,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    marginBottom: 30,
  },
  imgButton: {
    marginTop:100,
      backgroundColor: Colors.primaryColor,
      padding: 12,
      borderRadius: 20,
      width: '90%',
      alignItems: 'center',
      marginBottom: 30,
    },
});

export default ProfileScreen;
