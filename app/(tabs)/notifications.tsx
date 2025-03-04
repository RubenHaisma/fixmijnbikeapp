import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { Bell, Settings, ChevronRight } from 'lucide-react-native';
import Colors from '../../constants/Colors';

// Mock notifications data
const initialNotifications = [
  {
    id: '1',
    title: 'Reparatie geaccepteerd',
    message: 'Jan Bakker heeft je reparatieverzoek voor een lekke band geaccepteerd.',
    date: '2 uur geleden',
    read: false,
    type: 'repair_accepted',
    relatedId: '123',
  },
  {
    id: '2',
    title: 'Nieuwe reactie',
    message: 'Lisa Jansen heeft gereageerd op je reparatieverzoek.',
    date: '5 uur geleden',
    read: true,
    type: 'new_comment',
    relatedId: '456',
  },
  {
    id: '3',
    title: 'Reparatie voltooid',
    message: 'Je reparatie voor remmen afstellen is voltooid. Laat een beoordeling achter!',
    date: '1 dag geleden',
    read: true,
    type: 'repair_completed',
    relatedId: '789',
  },
  {
    id: '4',
    title: 'Betaling ontvangen',
    message: 'Je hebt €25 ontvangen voor de reparatie van een lekke band.',
    date: '2 dagen geleden',
    read: true,
    type: 'payment_received',
    relatedId: '101',
  },
  {
    id: '5',
    title: 'Nieuwe reparatieaanvraag',
    message: 'Er is een nieuwe reparatieaanvraag in jouw buurt voor versnellingen afstellen.',
    date: '3 dagen geleden',
    read: true,
    type: 'new_repair_request',
    relatedId: '102',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const handleNotificationPress = (notification: typeof notifications[0]) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'repair_accepted':
      case 'repair_completed':
      case 'new_comment':
        router.push(`/repair/${notification.relatedId}`);
        break;
      case 'payment_received':
        router.push('/(tabs)/profile');
        break;
      case 'new_repair_request':
        router.push('/(tabs)/search');
        break;
      default:
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bell size={24} color={Colors.primary} />
          <Text style={styles.title}>Meldingen</Text>
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllText}>Alles gelezen</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/notifications/preferences')}
          >
            <Settings size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem,
              !item.read && styles.unreadNotification,
            ]}
            onPress={() => handleNotificationPress(item)}
          >
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color={Colors.gray[300]} />
            <Text style={styles.emptyStateTitle}>Geen meldingen</Text>
            <Text style={styles.emptyStateMessage}>
              Je hebt nog geen meldingen ontvangen.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    marginRight: 16,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  settingsButton: {
    padding: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  unreadNotification: {
    backgroundColor: Colors.primary + '08', // 8% opacity
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});