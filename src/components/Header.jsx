import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import Logo from '../assets/images/logo.png';

import {Colors} from '../utils/Colors';
import AntDesign  from 'react-native-vector-icons/dist/AntDesign';
import { TextInput } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';



const Header = () => {

  const [inputSearch_state, setInputSearch_state] = useState(styles.hideInputSearch)
  const [search_state, setSearch_state] = useState(styles.showInputSearch)
  const [search_onclick,setSearch_onlick] = useState(false);
  useEffect(()=>{
    if(search_onclick==false) {
      setInputSearch_state(styles.hideInputSearch)
      setSearch_state(styles.showInputSearch)
    }
    else {
      setInputSearch_state(styles.showInputSearch)
      setSearch_state(styles.hideInputSearch)
    }
  },[search_onclick])


  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.fbLogoStyle} />
      <View style={styles.headerIcons}>
        <View style={inputSearch_state}>
        <View style={styles.search_container}>
            <TextInput multiline={true} 
                      placeholder='Nhập nội dung vào đây' />
            <TouchableOpacity onPress={()=>{
              setSearch_onlick(!search_onclick)
          }}>
              <Text>Tìm kiếm</Text>
            </TouchableOpacity>
        </View>
        </View>
        <View  style={styles.showInputSearch}>
        <View style={styles.searchBg}>
          <TouchableOpacity onPress={()=>{
              setSearch_onlick(!search_onclick)
          }}>
            <AntDesign
              name="search1"
              type="AntDesign"
              size={24}
              color={Colors.grey}
            />
          </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  fbLogoStyle: {
    height: 25,
    width: 25,
  },

  hideInputSearch: {
    display:'none'
  },

  showInputSearch: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
    
  },
  search_container: {
      flexDirection:'row',
      alignItems:'center',
      height:40,
      width: 200,
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
