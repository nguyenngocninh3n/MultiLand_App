import { StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import LoginScreen from './src/screens/LoginScreen';
import { Colors } from './src/utils/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import auth from '@react-native-firebase/auth';

import EditPost from './src/screens/post/EditPost';
import UserProfile from './src/screens/profile/UserProfile';
import NavigationOtherScreen from './src/screens/NavigationOtherScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
const Stack = createStackNavigator();

const App = () => {



  const [user, setUser] = useState();
  const onAuthStateChanged = (user: any) => setUser(user);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(()=>{console.log('in ra thong tin user khi login: ',user)},[user])

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.white} barStyle='dark-content' />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ?
         <>
             <Stack.Screen name="MainScreen"  component={MainScreen} />
             <Stack.Screen name="EditPost"  component={EditPost} />
             <Stack.Screen name='UserProfile' component={UserProfile} />
             <Stack.Screen name='ChatScreen' component={ChatScreen} />
             <Stack.Screen name='NavigationOtherScreen' component={NavigationOtherScreen} />
         </>
          :
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            
            
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;