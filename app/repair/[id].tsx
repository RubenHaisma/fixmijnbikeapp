import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MessageCircle, MapPin, Calendar, Clock, User, ChevronRight, CircleCheck, Circle } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { repairAPI } from '../../services/api';

export default function RepairDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [repair, setRepair] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchRepairDetails();
  }, [id]);

  const fetchRepairDetails = async () => {
    if (!id || typeof id !== 'string') {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await repairAPI.getRepair(id);
      setRepair(data);
    } catch (error) {
      console.error('Error fetching repair details:', error);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het ophalen van de reparatiegegevens.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    setSelectedOffer(offerId);
    setIsAccepting(true);
    
    try {
      await repairAPI.acceptRepair(id as string);
      
      // Update repair status locally
      const selectedOfferData = repair.offers.find((offer: any) => offer.id === offerId);
      const updatedRepair = {
        ...repair,
        status: 'ACCEPTED',
        fixer: {
          id: selectedOfferData.fixerId,
          name: selectedOfferData.fixerName,
          image: selectedOfferData.fixerImage,
          rating: selectedOfferData.fixerRating
        },
        price: selectedOfferData.price
      };
      
      setRepair(updatedRepair);
      Alert.alert(
        'Aanbieding geaccepteerd',
        `Je hebt de aanbieding van ${selectedOfferData.fixerName} geaccepteerd. Je wordt binnenkort gecontacteerd.`
      );
    } catch (error) {
      console.error('Error accepting offer:', error);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het accepteren van de aanbieding.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleCompleteRepair = async () => {
    setIsCompleting(true);
    
    try {
      await repairAPI.completeRepair(id as string);
      
      // Update repair status locally
      const updatedRepair = {
        ...repair,
        status: 'COMPLETED',
        completedAt: new Date().toISOString()
      };
      
      setRepair(updatedRepair);
      Alert.alert(
        'Reparatie voltooid',
        'De reparatie is gemarkeerd als voltooid. Bedankt voor het gebruik van FixMijnBike!',
        [
          {
            text: 'Beoordeling geven',
            onPress: () => router.push(`/review/${repair.id}`),
          },
          {
            text: 'Later',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error completing repair:', error);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het voltooien van de reparatie.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancelRepair = () => {
    Alert.alert(
      'Reparatie annuleren',
      'Weet je zeker dat je deze reparatie wilt annuleren?',
      [
        {
          text: 'Nee',
          style: 'cancel',
        },
        {
          text: 'Ja, annuleren',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              await repairAPI.cancelRepair(id as string);
              router.back();
            } catch (error) {
              console.error('Error cancelling repair:', error);
              Alert.alert('Fout', 'Er is een fout opgetreden bij het annuleren van de reparatie.');
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'In afwachting';
      case 'MATCHED':
        return 'Gematcht';
      case 'ACCEPTED':
        return 'Geaccepteerd';
      case 'BOOKED':
        return 'Geboekt';
      case 'COMPLETED':
        return 'Voltooid';
      case 'CANCELLED':
        return 'Geannuleerd';
      case 'DECLINED':
        return 'Geweigerd';
      default:
        return 'Onbekend';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'MATCHED':
        return Colors.warning;
      case 'ACCEPTED':
      case 'BOOKED':
        return Colors.info;
      case 'COMPLETED':
        return Colors.success;
      case 'CANCELLED':
      case 'DECLINED':
        return Colors.error;
      default:
        return Colors.gray[500];
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Reparatie laden...</Text>
      </View>
    );
  }

  if (!repair) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Reparatie niet gevonden</Text>
        <Button
          title="Terug naar overzicht"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  const isRider = user?.id === repair.rider?.id;
  const isFixer = repair.fixer && user?.id === repair.fixer.id;
  const isPending = repair.status === 'PENDING' || repair.status === 'MATCHED';
  const isAccepted = repair.status === 'ACCEPTED' || repair.status === 'BOOKED';
  const isCompleted = repair.status === 'COMPLETED';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reparatie details</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(repair.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(repair.status) }]}>
            {getStatusText(repair.status)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>{repair.issueType}</Text>
        <Text style={styles.description}>{repair.description}</Text>
        
        <View style={styles.detailsRow}>
          <MapPin size={16} color={Colors.gray[500]} />
          <Text style={styles.detailText}>{repair.postalCode}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Calendar size={16} color={Colors.gray[500]} />
          <Text style={styles.detailText}>
            {formatDate(repair.createdAt)}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Clock size={16} color={Colors.gray[500]} />
          <Text style={styles.detailText}>
            {formatTime(repair.createdAt)}
          </Text>
        </View>
      </View>

      {repair.imageUrl && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto</Text>
          <Image 
            source={{ uri: repair.imageUrl }} 
            style={styles.repairImage} 
            resizeMode="cover"
          />
        </View>
      )}

      {/* Rider info section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aanvrager</Text>
        <View style={styles.userCard}>
          <View style={styles.userImagePlaceholder}>
            <User size={24} color={Colors.gray[400]} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{repair.rider?.name || 'Onbekend'}</Text>
            <Text style={styles.userDetail}>{repair.rider?.postalCode || ''}</Text>
          </View>
          {isRider && (
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>Jij</Text>
            </View>
          )}
        </View>
      </View>

      {/* Fixer info section (if assigned) */}
      {repair.fixer && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fixer</Text>
          <TouchableOpacity 
            style={styles.userCard}
            onPress={() => router.push(`/fixer/${repair.fixer.id}`)}
          >
            {repair.fixer.profileImageUrl ? (
              <Image 
                source={{ uri: repair.fixer.profileImageUrl }} 
                style={styles.userImage} 
              />
            ) : (
              <View style={styles.userImagePlaceholder}>
                <User size={24} color={Colors.gray[400]} />
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{repair.fixer.name}</Text>
              {repair.fixer.fixerProfile?.averageRating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>★ {repair.fixer.fixerProfile.averageRating.toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>
                    ({repair.fixer.fixerProfile.totalReviews || 0} beoordelingen)
                  </Text>
                </View>
              )}
            </View>
            {isFixer && (
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>Jij</Text>
              </View>
            )}
            {!isFixer && <ChevronRight size={20} color={Colors.gray[400]} />}
          </TouchableOpacity>
          
          {repair.repairCost && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Geschatte kosten:</Text>
              <Text style={styles.priceValue}>€{repair.repairCost.toFixed(2)}</Text>
            </View>
          )}
        </View>
      )}

      {/* Review section (if completed) */}
      {isCompleted && repair.review && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beoordeling</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewRating}>
                {Array(5).fill(0).map((_, i) => (
                  <Text key={i} style={{ color: i < repair.review.rating ? Colors.secondary : Colors.gray[300] }}>
                    ★
                  </Text>
                ))}
              </Text>
              <Text style={styles.reviewDate}>
                {repair.completedAt ? formatDate(repair.completedAt) : ''}
              </Text>
            </View>
            <Text style={styles.reviewComment}>{repair.review.comment}</Text>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        {/* Rider actions */}
        {isRider && isPending && (
          <Button
            title="Annuleren"
            variant="outline"
            onPress={handleCancelRepair}
            isLoading={isCancelling}
            style={styles.cancelButton}
          />
        )}
        
        {isRider && isAccepted && (
          <Button
            title="Markeer als voltooid"
            onPress={handleCompleteRepair}
            isLoading={isCompleting}
            style={styles.completeButton}
          />
        )}
        
        {isRider && isCompleted && !repair.review && (
          <Button
            title="Beoordeling geven"
            onPress={() => router.push(`/review/${repair.id}`)}
            style={styles.reviewButton}
          />
        )}
        
        {/* Fixer actions */}
        {isFixer && isPending && (
          <Button
            title="Accepteren"
            onPress={() => handleAcceptOffer(repair.id)}
            isLoading={isAccepting}
            style={styles.acceptButton}
          />
        )}
        
        {isFixer && isAccepted && (
          <Button
            title="Markeer als voltooid"
            onPress={handleCompleteRepair}
            isLoading={isCompleting}
            style={styles.completeButton}
          />
        )}
        
        {/* Contact button (always visible if repair is accepted) */}
        {isAccepted && (
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push(`/chat/${repair.id}`)}
          >
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.contactButtonText}>Contact opnemen</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: Colors.background.light,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background.light,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  statusContainer: {
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  repairImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 12,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  userBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  userBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.secondary,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  reviewCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 18,
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    padding: 20,
    marginBottom: 20,
  },
  cancelButton: {
    marginBottom: 12,
  },
  acceptButton: {
    marginBottom: 12,
  },
  completeButton: {
    marginBottom: 12,
  },
  reviewButton: {
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginLeft: 8,
  },
});