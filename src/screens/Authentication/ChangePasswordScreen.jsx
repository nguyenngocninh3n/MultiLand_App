import { useState } from "react"
import { Text, View,  TextInput, TouchableHighlight, StyleSheet } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
// import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import Feather from 'react-native-vector-icons/Feather'

export default ResetPasswordScreen = ({navigation}) => {

  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  const [inp1, setInp1] = useState(true);
  const [inp2, setInp2] = useState(true);
  const [inp3, setInp3] = useState(true);
  const [error, setError] = useState('');
  const onChangePassword = () => {

    if(value1.trim() == '' || value2.trim() == '' || value3.trim() == '') {
      setError('Không có trường nào để trống!')
    } 
    else if(value2 != value3) {
      setError('Mật khẩu mới phải trùng khớp');
    } 
    else if (value2.length <6) {
      setError('mật khẩu mới phải ít nhất 6 ký tự')
    }
    else {
      const credential = auth.EmailAuthProvider.credential(
        auth().currentUser.email,
        value1
      );

     const result = auth().currentUser.reauthenticateWithCredential(credential).then((res)=>{
        auth().currentUser.updatePassword(value2);
        setError('Thay đổi mật khẩu thành công!');
        setValue1('');
        setValue2('');
        setValue3('');

     }).catch(error=>{
        if(error.code == 'auth/wrong-password') {
          setError('mật khẩu cũ hiện tại không chính xác')
        } 

        else setError('loi khi doi mat khau: ',error)

     })
     ;

    }
       
  }

  return (
    <View style={styles.container}>
   
      <Text style={styles.textTitle}>Thay đổi mật khẩu</Text>
      <Text style= {{marginTop:20,height:20,color:'#f00',fontStyle:'italic'}}>{error}</Text>
      
      <View style={styles.input_container}>
          <TextInput value={value1} secureTextEntry={inp1} onChangeText={setValue1} style={styles.textInput} placeholder="Mật khẩu hiện tại..." />
          <Feather onPress={()=>{setInp1(!inp1)}} size={26} name={inp1?'eye-off':'eye'} />
      </View>
      <View style={styles.input_container}>
          <TextInput value={value2} secureTextEntry={inp2} onChangeText={setValue2} style={styles.textInput} placeholder="Mật khẩu mới..." />
          <Feather onPress={()=>{setInp2(!inp2)}} size={26} name={inp2?'eye-off':'eye'} />
      </View>
      <View style={styles.input_container}>
          <TextInput value={value3} secureTextEntry={inp3} onChangeText={setValue3} style={styles.textInput} placeholder="Nhập mật khẩu mới...." />
          <Feather onPress={()=>{setInp3(!inp3)}} size={26} name={inp3?'eye-off':'eye'} />
      </View>

      
      <TouchableHighlight onPress={onChangePassword} style={styles.touchSend}>
        <Text style={styles.textSend}>Đổi mật khẩu</Text>
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
    marginTop:20,
    marginBottom:20,
    fontSize:20,
    fontWeight:'800'
  },
  input_container: {
    flexDirection:'row',
    alignItems:'center',
  },
  textInput: {
    backgroundColor:'#fff',
    marginVertical:10,
    marginRight:10,
    padding:10,
    borderRadius:10,
    borderColor:'#bbb',
    borderWidth:1,
    flex:1,
  },
  touchSend:{
    backgroundColor: '#22f',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 50,
    marginTop:20,
  },
  textSend: {
    fontSize:20,
    
    color: '#fff',
    padding:10,
  }

})