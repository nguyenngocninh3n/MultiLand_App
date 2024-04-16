import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import VectorIcon from '../../utils/VectorIcon';
import {Colors} from '../../utils/Colors';
import Logo from '../../assets/images/logo.png';
import textLogo from '../../assets/images/text-logo.png';
import auth from '@react-native-firebase/auth';

import Profile from '../profile/OwnerProfile';


const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onCreateAccount = () => {
    navigation.navigate('RegisterScreen');
  };

  const onLogin = () => {
    console.log(' into Login button:');
    if(email == '') {
      setError('email không được rỗng');
      return;
    }
    if(password == '') {
      setError('mật khẩu không được rỗng');
      return;
    }
   
    if (email && password) {
      console.log('into exist email & pass :',email," ",password);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          ToastAndroid.showWithGravity('Đăng nhập thành công!',ToastAndroid.LONG,ToastAndroid.BOTTOM)

        })
        .catch(error => {
          if (error.code === 'auth/wrong-password')
              setError('mật khẩu không chính xác')
          else if (error.code === 'auth/invalid-email')
              setError('định dạng email không chính xác: abc@gmail.com')
          else if (error.code === 'auth/invalid-credential')
              setError('thông tin đăng nhập không chính xác')
          else 
            Alert.alert('Thong bao',`${error}`);
          
        });
    }
    console.log('hoan thanh')
    
  };


  return (
    <View style={styles.container}>

      <View style={styles.subContainer}>
        <Image source={Logo} style={styles.logoStyle} />
        <Text style={{height:20,color:'#f00',fontStyle:'italic'}}>{error}</Text>
        <TextInput
          placeholder="Email đăng nhập..."
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Mật khẩu..."
          value={password}
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          style={styles.inputBox}
        />
        <TouchableOpacity onPress={onLogin} style={styles.loginButton}>
          <Text style={styles.login}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=> {navigation.navigate('ResetPasswordScreen')}} >
        <Text style={styles.forgotPass}>Quên mật khẩu?</Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.newAccount} onPress={onCreateAccount}>
          <Text style={styles.newAccountText}>Đăng ký tài khoản</Text>
        </TouchableOpacity>
        <Image source={textLogo} style={styles.textLogoStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoStyle: {
    height: 100,
    width: 100,
    marginVertical: '20%',
  },
  container: {
    padding: 16,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    padding: 10,
    borderRadius: 12,
    width: '95%',
    marginTop: 12,
  },
  loginButton: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 20,
    width: '95%',
    alignItems: 'center',
    marginTop: 12,
  },
  login: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
  },
  forgotPass: {
    color: Colors.grey,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 15,
  },
  newAccount: {
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    padding: 10,
    borderRadius: 18,
    width: '95%',
    alignItems: 'center',
    marginTop: '35%',
  },
  newAccountText: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontWeight: '400',
  },
  textLogoStyle: {
    height: 35,
    width: 250,
    marginTop: 25,
  },
});

export default LoginScreen;
