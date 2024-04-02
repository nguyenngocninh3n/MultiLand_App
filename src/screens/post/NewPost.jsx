import { StyleSheet, TextInput, Image, TouchableOpacity, PermissionsAndroid, View, SafeAreaView, Text  } from "react-native"
import React, { useState }  from "react"
import Fire from "../../../Fire";

import Ionicon from "react-native-ionicons"
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Colors} from "../../utils/Colors"

import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'




export default NewPost =(navigation) => {

   const [content, setContent] = useState("");
   const [image, setImage] = useState(null);


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
            console.log('You can use the camera');
            // const result = await launchCamera({mediaType:'photo',cameraType:'front'})
            const result = await launchImageLibrary({mediaType:'photo'})
            setImage(result.assets[0].uri);
          } else {
            console.log('Camera permission denied');
            Alert.alert('Chưa cấp quyền')
          }
        } catch (err) {
          console.warn(err);
        }
      };

      handlePost = () => {
       console.log("start handle")
        Fire.shared.addPost({content:content.trim(), localUri: image})
                    .then(ref => {
                        setContent("");
                        setImage(null);
                  console.log("middle handle")

                    })
                    .catch(error => {
                        Alert.alert(error)
                        console.log("error: " + error)

                    })

       console.log("finish handle")

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
                   async () => {
  const path = `photos/`
  console.log("gia tri uri: ",image )
 
      // const response = await fetch(uri);
      // const file = await response.blob();

     try {
      let upload = storage().ref(path);
      await upload.putFile(image)
      const url = await upload.getDownloadURL(); 
      console.log("upload thanh cong, path file: ",url)
     }  catch(err) {
      console.log("loi upload file: ",err)
     }
 
       
  
}
                }>
                    <Text>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image source={require("../../assets/images/img1.jpeg")} style={styles.avatar} />
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
            <TouchableOpacity style={styles.photo}>
                <Ionicon onPress={openImage} name="md-camera" size={32} color={Colors.green} />
            </TouchableOpacity>
            <View>
                <Image source={{uri:image}}
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
        justifyContent: 'space-around',
        paddingHorizontal:32,
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