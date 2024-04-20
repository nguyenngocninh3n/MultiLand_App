import { StyleSheet, Alert, TextInput, Image, TouchableOpacity, PermissionsAndroid, View, SafeAreaView, Text, ScrollView  } from "react-native"
import React, { useState, useEffect }  from "react"
import Fire from "../../../Fire";

import Ionicon from "react-native-ionicons"
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'


export default NewPost =({navigation}) => {

   const [content, setContent] = useState("");
   const [image, setImage] = useState(null);
   const [image_state, setImage_state] = useState(false)
   const [user,setUser] = useState({});
   const [imgSize,setImgSize] = useState({})
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
            const result = await launchImageLibrary({mediaType:'photo'})
            if( result.assets[0].uri != undefined) {
              setImage_state(true)
              setImage(result.assets[0].uri);
            }
            console.log('gia tri cua img la: ',image)
          } else {
            Alert.alert('Chưa cấp quyền')
          }
        } catch (err) {
          console.log(err);
        }
      };

      const post_finish =() => {   navigation.navigate('LoginScreen')  }

      handlePost = async () => {
          await Fire.shared.addPost({content:content.trim().toString(), localUri: image})
                    .then(ref => {
                        setContent("");
                        setImage(null);
                        setImage_state(false)
                    })
                    .catch(error => {
                        console.log("error: " + error)
                    })
          try{     navigation.goBack();  }
          catch(err) {console.log('lỗi khi navigation sau khi dang bai ', err)}

      }

      const GetImage =({source}) => {
        if(source=="" || source == null) {   return;  }
        else {   return (   <Image source={{uri:source}} style={styles.avatar} />  )  }
      }

      const GetImageUpload =({source}) => {
        if(source=="" || source == null) {   return;  }
        else {   return (   <Image style={{marginRight:20,
        marginBottom:10, width:'100%', height:'100%', resizeMode:'contain'}} source={{uri:source}} />  )  }
      }


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                <AntDesign name="leftcircleo" color='#13f' size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={   handlePost     }>
                    <Text style={{fontSize:24, marginRight:20}}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <GetImage source={user.avatar} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={ value => {setContent(value)}}
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={6}
                    placeholder="Ngày hôm nay của bạn thế nào?" 
                    value={content}    
                    />
                   
            </View>
            <TouchableOpacity onPress={openImage} style={styles.photo}>
                <AntDesign name="picture" size={35}      />
            </TouchableOpacity>
            <View style={{height:'60%'}}>
            
               <GetImageUpload source={image}/>
              
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
        margin:20,
        flexDirection:'row',

       
    },
    avatar: {
        width:48,
        height:48,
        borderRadius: 24,
        marginRight:16,  
      
    },
    imgPost: {
      width:'100%',
      height:'100%',
    },
    textInput: {
      width:'80%',
      fontSize:16,
      marginLeft:16,  

    },
    photo: {
        alignItems:'flex-end',
        marginHorizontal:32,
    },


})