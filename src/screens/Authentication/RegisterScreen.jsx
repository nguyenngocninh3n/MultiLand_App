import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../utils/Colors';
import Logo from '../../assets/images/logo.png'

import textLogo from '../../assets/images/logo.png'
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'

import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({navigation}) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,setError] = useState('');
  const onCreateAccount = () => {
    navigation.navigate('LoginScreen');
  };

  const onRegister = () => {
    console.log("===> ",fullname)
    console.log("===> ",email)
    console.log("===> ",password)
    console.log("===> ",confirmPassword)

    if(fullname.trim()=='') {
      setError('Họ và tên không được để trống');
      return;
    }
    if(email.trim()=='') {
      setError('Email không được để trống');
      return;
    } if(password=='') {
      setError('Password không được để trống');
      return;
    } if(confirmPassword=='') {
      setError('Xác nhận mật khẩu không được để trống không được để trống');
      return;
    }
    if (password !== confirmPassword) {
      setError('mật khẩu và phần xác nhận không khớp')
      return;
    }
    if (email && password) { 
      auth().createUserWithEmailAndPassword(email,password)
        .then(() => {
            firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .set({
                    name: fullname,
                    email: email,
                    password: password,
                    avatar: "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
                    phoneNumber: "",
                    sex: true,
                    birthday: Date.now(),
                    uid: auth().currentUser.uid,
                    following: 0,
                    follower: 0,
                    })
                .then(() => {
                    
                });
            })

        .catch(error => {
                  console.error(error);
            });


    } 
  };

  return (
    <View style={styles.container}>
      <AntDesign
        name="back"
        type="Ionicons"
        color={Colors.black}
        size={20}
        onPress={() => navigation.navigate('LoginScreen')}
      />
      <View style={styles.subContainer}>
        <Image source={Logo} style={styles.logoStyle} />
        <Text style={{color:'#f00',fontStyle:'italic'}}>{error}</Text>
        <TextInput
          placeholder="Họ và tên..."
          value={fullname}
          onChangeText={value => setFullname(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Email..."
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Mật khẩu..."
          value={confirmPassword}
          onChangeText={value => setConfirmPassword(value)}
          secureTextEntry={true}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu..."
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
          style={styles.inputBox}
        />
        <TouchableOpacity onPress={()=>{
         
          onRegister();
        }} style={styles.loginButton}>
          <Text style={styles.login}>Tạo tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newAccount} onPress={onCreateAccount}>
          <Text style={styles.newAccountText}>Đã có tài khoản?</Text>
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
    marginTop: '25%',
  },
  newAccountText: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontWeight: '400',
  },
  textLogoStyle: {
    height: 35,
    width: 250,
    marginTop: 35,
  },
});

export default RegisterScreen;
