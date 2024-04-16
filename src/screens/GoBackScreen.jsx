import { StyleSheet, Text, TouchableHighlight, TouchableHighlightBase, View } from "react-native"
import AntDesign  from 'react-native-vector-icons/dist/AntDesign';
import UserProfile from "./tem";


export default GoBackScreen = ({navigation, label, user, oldScreen}) => {

    const onGoBack = () => {
        if(oldScreen == 'UserProfile' ) {
            navigation.navigate('NavigationOtherScreen',{name:'UserProfile', user: user})
        }
        else if(oldScreen == 'OwnerProfile') {
            navigation.navigate('OwnerProfile')
        }
        else {
            navigation.goBack();
        }
    }

    return(
        <View style={styles.container}>
            <TouchableHighlight style={styles.touchHightligh} underlayColor={'#fff'}  onPress={onGoBack}>
                <AntDesign name="leftcircleo" color='#13f' size={30} />
            </TouchableHighlight>
            <Text  style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
       flexDirection: 'row',
       maxWidth:'100%',
        alignItems:'center',
        backgroundColor:'#eee',
        marginBottom:10,
    },

    touchHightligh: {
        width:60,
        paddingLeft:20,
      
    },
    label: {
        fontSize:20,
        justifyContent:'center',
        width:'100%',
        margin:20,
        textTransform:'uppercase',
    }
})