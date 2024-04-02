import {View, Text,Image,TouchableOpacity,ScrollView, Alert, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../utils/Colors';
import {FriendData} from '../data/FriendData';

// const FriendScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Danh sách bạn bè</Text>
//     </View>
//   );
// };

const addFriend = () => {

     Alert.alert('Đã gửi lời mời kết bạn' );
}


const FriendScreen = () => {
const value = 'Kết bạn';

  return (
    <ScrollView style={styles.postContainer}>
      {FriendData.map(item => (
        <View key={item.id} style={styles.container}>
         <View style={styles.row}>
          <Image source={item. profileImg}  style={styles.profileImg}/>
          <Text style={styles.textName}>{item.name}</Text>
         </View >
           <TouchableOpacity onPress={addFriend} style={styles.loginButton}>
{                         <Text style={styles.login}>Kết bạn</Text> }

                          </TouchableOpacity>
        </View>



      ))}
    </ScrollView>
  );
};



const styles = StyleSheet.create({

    container: {
        backgroundColor: Colors.white,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      },


   row: {
       flexDirection: 'row',
       paddingTop:10,

      marginTop:10,
      border:1,

      marginBottom: 15,
    },
  title: {
    fontSize: 22,
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  profileImg: {
      height: 35,
      width: 35,
      marginLeft:30,
      marginBottom:10,
      borderRadius: 50,
    },
    loginButton: {
        backgroundColor: Colors.primaryColor,
        padding: 20,
        borderRadius: 20,
        width: 100,

        alignItems: 'center',
        marginTop: 12,
      },
      login: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '500',
      },
  textName: {
  marginLeft:20,
  paddingTop:5,
  }

});

export default FriendScreen;
