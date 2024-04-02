
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
class Fire {
   
    constructor() {
        url_remote = "";
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

    addPost  = async ({content, localUri}) => {
        console.log("start addPost")
        
        const remoteUri = await this.uploadPhoto(localUri);

        console.log("after uploadphoto, remote Uri: ",url_remote)
       
        console.log(
            "content: ", content,
                "image: ", url_remote,
                "userID: ", this.uid,
                "ownerID: ",this.uid,
                "timestamp: ",this.timestamp,
           
        )
        return new Promise((res, rej) => {
        console.log("start promise:")
            firebase.firestore()
            .collection("posts")
            .add({
                content:content,
                image: url_remote,
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
        
        return new Promise(async(res, rej) => {
       
            const response = await fetch(uri);
            const file = await response.blob();

        
            let upload = storage().ref(path).put(file);
            
            upload.on("state_changed", 
                    snapshot => {},
                    err=> {rej(err)},
                    async () => {
                        const url = await upload.snapshot.ref.getDownloadURL();
                        url_remote = url;
                        console.log("path url: ",url)
                        res(url)
                    }
                    )
           
       
             
        })
    }
}

Fire.shared = new Fire();
export default Fire
