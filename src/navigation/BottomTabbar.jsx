import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../utils/Colors';
import {TabData} from '../data/TabData';


import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import { Icon } from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();

const BottomTabbar = () => {
  return (
    <>
      <Tab.Navigator style={{height:150}}
        screenOptions={() => ({
          tabBarShowLabel: false,
          
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.grey,
        })} barStyle={{height:60, marginBottom:0 }}>

        {TabData.map(tab => (
          <Tab.Screen 
                            key={tab.id}
                            name={tab.name}
                            component={tab.route}
                            style = {{backgroundColor:tab.backgroundColor}}
                            options={{
                              tabBarIcon: ({color, focused}) => (
                                <VectorIcon
                                  type={tab.iconType}
                                  name={tab.iconName}
                                  size={focused ? tab.size : tab.unFocusSize}
                                  color={color}
                                  
                                  style={focused?{height:100, width:50, paddingLeft: 10, margintop:10 }:{height:100, width:50, paddingLeft: 10, margintop:-15 }}
                                />
                              ),
                              tabBarLabel:false,
                              
            }}




          />
        ))}
      </Tab.Navigator>
    </>
  );
};

export default BottomTabbar;
