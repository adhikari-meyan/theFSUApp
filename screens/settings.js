import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsModal = ({ visible, onClose, username = "Ava" }) => {
  const [notifications, setNotifications] = useState({
    classSchedules: true,
    reminders: true
  });

  const ListItem = ({ icon, title, value, hasChevron = true, isSwitch = false, onPress }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.listItemLeft}>
        {icon && <Icon name={icon} size={20} color="#666" style={styles.listItemIcon} />}
        <Text style={styles.listItemTitle}>{title}</Text>
      </View>
      <View style={styles.listItemRight}>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#ddd', true: '#4A90E2' }}
            thumbColor="#fff"
          />
        ) : (
          <>
            <Text style={styles.listItemValue}>{value}</Text>
            {hasChevron && <Icon name="chevron-right" size={16} color="#999" style={styles.chevron} />}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="chevron-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <Image 
              source={require('../assets/logo.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileSubtitle}>IOE, Pulchowk Campus</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Theme</Text>
            <ListItem
              title="Theme"
              value="Modern"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timezone</Text>
            <ListItem
              title="Timezone"
              value="Pacific Time"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy controls</Text>
            <ListItem
              title="See my location"
              value="My friends"
              onPress={() => {}}
            />
            <ListItem
              title="Contact me"
              value="My friends"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <ListItem
              title="New class schedules"
              isSwitch={true}
              value={notifications.classSchedules}
              onPress={() => setNotifications(prev => ({
                ...prev,
                classSchedules: !prev.classSchedules
              }))}
            />
            <ListItem
              title="Class reminders"
              isSwitch={true}
              value={notifications.reminders}
              onPress={() => setNotifications(prev => ({
                ...prev,
                reminders: !prev.reminders
              }))}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    marginRight: 12,
  },
  listItemTitle: {
    fontSize: 16,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  logoutButton: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsModal;