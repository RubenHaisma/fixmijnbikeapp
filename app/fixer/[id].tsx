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
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Share2,
  ChevronRight
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';

// Mock fixer data
const fixerData = {
  '1': {
    id: '1',
    name: 'Jan Bakker',
    rating: 4.8,
    reviews: 56,
    distance: '1.2 km',
    location: 'Amsterdam-Zuid',
    specialties: ['Banden', 'Remmen', 'Versnellingen'],
    hourlyRate: '€25',
    responseTime: '< 30 min',
    bio: 'Ik ben een ervaren fietsenmaker met meer dan 10 jaar ervaring. Ik heb mijn eigen werkplaats aan huis en kan de meeste reparaties binnen een dag uitvoeren. Ik ben gespecialiseerd in het repareren van lekke banden, het afstellen van remmen en versnellingen.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    completedRepairs: 124,
    availability: [
      { day: 'Maandag', hours: '9:00 - 18:00' },
      { day: 'Dinsdag', hours: '9:00 - 18:00' },
      { day: 'Woensdag', hours: '9:00 - 18:00' },
      { day: 'Donderdag', hours: '9:00 - 18:00' },
      { day: 'Vrijdag', hours: '9:00 - 18:00' },
      { day: 'Zaterdag', hours: '10:00 - 16:00' },
      { day: 'Zondag', hours: 'Gesloten' },
    ],
  },
  '2': {
    id: '2',
    name: 'Lisa Jansen',
    rating: 4.9,
    reviews: 124,
    distance: '2.5 km',
    location: 'Amsterdam-Oost',
    specialties: ['Elektrische fietsen', 'Banden', 'Kettingen'],
    hourlyRate: '€30',
    responseTime: '< 15 min',
    bio: 'Als professionele fietsenmaker met een specialisatie in elektrische fietsen, help ik je graag met alle soorten reparaties. Ik heb een mobiele werkplaats en kan bij je thuis langskomen voor reparaties. Ik ben beschikbaar in heel Amsterdam.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    completedRepairs: 287,
    availability: [
      { day: 'Maandag', hours: '8:00 - 20:00' },
      { day: 'Dinsdag', hours: '8:00 - 20:00' },
      { day: 'Woensdag', hours: '8:00 - 20:00' },
      { day: 'Donderdag', hours: '8:00 - 20:00' },
      { day: 'Vrijdag', hours: '8:00 - 20:00' },
      { day: 'Zaterdag', hours: '9:00 - 17:00' },
      { day: 'Zondag', hours: '10:00 - 14:00' },
    ],
  },
};

// Mock reviews data
const reviews = [
  {
    id: '1',
    userName: 'Emma Visser',
    rating: 5,
    date: '2 weken geleden',
    comment: 'Jan heeft mijn lekke band snel en vakkundig gerepareerd. Zeer tevreden!',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    userName: 'Thomas Smit',
    rating: 4,
    date: '1 maand geleden',
    comment: 'Goede service, kwam op tijd en heeft mijn versnellingen perfect afgesteld.',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '3',
    userName: 'Sophie de Jong',
    rating: 5,
    date: '2 maanden geleden',
    comment: 'Zeer professioneel en vriendelijk. Heeft mijn fiets helemaal nagekeken en alles gerepareerd wat nodig was.',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
];

export default function FixerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [fixer, setFixer] = useState<typeof fixerData[keyof typeof fixerData] | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showAllAvailability, setShowAllAvailability] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the fixer data from your API
    if (id && typeof id === 'string' && fixerData[id]) {
      setFixer(fixerData[id]);
    }
  }, [id]);

  if (!fixer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laden...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {/* Share functionality */}}
        >
          <Share2 size={24} color={Colors.white} />
        </TouchableOpacity>
        <Image source={{ uri: fixer.image }} style={styles.coverImage} />
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: fixer.image }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.basicInfo}>
          <Text style={styles.name}>{fixer.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
            <Text style={styles.rating}>{fixer.rating}</Text>
            <Text style={styles.reviews}>({fixer.reviews} beoordelingen)</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.gray[500]} />
            <Text style={styles.location}>{fixer.location} • {fixer.distance}</Text>
          </View>
          <View style={styles.responseTimeContainer}>
            <Clock size={16} color={Colors.gray[500]} />
            <Text style={styles.responseTime}>Reactietijd: {fixer.responseTime}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Over</Text>
          <Text 
            style={styles.bio}
            numberOfLines={showFullBio ? undefined : 3}
          >
            {fixer.bio}
          </Text>
          {fixer.bio.length > 150 && (
            <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
              <Text style={styles.readMoreText}>
                {showFullBio ? 'Minder weergeven' : 'Meer weergeven'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialiteiten</Text>
          <View style={styles.specialtiesContainer}>
            {fixer.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschikbaarheid</Text>
          <View style={styles.availabilityContainer}>
            {fixer.availability.slice(0, showAllAvailability ? fixer.availability.length : 3).map((item, index) => (
              <View key={index} style={styles.availabilityItem}>
                <Text style={styles.availabilityDay}>{item.day}</Text>
                <Text style={styles.availabilityHours}>{item.hours}</Text>
              </View>
            ))}
          </View>
          {fixer.availability.length > 3 && (
            <TouchableOpacity onPress={() => setShowAllAvailability(!showAllAvailability)}>
              <Text style={styles.readMoreText}>
                {showAllAvailability ? 'Minder weergeven' : 'Alle dagen weergeven'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Beoordelingen</Text>
            <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
              <Text style={styles.viewAllText}>
                {showAllReviews ? 'Minder weergeven' : 'Alle bekijken'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.userImage }} style={styles.reviewerImage} />
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                  <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{fixer.completedRepairs}</Text>
            <Text style={styles.statLabel}>Reparaties</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{fixer.hourlyRate}/u</Text>
            <Text style={styles.statLabel}>Uurtarief</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{fixer.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => {/* Message functionality */}}
          >
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.messageButtonText}>Bericht</Text>
          </TouchableOpacity>
          
          <Button
            title="Reparatie aanvragen"
            onPress={() => router.push(`/repair/new?fixerId=${fixer.id}`)}
            style={styles.repairButton}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    borderWidth: 4,
    borderColor: Colors.white,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  basicInfo: {
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  responseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginTop: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyBadge: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  availabilityContainer: {
    marginBottom: 8,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  availabilityDay: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.primary,
  },
  availabilityHours: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginLeft: 8,
  },
  repairButton: {
    flex: 1,
  },
});