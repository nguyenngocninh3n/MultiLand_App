
import firestore from '@react-native-firebase/firestore'

import { useEffect, useState } from "react"
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'


export default FollowerScreen = ({navigation, user}) => {

    const [followers, setFollowers] = useState([])
    useEffect(()=> {
        firestore().collection('followers').doc(user.uid).get().then(documentSnapshot => {
            if(documentSnapshot.exists) {
                console.log('follower có tồn tại: ',documentSnapshot.data())
                setFollowers(documentSnapshot.data().data)
            }
            else {
                console.log('follower khong ton tai')
            }
        })
    },[] )

    return (
        <View>
            <View style={{padding:10}}>
                <Text style={{textAlign:'center', fontSize:24, color:'#000'}}>Follower</Text>
            </View>
            <SafeAreaView>
            <FlatList 
                       style= {styles.container}
                       data={followers}
                       horizontal={false}
                       renderItem={({item})=> (
                         <View style={styles.container_item}>
                             <View style={styles.row}>
                             <Image style={styles.avatar} source={{uri:item.avatar}} />
                             <Text style={styles.textName}>{item.name}</Text>
                             </View>
                             <TouchableOpacity style={styles.touchFollowing}>
                                 <Text style={styles.textFollowing}>Follower</Text>
                             </TouchableOpacity>
                         </View>
                       )}
             />
            </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create ({
    container : {
        height: '90%',
        width:'100%',
    },
    row: {
        flexDirection: 'row',
        alignItems:'center'
    },
    container_item: {
        maxHeight:100, 
        width:'100%',
        flexDirection:'row', 
        justifyContent:'space-between',
        marginBottom:10,
        marginLeft:10,
        padding: 5,
        alignItems:'center',
    },
    avatar: {
        width: 40,
        height:40,
        borderRadius:50,
    },
    textName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    touchFollowing: {
        backgroundColor: '#000',
        marginRight: 20,
        padding: 10,
        borderRadius:10,
    },
    textFollowing: {
        color:'#fff',
        fontWeight:'600'
    }
})