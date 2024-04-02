import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import textLogo from '../assets/images/text-logo.png';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../utils/Colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign  from 'react-native-vector-icons/dist/AntDesign';



import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Feather from 'react-native-vector-icons/dist/Feather';


import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import { Icon } from 'react-native-paper';


const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={textLogo} style={styles.fbLogoStyle} />
      <View style={styles.headerIcons}>
        <View style={styles.searchBg}>
          <AntDesign
            name="search1"
            type="AntDesign"
            size={24}
            color={Colors.grey}
          />
        </View>
       
        <View style={styles.searchBg}>
            <AntDesign
            name="message1"
            type="AntDesign"
            size={24}
            color={Colors.grey}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fbLogoStyle: {
    height: 25,
    width: 130,
  },
  searchBg: {
    backgroundColor: Colors.lightgrey,
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcons: {
    flexDirection: 'row',
  },
});

export default Header;
