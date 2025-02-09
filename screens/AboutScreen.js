// screens/AboutScreen.js
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CommitteeMember = ({ role, name }) => (
  <View style={styles.memberRow}>
    <View style={styles.memberIcon}>
      <Icon name="user-circle" size={24} color="#1a73e8" />
    </View>
    <View style={styles.memberInfo}>
      <Text style={styles.memberRole}>{role}</Text>
      <Text style={styles.memberName}>{name}</Text>
    </View>
  </View>
);

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>FSU,Pulchowk Campus</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          The Free Students' Union (FSU) at Pulchowk Campus, part of Tribhuvan University's
          Institute of Engineering in Nepal, serves as a representative body for students,
          organizing various activities and events to enhance campus life.
        </Text>
      </View>

      <View style={styles.committeeSection}>
        <Text style={styles.sectionTitle}>COMMITTEE</Text>
        <View style={styles.committeeContainer}>
          <CommitteeMember role="President" name="Biraj Aryal" />
          <CommitteeMember role="Vice President" name="Gaurav Bhattarai Jared" />
          <CommitteeMember role="Secretary" name="Bigyan Pradhan" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },
  committeeSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  committeeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberIcon: {
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});