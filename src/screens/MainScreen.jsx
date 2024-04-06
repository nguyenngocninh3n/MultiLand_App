import React from 'react';
import Header from '../components/Header';
import BottomTabbar from '../navigation/BottomTabbar';

const MainScreen = ({navigation}) => {
  console.log('navigation info at MainScreen: ', navigation)
  return (
    <>
      <Header navigation={navigation} />
      <BottomTabbar navigation={navigation}  />
    </>
  );
};

export default MainScreen;
