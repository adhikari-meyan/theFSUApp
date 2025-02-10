import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  TextInput, StatusBar, ActivityIndicator, Share,
  Platform, Alert, RefreshControl, Modal, Pressable, Animated, StyleSheet, Switch
} from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageViewer from 'react-native-image-viewing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import SettingsModal from './settings';

const API_BASE_URL = 'http://10.0.2.2:5000';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [imageViewerProps, setImageViewerProps] = useState({
    visible: false,
    index: 0,
    post: null
  });
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    classSchedules: true,
    reminders: true,
  });

  const SettingsItem = ({ label, value, isSwitch, onPress }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={isSwitch}
    >
      <Text style={styles.settingsLabel}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#2196F3' : '#f4f3f4'}
        />
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.settingsValue}>{value}</Text>
          {!isSwitch && <Icon name="chevron-right" size={20} color="#666" />}
        </View>
      )}
    </TouchableOpacity>
  );

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );


  const settingsInteraction = () => {
    setShowSettings(true);
  }

  useEffect(() => {
    loadInitialData();
    requestMediaPermissions();
  }, []);

  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Media library access is required');
      }
    }
  };

  const loadInitialData = async () => {
    try {
      setPage(1);
      const [usernameData, feedData] = await Promise.all([
        fetch(`${API_BASE_URL}/get_username?username=ksafkjs;d`),
        fetch(`${API_BASE_URL}/home_feed?page=1&limit=5`)
      ]);

      const { username } = await usernameData.json();
      const { feed } = await feedData.json();

      setUsername(username);
      setPosts(feed.map(post => ({ ...post, showComments: false })));
      setHasMorePosts(feed.length === 5);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const loadMorePosts = async () => {
    console.log(hasMorePosts, isLoading)
    if (!hasMorePosts || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`${API_BASE_URL}/home_feed?page=${nextPage}&limit=5`);
      const { feed } = await response.json();
      console.log(feed)


      if (feed.length > 0) {
        setPosts(prev => [...prev, ...feed.map(post => ({
          ...post,
          showComments: false,
          isLiked: false
        }))]);
        setPage(nextPage);
        setHasMorePosts(feed.length === 5);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load more posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = async (type, postId, data = null) => {
    switch (type) {
      case 'like':
        setPosts(posts.map(post =>
          post.id === postId ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          } : post
        ));

        try {
          await fetch(`${API_BASE_URL}/toggle_like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
          });
        } catch (error) {
          // Revert on error
          setPosts(posts.map(post =>
            post.id === postId ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes + 1 : post.likes - 1
            } : post
          ));
        }
        break;

      case 'comment':
        if (!data?.trim()) return;

        try {
          const response = await fetch(`${API_BASE_URL}/add_comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              post_id: postId,
              comment: data.trim(),
              username
            })
          });

          const { comment_id } = await response.json();
          setPosts(posts.map(post =>
            post.id === postId ? {
              ...post,
              comments: [...post.comments, {
                id: comment_id,
                user: username,
                text: data.trim()
              }]
            } : post
          ));
        } catch (error) {
          Alert.alert('Error', 'Failed to add comment');
        }
        break;

      case 'toggleComments':
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, showComments: !post.showComments } : post
        ));
        break;
    }
  };

  const handleImage = async (action, imageUrl, post = null, index = 0) => {
    switch (action) {
      case 'view':
        setImageViewerProps({ visible: true, index, post });
        break;

      case 'download':
        if (Platform.OS === 'web') {
          window.open(imageUrl);
          return;
        }

        try {
          const filename = imageUrl.split('/').pop();
          const fileUri = `${FileSystem.documentDirectory}${filename}`;
          const { status } = await FileSystem.downloadAsync(imageUrl, fileUri);

          if (status === 200) {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync('FSU Posts', asset, false);
            Alert.alert('Success', 'Image saved to gallery!');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to download image');
        }
        break;

      case 'share':
        try {
          await Share.share({
            message: imageUrl,
            url: imageUrl // iOS only
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to share image');
        }
        break;
    }
  };

  const ImageHeader = ({ title }) => (
    <View style={styles.imageViewerHeader}>
      <TouchableOpacity onPress={() => setImageViewerProps({ visible: false, index: 0, post: null })}>
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.imageViewerTitle}>{title}</Text>
      <View style={styles.imageViewerActions}>
        <TouchableOpacity
          onPress={() => handleImage('download', imageViewerProps.post?.images[imageViewerProps.index])}
          style={styles.imageViewerButton}
        >
          <Icon name="download" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleImage('share', imageViewerProps.post?.images[imageViewerProps.index])}
          style={styles.imageViewerButton}
        >
          <Icon name="share" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image style={styles.profilePic} source={require('../assets/logo.png')} />
          <Text style={styles.title}>FSU, Pulchowk Campus</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="cog" size={20} color="#000" onPress={() => settingsInteraction()} />
          </TouchableOpacity>
        </View>
      </View>
      <SettingsModal 
  visible={showSettings}
  onClose={() => setShowSettings(false)}
  username={username} // Pass the current username
/>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading && page === 1}
            onRefresh={loadInitialData}
            colors={['#1a73e8']}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

          // Calculate how far we are from the bottom
          const currentPosition = layoutMeasurement.height + contentOffset.y;
          const distanceFromBottom = contentSize.height - currentPosition;

          // Load more when we're within 50 pixels of the bottom
          if (distanceFromBottom < 50) {
            loadMorePosts();
          }
        }}
        scrollEventThrottle={16}
      >
        {posts.map(post => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <Image
                style={styles.profilePic}
                source={{ uri: post.user.avatar }}
                defaultSource={require('../assets/default-avatar.png')}
              />
              <View style={styles.postHeaderText}>
                <Text style={styles.userName}>{post.user.name}</Text>
                <Text style={styles.timeStamp}>{post.user.time}</Text>
              </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.imageGrid}>
              {post.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImage('view', image, post, index)}
                  style={[
                    styles.imageContainer,
                    post.images.length === 1 && styles.singleImage,
                    post.images.length === 2 && styles.halfImage,
                    post.images.length >= 3 && styles.gridImage
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.interactions}>
              <TouchableOpacity
                style={styles.interactionButton}
                onPress={() => handleInteraction('like', post.id)}
              >
                <Icon
                  name={post.isLiked ? "thumbs-up" : "thumbs-o-up"}
                  size={20}
                  color={post.isLiked ? "#1a73e8" : "#65676b"}
                />
                <Text style={[
                  styles.interactionText,
                  post.isLiked && styles.interactionTextActive
                ]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.interactionButton}
                onPress={() => handleInteraction('toggleComments', post.id)}
              >
                <Icon name="comment-o" size={20} color="#65676b" />
                <Text style={styles.interactionText}>
                  {post.comments.length}
                </Text>
              </TouchableOpacity>
            </View>

            {post.showComments && (
              <View style={styles.commentsSection}>
                {post.comments.map(comment => (
                  <View key={comment.id} style={styles.comment}>
                    <Image source={{ uri: comment.pfp }} style={styles.profilePic}></Image>
                    <View>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.addComment}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    onSubmitEditing={() => {
                      handleInteraction('comment', post.id, commentText);
                      setCommentText('');
                    }}
                  />

                  <TouchableOpacity
                    style={styles.submitButton} // Fixed width button
                    onPress={() => {
                      handleInteraction('comment', post.id, commentText);
                      setCommentText(''); // Clear the input after submitting
                    }}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {isLoading && page > 1 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#1a73e8" />
          </View>
        )}

        {!hasMorePosts && posts.length > 0 && (
          <Text style={styles.noMorePosts}>No more posts to load</Text>
        )}
      </ScrollView>

      <ImageViewer
        images={imageViewerProps.post?.images.map(img => ({ uri: img })) || []}
        imageIndex={imageViewerProps.index}
        visible={imageViewerProps.visible}
        onRequestClose={() => setImageViewerProps({ visible: false, index: 0, post: null })}
        HeaderComponent={() => <ImageHeader title={imageViewerProps.post?.user.name} />}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default HomeScreen;