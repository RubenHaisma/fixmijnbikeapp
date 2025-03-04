import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, Wrench, ArrowRight, Bike } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

// Mock data for recent repairs
const recentRepairs = [
  {
    id: '1',
    title: 'Lekke band',
    status: 'completed',
    date: '15 mei 2025',
    fixerName: 'Jan Bakker',
    price: '€25',
  },
  {
    id: '2',
    title: 'Remmen afstellen',
    status: 'in_progress',
    date: '20 mei 2025',
    fixerName: 'Lisa Jansen',
    price: '€20',
  },
];

// Mock data for nearby fixers
const nearbyFixers = [
  {
    id: '1',
    name: 'Jan Bakker',
    rating: 4.8,
    distance: '1.2 km',
    specialties: ['Banden', 'Remmen', 'Versnellingen'],
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Lisa Jansen',
    rating: 4.9,
    distance: '2.5 km',
    specialties: ['Elektrische fietsen', 'Banden', 'Kettingen'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '3',
    name: 'Pieter de Vries',
    rating: 4.7,
    distance: '3.1 km',
    specialties: ['Remmen', 'Verlichting', 'Algemene reparaties'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState('Amsterdam');
  
  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.info;
      case 'pending':
        return Colors.warning;
      default:
        return Colors.gray[500];
    }
  };

  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Afgerond';
      case 'in_progress':
        return 'In uitvoering';
      case 'pending':
        return 'In afwachting';
      default:
        return 'Onbekend';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hallo, {user?.name || 'Gast'}!</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Image
            source={{ 
              uri: user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' 
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heroContainer}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Fiets kapot?</Text>
          <Text style={styles.heroSubtitle}>Vind een fixer in jouw buurt</Text>
          <Button 
            title="Reparatie aanvragen" 
            onPress={() => router.push('/(tabs)/create-repair')}
            style={styles.heroButton}
          />
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {user?.role === 'rider' && recentRepairs.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recente reparaties</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.seeAllText}>Alles bekijken</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {recentRepairs.map((repair) => (
            <TouchableOpacity 
              key={repair.id}
              style={styles.repairCard}
              onPress={() => router.push(`/repair/${repair.id}`)}
            >
              <View style={styles.repairCardContent}>
                <View style={styles.repairCardHeader}>
                  <Text style={styles.repairCardTitle}>{repair.title}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(repair.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { color: getStatusColor(repair.status) }
                    ]}>
                      {getStatusText(repair.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.repairCardDate}>{repair.date}</Text>
                <Text style={styles.repairCardFixer}>Fixer: {repair.fixerName}</Text>
                <Text style={styles.repairCardPrice}>{repair.price}</Text>
              </View>
              <View style={styles.repairCardIcon}>
                <Bike size={24} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fixers in de buurt</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.seeAllText}>Alles bekijken</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={nearbyFixers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.fixersList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.fixerCard}
              onPress={() => router.push(`/fixer/${item.id}`)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.fixerImage}
              />
              <Text style={styles.fixerName}>{item.name}</Text>
              <View style={styles.fixerRatingContainer}>
                <Text style={styles.fixerRating}>★ {item.rating}</Text>
                <Text style={styles.fixerDistance}>{item.distance}</Text>
              </View>
              <View style={styles.specialtiesContainer}>
                {item.specialties.slice(0, 2).map((specialty, index) => (
                  <View key={index} style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
                {item.specialties.length > 2 && (
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText}>+{item.specialties.length - 2}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.becomeFixer}>
          <View style={styles.becomeFixerContent}>
            <Wrench size={24} color={Colors.white} />
            <Text style={styles.becomeFixerTitle}>Word een Fixer</Text>
            <Text style={styles.becomeFixerText}>
              Verdien geld door fietsen te repareren in jouw buurt
            </Text>
            <Button 
              title="Meer informatie" 
              variant="secondary"
              onPress={() => router.push('/onboarding/role')}
              style={styles.becomeFixerButton}
            />
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heroContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 20,
    marginTop: 10,
  },
  heroContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  heroButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  heroImage: {
    width: '40%',
    height: 150,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginRight: 4,
  },
  repairCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  repairCardContent: {
    flex: 1,
  },
  repairCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  repairCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  repairCardDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  repairCardFixer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  repairCardPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  repairCardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  fixersList: {
    paddingRight: 20,
  },
  fixerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: 180,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fixerImage: {
    width: '100%',
    height: 120,
  },
  fixerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginTop: 12,
    marginHorizontal: 12,
  },
  fixerRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 4,
  },
  fixerRating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.secondary,
  },
  fixerDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  specialtyBadge: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  becomeFixer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  becomeFixerContent: {
    padding: 20,
  },
  becomeFixerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginTop: 8,
    marginBottom: 4,
  },
  becomeFixerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    marginBottom: 16,
    opacity: 0.9,
  },
  becomeFixerButton: {
    alignSelf: 'flex-start',
  },
});