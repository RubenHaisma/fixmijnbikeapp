import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { repairAPI } from '../../services/api';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Fout', 'Selecteer een beoordeling (1-5 sterren)');
      return;
    }

    setIsSubmitting(true);

    try {
      await repairAPI.reviewRepair(id as string, rating, comment);
      
      Alert.alert(
        'Beoordeling geplaatst',
        'Bedankt voor je beoordeling!',
        [
          {
            text: 'OK',
            onPress: () => router.replace(`/repair/${id}`),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het plaatsen van je beoordeling.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Beoordeling geven</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Hoe was je ervaring?</Text>
          <Text style={styles.subtitle}>
            Laat een beoordeling achter voor de fixer die je fiets heeft gerepareerd.
          </Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Star
                  size={40}
                  color={star <= rating ? Colors.secondary : Colors.gray[300]}
                  fill={star <= rating ? Colors.secondary : 'none'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.ratingText}>
            {rating === 0 ? 'Selecteer een beoordeling' : 
              rating === 1 ? 'Slecht' :
              rating === 2 ? 'Matig' :
              rating === 3 ? 'Gemiddeld' :
              rating === 4 ? 'Goed' : 'Uitstekend'}
          </Text>

          <Text style={styles.commentLabel}>Jouw feedback (optioneel)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Deel je ervaring met deze fixer..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />

          <Button
            title="Beoordeling plaatsen"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    height: 150,
    marginBottom: 30,
  },
  submitButton: {
    marginBottom: 20,
  },
});