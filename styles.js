import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center'
  },
  noMorePosts: {
    textAlign: 'center',
    padding: 20,
    color: '#666'
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  post: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeStamp: {
    color: '#65676b',
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  // New Image Grid Styles
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  imageContainer: {
    padding: 5,
  },
  singleImage: {
    width: width - 30,
    aspectRatio: 4/3,
  },
  halfImage: {
    width: (width - 30) / 2,
    aspectRatio: 1,
  },
  gridImage: {
    width: (width - 30) / 3,
    aspectRatio: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
  },
  interactions: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  interactionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactionText: {
    marginLeft: 8,
    color: '#65676b',
    fontSize: 14,
  },
  interactionTextActive: {
    color: '#1a73e8',
  },
  commentsSection: {
    // maxHeight:300,
    marginTop: 12,
  },
  comment: {
    flex:1,
    flexDirection:'row',
    padding: 10,
    backgroundColor: '#f0f2f5',
    marginBottom: 8,
    borderRadius: 12,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
  },
  addComment: {
    flexDirection: 'row',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 12,
    borderRadius: 20,
    fontSize: 14,
    marginRight: 10
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007BFF', // Button background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New Image Viewer Styles
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageViewerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageViewerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageViewerButton: {
    marginLeft: 15,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  // Error States
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  // Pull to Refresh
  refreshControl: {
    backgroundColor: 'transparent',
  },
});

export default styles;