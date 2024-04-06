
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
        var timePost = +Date.now().toString();
        var postID = this.uid+timePost;
        const remoteUri = null;
        if(localUri != null) {
        remoteUri = await this.uploadPhoto(localUri);
        }        
       
        return new Promise((res, rej) => {
        console.log("start promise:")
            firebase.firestore()
            .collection("posts")
            .doc(postID)
            .set({
                content:content,
                image: url_remote,
                userID:this.uid,
                ownerID: this.uid,
                timestamp:timePost,
                postID: postID,
                like:0,
                comment:0,
            })
            .then(ref => {  res(ref);  })
            .catch(error => {rej(error)  })
            console.log('end promise')
        });
    };

    uploadPhoto = async uri => {
        const path = `photos/${this.uid}/${Date.now().toString()}.jpg`
        
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
                    }  )
        })
    }
}

Fire.shared = new Fire();
export default Fire
