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
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../utils/Colors';
import Logo from '../assets/images/logo.png';
import textLogo from '../assets/images/text-logo.png';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'

import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({navigation}) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onCreateAccount = () => {
    navigation.navigate('LoginScreen');
  };

  const onRegister = () => {
    console.log("===> ",fullname)
    console.log("===> ",email)
    console.log("===> ",password)
    console.log("===> ",confirmPassword)

    if (password !== confirmPassword) {
      Alert.alert('Thong bao',"Password don't match.");
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
                    console.log('User added!');
                });
            })

        .catch(error => {
                  console.error(error);
            });


    } else {
      Alert.alert('Thong bao','Please fill in details!');
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
        <TextInput
          placeholder="Full Name"
          value={fullname}
          onChangeText={value => setFullname(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Mobile number or email"
          value={email}
          onChangeText={value => setEmail(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Password"
          value={confirmPassword}
          onChangeText={value => setConfirmPassword(value)}
          style={styles.inputBox}
        />
        <TextInput
          placeholder="Confirm Password"
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.inputBox}
        />
        <TouchableOpacity onPress={onRegister} style={styles.loginButton}>
          <Text style={styles.login}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newAccount} onPress={onCreateAccount}>
          <Text style={styles.newAccountText}>Already have an account?</Text>
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
