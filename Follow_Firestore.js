
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
class Follow_Firestore {
   
    var 
    constructor() {
        url_remote = "";
        if (!firebase.apps.length) {
            firebase.initializeApp({});
         }else {
            firebase.app(); // if already initialized, use that one
         }
    }
    constructor(user) {

    }

    addFollow = () => {

    }


}

Follow_Firestore.shared = new Fire();
export default Follow_Firestore
