import { StyleSheet, Alert, TextInput, Image, TouchableOpacity, PermissionsAndroid, View, SafeAreaView, Text  } from "react-native"
import React, { useState, useEffect }  from "react"
import Fire from "../../../Fire";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Ionicon from "react-native-ionicons"
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Colors} from "../../utils/Colors"

import AntDesign from 'react-native-vector-icons/dist/AntDesign'

import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

import VectorIcon from "../../utils/VectorIcon";

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Icon from "react-native-ionicons";

export default NewPost =({navigation, route}) => {

  // console.log("navigation in new post - info: ",navigation.goBack())
  console.log("route in new post - info: ", route)

   const [content, setContent] = useState("");
   const [image, setImage] = useState(null);
   const [image_state, setImage_state] = useState(false)
   const [user,setUser] = useState({});

  useEffect(()=> {
    firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .get()
  .then(documentSnapshot => {
    // console.log('User exists: ', documentSnapshot.exists);
    if (documentSnapshot.exists) {
      // console.log('User data: ', documentSnapshot.data());
      setUser(documentSnapshot.data())
    }
  });
  },[])

    const openImage = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Cho phép truy cập vào camera',
              message:
                'Cần quyền truy cập vào thư viện ảnh ',
              buttonNeutral: 'Hỏi tôi sau',
              buttonNegative: 'Không cho phép',
              buttonPositive: 'Đồng ý',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // console.log('You can use the camera');
            // const result = await launchCamera({mediaType:'photo',cameraType:'front'})
            const result = await launchImageLibrary({mediaType:'photo'})
            setImage_state(true)
            setImage(result.assets[0].uri);
            
          } else {
            // console.log('Camera permission denied');
            Alert.alert('Chưa cấp quyền')
          }
        } catch (err) {
          console.warn(err);
        }
      };

    
      const post_finish =() => {
        navigation.navigate('LoginScreen')
      }

      handlePost = async () => {

         Fire.shared.addPost({content:content.trim().toString(), localUri: image})
                    .then(ref => {
                        setContent("");
                        setImage(null);
                        setImage_state(false)
                    })
                    .catch(error => {
                        Alert.alert(error)
                        // console.log("error: " + error)

                    })
       try{
        navigation.goBack();
       }
       catch(err) {console.log('lỗi khi navigation sau khi dang bai ', err)}

      }

    return(

        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity >
                    <Ionicon name="md-arrow-back"
                            size={24}
                            color="#D8D9DB" />
                </TouchableOpacity>
                <TouchableOpacity onPress={ 
                 handlePost
                }>
                    <Text style={{fontSize:24, marginRight:20}}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                {/* <Image source={{uri:user.avatar}} style={styles.avatar} /> */}
                <TextInput
                    onChangeText={ value => {setContent(value)}}
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={6}
                    style={{flex:1}}
                    placeholder="Ngày hôm nay của bạn thế nào?" 
                    value={content}    
                    />
                   
            </View>
            <TouchableOpacity onPress={openImage} style={styles.photo}>
                <AntDesign
                                 
                                  name="picture"
                                  size={35}
                                />
            </TouchableOpacity>
            <View>
                  <Image source={image?{uri:image}:{}} 
                  
                        style={{width:'100%',
                                height: '100%',
                                }} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:10,
        paddingVertical: 12,
        borderBottomWidth:1,
        borderBottomColor: '#d8D9DB'
    },
    inputContainer: {
        margin:32,
        flexDirection:'row',
    },
    avatar: {
        width:48,
        height:48,
        borderRadius: 24,
        marginRight:16,
    },
    photo: {
        alignItems:'flex-end',
        marginHorizontal:32,
    },


})