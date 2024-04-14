import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart'; 


export default OwnerBar =({navigation}) =>{

    const onLogout = () => {
        auth()
        .signOut()
        .then(() => {
            Alert.alert('Thong bao','User signed out!')
            RNRestart.Restart();
        })
        .catch(error => console.log('error :', error));
    };

    return (
        <View style={styles.userBtnWrapper}>
            <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={onLogout}>
                <Text style={styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
      },
      userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 3,
        paddingHorizontal: 6,
        marginHorizontal: 5,
      },
      userBtnTxt: {
        color: '#2e64e5',
      },
})