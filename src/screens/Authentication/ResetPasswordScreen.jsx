import { useState } from "react"
import { Text, View,  TextInput, TouchableHighlight, StyleSheet } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
// import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
export default ResetPasswordScreen = ({navigation}) => {

  const [value, setValue] = useState('');
  const [error, setError] = useState('')

  const onResetPassword = (email) => {
    console.log('gia tri email: ',value)
          auth().sendPasswordResetEmail(email)
          .then(() => {
            console.log('lấy lại mật khẩu thành công')
            navigation.navigate('TempScreen')
          })
          .catch((error) => {
              if(error.code === 'auth/invalid-email') {
                setError('định dạng email không hợp lệ: abc@gmail.com')
              } else console.log('lỗi khi reset mật khẩu: ',error)
          });

   
  }

  return (
    <View style={styles.container}>
      <View style={styles.backBtn}>
      <AntDesign  name="back" type="Ionicons" color= '#000'
        size={20} onPress={() => navigation.navigate('LoginScreen')}
      />
      </View>
      <Text style={styles.textTitle}>Reset mật khẩu</Text>
      <Text style= {{marginTop:20,height:20,color:'#f00',fontStyle:'italic'}}>{error}</Text>
      <TextInput value={value} onChangeText={setValue} style={styles.textInput} placeholder="Nhập email đăng ký...." />
      <TouchableHighlight onPress={()=>{onResetPassword(value)}} style={styles.touchSend}>
        <Text style={styles.textSend}>Lấy lại mật khẩu</Text>
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
  backBtn: {
    height:50,
    justifyContent:'center',
   
    marginBottom:20,
    borderBottomColor: '#bbb',
    borderBottomWidth:1,
  },
  textTitle: {
    
    fontSize:20,
    fontWeight:'800'
  },
  textInput: {
    backgroundColor:'#fff',
    marginVertical:20,
    padding:10,
    borderRadius:10,
    borderColor:'#bbb',
    borderWidth:1,

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