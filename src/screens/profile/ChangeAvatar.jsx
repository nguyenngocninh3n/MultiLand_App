import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { StyleSheet, Alert, TextInput, Image, TouchableOpacity, PermissionsAndroid, View, SafeAreaView, Text, ScrollView  } from "react-native"
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useState } from 'react';
import storage from '@react-native-firebase/storage'

export default ChangeAvatar = ({navigation}) => {

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [image_state, setImage_state] = useState(false)
    const [user,setUser] = useState({});
    const [imgSize,setImgSize] = useState({})

   
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
           
            if(result.assets[0].uri != undefined)
                setImage_state(true)
                setImage(result.assets[0].uri);
          
          } else {
            Alert.alert('Chưa cấp quyền')
          }
        } catch (err) {
          console.log(err);
        }
      };

    const GetImage =({source}) => {
      if(source=="" || source == null) {   return;  }
      else {   return (   <Image source={{uri:source}} style={styles.avatar} />  )  }
    }

    const GetImageUpload =({source}) => {
      if(source=="" || source == null) {   return;  }
      else {   return (   <Image style={{marginRight:20,
      marginBottom:10, width:'100%', height:'100%', resizeMode:'contain'}} source={{uri:source}} />  )  }
    }

    uploadPhoto = async uri => {
        const path = `photos/${this.uid}/${Date.now().toString()}.jpg`
        
        return new Promise(async(res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();
            let upload = storage().ref(path).put(file);
            upload.on("state_changed", 
                    snapshot => {},
                    err=> {rej(err)},
                    async () => {
                        const url = await upload.snapshot.ref.getDownloadURL();
                        url_remote = url;
                        console.log("path url: ",url)
                        res(url)
                    }  )
        })
    }

    const handlePost = async () => {


            localUri = image;
            var timePost = +Date.now().toString();
            var postID = this.uid+timePost;
            var remoteUri = null;
            if(localUri != null) {
            remoteUri = await this.uploadPhoto(localUri);  }        
            
            return new Promise((res, rej) => {
                firestore()
                .collection("users")
                .doc(auth().currentUser.uid).update({avatar:url_remote}).then(()=>{
                    navigation.goBack()
                })
                
                console.log('end promise')
            });
        };
    

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={()=>navigation.goBack()} >
            <AntDesign name="leftcircleo" color='#13f' size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={   handlePost     }>
                <Text style={{fontSize:24, marginRight:20}}>Up</Text>
            </TouchableOpacity>
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