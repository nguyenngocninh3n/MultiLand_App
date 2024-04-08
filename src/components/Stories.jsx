import {ScrollView, StyleSheet} from 'react-native';
import {Colors} from '../utils/Colors';
import CreateStory from './CreateStory';
import FriendStories from './FriendStories';



const Stories = ({user}) => {

 

  return (
    <ScrollView
      horizontal
      style={styles.storiesContainer}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}>
      <CreateStory imgUri={user.avatar} />
      <FriendStories />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    backgroundColor: Colors.white,
    marginTop: 8,
    padding: 15,
  },
  contentContainerStyle: {
    paddingRight: 30,
  },
});

export default Stories;
