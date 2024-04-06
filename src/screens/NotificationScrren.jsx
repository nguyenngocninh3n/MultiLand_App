import {View, Text, Image,TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {Colors} from '../utils/Colors';
import {NotifyData} from '../data/NotifyData'
const NotificationScrren = () => {

  return (
    <ScrollView style={styles.notifyContainer}>
      {NotifyData.map(item => (
        <View key={item.id} style={item.state==1?styles.container:styles.container0}>
         <View style={styles.row}>
          <Image source={item. profileImg}  style={styles.profileImg}/>
          <Text style={styles.textName}>{item.name}</Text>
         </View >
          <View>
          <Text>{item.content}</Text>
          </View>


        </View>



      ))}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
    notifyContainer: {
     backgroundColor: Colors.white,
    },



    container: {
        backgroundColor: Colors.white,
        padding: 16,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        backgroundColor: Colors.notify,
      },
      container0: {
              backgroundColor: Colors.white,
              padding: 16,
      //         flexDirection: 'row',
      //         justifyContent: 'space-between',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              backgroundColor: Colors.white,

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
      marginLeft:10,
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

export default NotificationScrren;
