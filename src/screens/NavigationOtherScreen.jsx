import React from 'react';
import Header from '../components/Header';
import BottomTabbar from '../navigation/BottomTabbar';
import { View } from 'react-native';

import GoBackScreen from './GoBackScreen';
import NewPost from './post/NewPost';
import UserProfile from './profile/UserProfile';
import FollowingScreen from './profile/FollowingScreen';
import FollowerScreen from './profile/FollowerScreen';

import firestore from '@react-native-firebase/firestore'

const NavigationOtherScreen = ({navigation, route}) => {

  const {name, user} = route.params;

  const GetScreen =() => {
    if(name == "NewPost") return <NewPost />
    else if (name == 'UserProfile') 
      {
        console.log('bat dau user profile')
        return <UserProfile navigation={navigation} user={user} />
      }
    else if (name == 'FollowingScreen' )  {
      return <FollowingScreen  navigation={navigation} user={user}   />
    }
    else if (name == "FollowerScreen") 
      return <FollowerScreen  navigation={navigation} user={user}  />
   }

  return (

    <View>
      <GoBackScreen navigation={navigation}/>
      <View style={{height:'100%'}}>
      <GetScreen />
      </View>
    </View>

  );
};

export default NavigationOtherScreen;