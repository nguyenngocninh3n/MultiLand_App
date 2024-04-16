import { useState } from "react"
import { Text, View,  TextInput, TouchableHighlight, StyleSheet } from "react-native"


export default ResetPasswordScreen = ({navigation}) => {

  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Đặt lại mặt khẩu thành công</Text>
      <Text style={styles.textContent}>Trở lại màn hình đăng nhập?</Text>
      <TouchableHighlight onPress={()=>{navigation.navigate('LoginScreen')}} style={styles.touchSend}>
        <Text style={styles.textSend}>Tiếp tục</Text>
      </TouchableHighlight>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    backgroundColor:'#eef',
    marginLeft:20,
    marginRight:20,  
  },

  textTitle: {
    fontSize:20,
    fontWeight:'800',
    textAlign:'center',
    marginVertical:30,
  },
  textContent: {
    fontSize:16,
    textAlign:'center',
    marginTop:20,
    marginBottom:'80%',
  },

  touchSend:{
    backgroundColor: '#22f',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 50,
  },
  textSend: {
    fontSize:20,
    color: '#fff',
    padding:10,
  }

})