import {View, Image, StyleSheet, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import UserProfile from '../assets/images/post1.jpeg';
import {Colors} from '../utils/Colors';
import VectorIcon from '../utils/VectorIcon';

import firestore from "@react-native-firebase/firestore"

const PostHeader = ({data}) => {

  const [user,setUser] = useState({});

  useEffect(()=> {
    firestore()
  .collection('users')
  .doc(data.ownerID)
  .get()
  .then(documentSnapshot => {
    // console.log('User exists: ', documentSnapshot.exists);
    
    if (documentSnapshot.exists) {
      // console.log('PostHeader - User exist: ');
      setUser(documentSnapshot.data())
    }
  });
  },[])


const formatDate = (timestamp) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};

  return (
    <View style={styles.postHeaderContainer}>
      <View style={styles.postTopSec}>
        <View style={styles.row}>
          <Image source={{uri:user.avatar}} style={styles.userProfile} />
          <View style={styles.userSection}>
            <Text style={styles.username}>{user.name}</Text>
            <View style={styles.row}>
              <Text style={styles.days}>{formatDate(data.timestamp)}</Text>
             
              <VectorIcon
                name="user-friends"
                type="FontAwesome5"
                size={13}
                color={Colors.headerIconGrey}
                style={styles.userIcon}
              />
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.caption}>{data.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postHeaderContainer: {
    padding: 16,
  },
  userProfile: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
  },
  postTopSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 2,
  },
  userSection: {
    marginLeft: 12,
  },
  days: {
    fontSize: 14,
    color: Colors.textGrey,
  },
  dot: {
    fontSize: 14,
    color: Colors.textGrey,
    paddingHorizontal: 8,
  },
  userIcon: {
    marginTop: 3,
  },
  headerIcons: {
    marginRight: 20,
  },
  caption: {
    color: Colors.grey,
    fontSize: 15,
    marginTop: 10,
  },
});

export default PostHeader;
