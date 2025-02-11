import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Share,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE_URL = 'http://192.168.180.55:5000';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL+'/getcalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDatePress = (date) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      const dateEvents = events[formattedDate] || [];
      if (dateEvents.length > 0) {
        Alert.alert(
          `Events on ${formattedDate}`,
          dateEvents.map(event => `${event.title} - ${event.time}\n${event.description}`).join('\n\n')
        );
      } else {
        Alert.alert('No Events', `No events scheduled for ${formattedDate}`);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const message = 'Calendar Events:\n\n' +
        Object.entries(events)
          .map(([date, dateEvents]) => 
            `${date}\n${dateEvents.map(e => `- ${e.title} (${e.time})`).join('\n')}` 
          ).join('\n\n');
      
      await Share.share({
        message,
        title: 'Calendar Events'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to download calendar events');
    }
  };

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents().finally(() => setRefreshing(false));
  };

  const currentFormattedDate = formatDate(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
          <MaterialIcons name="file-download" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity onPress={prevMonth}>
          <MaterialIcons name="chevron-left" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextMonth}>
          <MaterialIcons name="chevron-right" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          <View style={styles.weekDays}>
            {WEEKDAYS.map((day, index) => (
              <Text
                key={day}
                style={[styles.weekDay, index === 6 && styles.saturday]}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  date && formatDate(date) === formatDate(selectedDate) && styles.selectedDay,
                  date && formatDate(date) === currentFormattedDate && styles.currentDay
                ]}
                onPress={() => handleDatePress(date)}
              >
                {date && (
                  <View>
                    <Text
                      style={[
                        styles.dayText,
                        date.getDay() === 6 && styles.saturdayText,
                        events[formatDate(date)] && styles.hasEvents
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    {events[formatDate(date)] && (
                      <View style={styles.eventDot} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.eventsContainer}>
            <Text style={styles.eventsTitle}>This Week's Events</Text>
            <ScrollView
              style={styles.eventsList}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {Object.entries(events)
                .filter(([date]) => date.startsWith(currentMonth.getFullYear() + '-' + String(currentMonth.getMonth() + 1).padStart(2, '0')))
                .map(([date, dateEvents]) => (
                  <View key={date} style={styles.eventItem}>
                    <Text style={styles.eventDate}>{date}</Text>
                    {dateEvents.map((event, index) => (
                      <View key={index} style={styles.eventDetails}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventTime}>{event.time}</Text>
                        <Text style={styles.eventDescription}>{event.description}</Text>
                      </View>
                    ))}
                  </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  downloadButton: {
    padding: 8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saturday: {
    color: 'red',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  selectedDay: {
    backgroundColor: '#e6f3ff',
  },
  currentDay: {
    backgroundColor: '#ffcc00',
  },
  dayText: {
    fontSize: 16,
  },
  saturdayText: {
    color: 'red',
  },
  hasEvents: {
    fontWeight: 'bold',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginTop: 2,
  },
  eventsContainer: {
    flex: 1,
    marginTop: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetails: {
    marginLeft: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Calendar;
