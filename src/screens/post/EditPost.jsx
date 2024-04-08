import { useState } from "react";
import { Image, View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import Fire from "../../../Fire";


export default EditPost = ({route, navigation}) => {

    console.log('thong tin edit - route: ',route);
    console.log('thong tin edit - route params: ',route.params.dataPost)

    const dataPost = route.params.dataPost;
    const [newContent, setNewContent] = useState(dataPost.content)

    const onUpdatePost = async () =>{
        await Fire.shared.editPost({postID: dataPost.postID, newContent: newContent});
        navigation.goBack();
    }

    return(
        <View style={styles.container}>
        <Text style={styles.labelText}>Chỉnh sửa nội dung bài viết</Text>
            <TextInput style={styles.textInput} 
                       multiline={true} value={newContent}
                       onChangeText={setNewContent} />
            <Image style={styles.image} source={{uri:dataPost.image}} />
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
    },
    labelText: {
        fontSize:20,
        fontWeight:'800',
        marginBottom:10,
    },
    textInput: {
        width:'100%',
        height: 200,
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