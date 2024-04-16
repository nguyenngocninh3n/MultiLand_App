import React from 'react';
import Header from '../components/Header';
import BottomTabbar from '../navigation/BottomTabbar';
import { View } from 'react-native';

import GoBackScreen from './GoBackScreen';
import NewPost from './post/NewPost';
import UserProfile from './profile/UserProfile';
import FollowingScreen from './profile/FollowingScreen';
import FollowerScreen from './profile/FollowerScreen';
import ChatScreen from './chat/ChatScreen';
import firestore from '@react-native-firebase/firestore'

const NavigationOtherScreen = ({navigation, route}) => {

  const {name, user} = route.params;

  const GetScreen =() => {
    if(name == "NewPost") return <NewPost />
    else if (name == 'UserProfile') 
      {
        console.log('bat dau user profile')
        return (
          <View>
            <GoBackScreen navigation={navigation}/>
            <View style={{height:'100%'}}>
              <UserProfile navigation={navigation} user={user} />
          </View>
          </View>
        ) 
      }
    else if (name == 'FollowingScreen' )  {
      const oldScreen = route.params.oldScreen
      return (
        <View>
          <GoBackScreen navigation={navigation} user={user} oldScreen={oldScreen}/>
          <View style={{height:'100%'}}>
          <FollowingScreen  navigation={navigation} user={user}   />
        </View>
        </View>
      ) 
    }
    else if (name == "FollowerScreen") {
      const oldScreen = route.params.oldScreen
      return (
        <View>
          <GoBackScreen navigation={navigation} user={user}  oldScreen={oldScreen} />
          <View style={{height:'100%'}}>
          <FollowerScreen  navigation={navigation} user={user} />
        </View>
        </View>
      ) 
    }
     
      else if (name == 'ChatScreen') {
        const oldScreen = route.params.oldScreen
        const user_2 = route.params.user_2;
        return <ChatScreen navigation={navigation} oldScreen={oldScreen} user_1_Data={user} user_2_Data ={user_2} />
      }

   }
   

  return (

    <View>
      <GetScreen />
    </View>

  );
};

export default NavigationOtherScreen;
