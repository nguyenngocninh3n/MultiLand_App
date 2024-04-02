
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
class Fire {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp({});
         }else {
            firebase.app(); // if already initialized, use that one
         }
    }
    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return firebase.auth().currentUser.uid || {}.uid
    }

    get timestamp() {
        return Date.now();
    }

    addPost  = async ({text, localUri}) => {
        console.log("start addPost")
        const remoteUri = await this.uploadPhoto(localUri);
        console.log("after uploadphoto")
       
        
        return new Promise((res, rej) => {
        console.log("start promise:")
            firebase.firestore()
            .collection("posts")
            .add({
                content:text,
                image: remoteUri,
                userID:this.uid,
                ownerID: this.uid,
                timestamp:this.timestamp,
                like:0,
                share:0,
                
            })
            .then(ref => {
                res(ref);
                console.log("fire: ref")

            })
            .catch(error => {rej(error)
             console.log("fire: error")

            })
        });
    };

    uploadPhoto = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`
        console.log("gia tri uri: ",uri )
        return new Promise(async(res, rej) => {
       
            // const response = await fetch(uri);
            // const file = await response.blob();

           try {
            let upload = storage().ref(path);
            upload.putFile(uri)   
            const url = await upload.getDownloadURL(); 
           }  catch(err) {
            console.log("loi upload file: ",err)
           }
       
             
        })
    }
}

Fire.shared = new Fire();
export default Fire
