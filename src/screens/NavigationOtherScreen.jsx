import React from 'react';
import Header from '../components/Header';
import BottomTabbar from '../navigation/BottomTabbar';
import { View } from 'react-native';

import GoBackScreen from './GoBackScreen';
import NewPost from './post/NewPost';
import UserProfile from './UserProfile';
import FollowingScreen from './FollowingScreen';
import FollowerScreen from './FollowerScreen';

import firestore from '@react-native-firebase/firestore'

const NavigationOtherScreen = ({navigation, route}) => {
  // console.log('navigation info at MainScreen: ', navigation)
  // const name = route.params.name;
  // const user = route.params.user;
  // const navigation = route.params.navigation;

  const {name, user} = route.params;

  const GetScreen =() => {
    if(name == "NewPost") return <NewPost />
    else if (name == 'UserProfile') 
      {
        console.log('bat dau user profile')
        return <UserProfile navigation={navigation} user={user} />
      }
    else if (name == 'FollowingScreen' )  {
      console.log('**********start following sreen')
      console.log('...')
      console.log('...')
      console.log('...')
      console.log('...')

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
