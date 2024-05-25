import { useState } from "react";
import { Image, View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import Fire from "../../../Fire";
import GoBackScreen from "../GoBackScreen";

export default EditPost = ({ navigation,route}) => {

    const dataPost = route.params.dataPost;
    const [newContent, setNewContent] = useState(dataPost.content)

    const onUpdatePost = async () =>{
        await Fire.shared.editPost({postID: dataPost.postID, newContent: newContent});
        navigation.goBack();
    }
    const GetImage =({source}) => {
        if(source=="" || source == null) {   return;  }
        else {   return (   <Image source={{uri:source}} style={styles.image}/>  )  }
      }

    return(
        <View style={styles.container}>
        <GoBackScreen navigation={navigation} label={'Chỉnh sửa bài viết'} />
       
            <TextInput textAlignVertical="top" multiline={true} style={styles.textInput} 
                       value={newContent}
                       onChangeText={setNewContent} />
            <GetImage source={dataPost.image} />
            <TouchableOpacity onPress={onUpdatePost} style={styles.savePost}>
                <Text  style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        padding:  20,
        backgroundColor:'#fff'
    },
    labelText: {
        fontSize:20,
        fontWeight:'800',
        marginBottom:10,
    },
    textInput: {
        
        width:'100%',
        height:300,

        backgroundColor:'#eee',
        marginBottom:20,
        borderWidth:1,
        borderColor:'#ee5',
        fontSize:18,
    },
    image: {
        width:'100%',
        height: 300,
        marginBottom:20,
    },
    savePost: {
        backgroundColor:'#00f',
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    saveText: {
        fontSize:24,
        color:'#fff',


    }
})