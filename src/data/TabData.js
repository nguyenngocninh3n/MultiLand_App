import FriendScreen from '../screens/FriendScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScrren';
import NewPost from '../screens/post/NewPost';

import OwnerProfile from '../screens/profile/OwnerProfile';
import UserProfile from '../screens/profile/UserProfile';
export const TabData = [
  {
    id: 1,
    route: HomeScreen,
    name: 'home',  
    iconName: 'home',
    iconType:'AntDesign',
    size: 30,
    unFocusSize: 25,
    backgroundColor: 'blue',
  },
  {
    id: 2,
    route: FriendScreen,
    name: 'Friends',
    iconType: 'AntDesign',
    iconName: 'team',
    size: 35,
    unFocusSize: 25,
    backgroundColor: 'blue',
  },
 {
   id: 3,
   route: NewPost,
   name: 'newpost',
   iconName: 'pluscircleo',
   iconType: 'AntDesign',

   size: 35,
   unFocusSize: 25,
 },
//  {
//    id: 4,
//    route: MarketPlaceScreen,
//    name: 'MarketPlace',
//    activeIconName: 'shop',
//    activeiconType: 'Entypo',
//    inactiveIconName: 'storefront-outline',
//    inactiveIconType: 'MaterialCommunityIcons',
//    size: 25,
//    unFocusSize: 25,
//  },
  {
    id: 5,
    route: NotificationScreen,
    name: 'Notification',
    iconName: 'notification',
    iconType: 'AntDesign',
    size: 30,
    unFocusSize: 25,
    backgroundColor: 'blue',
  },
  {
    id: 6,
    route: OwnerProfile,
    name: 'OwnerProfile',
    iconName: 'user',
    iconType: 'AntDesign',
    size: 35,
    unFocusSize: 25,
    backgroundColor: 'blue',
  },
];
