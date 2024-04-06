import {StyleSheet, View, ScrollView} from 'react-native';
import React from 'react';
import SubHeader from '../components/SubHeader';
import Stories from '../components/Stories';
import {Colors} from '../utils/Colors';
import Post from '../components/Post';

const HomeScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.homeContainer}>
      <SubHeader navigation={navigation} />
      <Stories />
      <Post />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
  },
});

export default HomeScreen;
