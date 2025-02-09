import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NepaliDate, nepaliMonthDays } from './NepaliDate';

const WEEKDAYS = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

// Sample events data - replace with your server data
const SAMPLE_EVENTS = {
  '2080-11-27': [
    { title: 'टिम मिटिङ', time: '10:00 AM', description: 'साप्ताहिक बैठक' },
    { title: 'ग्राहक भेट', time: '1:00 PM', description: 'नयाँ प्रोजेक्ट छलफल' }
  ],
  '2080-11-30': [
    { title: 'डेडलाइन', time: '5:00 PM', description: 'अन्तिम डेलिभरी' }
  ],
  '2080-12-01': [
    { title: 'नयाँ महिना', time: 'All Day', description: 'मासिक योजना बैठक' }
  ]
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(NepaliDate.now());
  const [currentMonth, setCurrentMonth] = useState(NepaliDate.now());

  const getMonthDays = (year, month) => {
    const days = [];
    const totalDays = nepaliMonthDays[year]?.[month] || 30;
    
    // Get the first day of the month (0-6, where 0 is Sunday)
    // This is simplified - you'd need proper calculation in production
    const firstDay = 0;

    // Add empty spaces for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new NepaliDate(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  };

  const handleDatePress = (date) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      const events = SAMPLE_EVENTS[formattedDate] || [];
      if (events.length > 0) {
        Alert.alert(
          `${date.formatNp()} का कार्यक्रमहरू`,
          events.map(event => `${event.title} - ${event.time}\n${event.description}`).join('\n\n')
        );
      } else {
        Alert.alert('कुनै कार्यक्रम छैन', `${date.formatNp()} मा कुनै कार्यक्रम तय गरिएको छैन`);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const message = 'पात्रो कार्यक्रमहरू:\n\n' +
        Object.entries(SAMPLE_EVENTS)
          .map(([date, events]) => 
            `${date}\n${events.map(e => `- ${e.title} (${e.time})`).join('\n')}`
          ).join('\n\n');
      
      await Share.share({
        message,
        title: 'पात्रो कार्यक्रमहरू'
      });
    } catch (error) {
      Alert.alert('त्रुटि', 'पात्रो कार्यक्रमहरू डाउनलोड गर्न सकिएन');
    }
  };

  const nextMonth = () => {
    const newMonth = currentMonth.month + 1;
    const newYear = newMonth > 11 ? currentMonth.year + 1 : currentMonth.year;
    setCurrentMonth(new NepaliDate(newYear, newMonth % 12, 1));
  };

  const prevMonth = () => {
    const newMonth = currentMonth.month - 1;
    const newYear = newMonth < 0 ? currentMonth.year - 1 : currentMonth.year;
    setCurrentMonth(new NepaliDate(newYear, (newMonth + 12) % 12, 1));
  };

  const days = getMonthDays(currentMonth.year, currentMonth.month);

  return (
    <View style={styles.container}>
      {/* Header with month title and download button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {`${NepaliDate.getMonthNameNp(currentMonth.month)} ${currentMonth.year}`}
        </Text>
        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
          <MaterialIcons name="file-download" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Month navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={prevMonth}>
          <MaterialIcons name="chevron-left" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextMonth}>
          <MaterialIcons name="chevron-right" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Weekdays header */}
      <View style={styles.weekDays}>
        {WEEKDAYS.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.weekDay,
              index === 6 && styles.saturday
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.daysGrid}>
        {days.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              date && formatDate(date) === formatDate(selectedDate) && styles.selectedDay
            ]}
            onPress={() => handleDatePress(date)}
          >
            {date && (
              <View>
                <Text
                  style={[
                    styles.dayText,
                    date.day === 1 && styles.firstDay,
                    (index + 1) % 7 === 0 && styles.saturdayText,
                    SAMPLE_EVENTS[formatDate(date)] && styles.hasEvents
                  ]}
                >
                  {date.day}
                </Text>
                {SAMPLE_EVENTS[formatDate(date)] && (
                  <View style={styles.eventDot} />
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Events list */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>यस हप्ताका कार्यक्रमहरू</Text>
        <ScrollView style={styles.eventsList}>
          {Object.entries(SAMPLE_EVENTS).map(([date, events]) => (
            <View key={date} style={styles.eventItem}>
              <Text style={styles.eventDate}>{date}</Text>
              {events.map((event, index) => (
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
  dayText: {
    fontSize: 16,
  },
  firstDay: {
    fontWeight: 'bold',
    color: '#007AFF',
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
});

export default Calendar;