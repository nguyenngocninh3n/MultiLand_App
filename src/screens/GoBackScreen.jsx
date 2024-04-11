import { StyleSheet, TouchableHighlight, TouchableHighlightBase, View } from "react-native"
import AntDesign  from 'react-native-vector-icons/dist/AntDesign';


export default GoBackScreen = ({navigation}) => {

    const onGoBack = () => {
        navigation.goBack();
    }

    return(
        <View style={styles.container}>
            <TouchableHighlight style={styles.touchHightligh} underlayColor={'#fff'}  onPress={onGoBack}>
            <AntDesign name="leftcircleo" size={24} />
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
       
        justifyContent:'center',
        backgroundColor:'#eee'
    },

    touchHightligh: {
        height:50,
        padding: 10,
    }
})