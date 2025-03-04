import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

// Specialties options
const specialties = [
  { id: 'flat_tire', name: 'Lekke banden' },
  { id: 'brakes', name: 'Remmen' },
  { id: 'gears', name: 'Versnellingen' },
  { id: 'chain', name: 'Kettingen' },
  { id: 'lights', name: 'Verlichting' },
  { id: 'electric', name: 'Elektrische fietsen' },
  { id: 'wheels', name: 'Wielen' },
  { id: 'general', name: 'Algemene reparaties' },
];

export default function FixerOnboardingScreen() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleSpecialty = (id: string) => {
    if (selectedSpecialties.includes(id)) {
      setSelectedSpecialties(selectedSpecialties.filter(item => item !== id));
    } else {
      setSelectedSpecialties([...selectedSpecialties, id]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !profileImage) {
      Alert.alert('Profielfoto vereist', 'Upload een profielfoto om door te gaan.');
      return;
    }

    if (currentStep === 2 && !bio.trim()) {
      Alert.alert('Bio vereist', 'Vul een korte beschrijving in om door te gaan.');
      return;
    }

    if (currentStep === 3 && !hourlyRate.trim()) {
      Alert.alert('Uurtarief vereist', 'Vul je uurtarief in om door te gaan.');
      return;
    }

    if (currentStep === 4 && selectedSpecialties.length === 0) {
      Alert.alert('Specialiteiten vereist', 'Selecteer ten minste één specialiteit om door te gaan.');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // In a real app, you would upload the data to your API
      // const formData = new FormData();
      // formData.append('bio', bio);
      // formData.append('hourlyRate', hourlyRate);
      // formData.append('specialties', JSON.stringify(selectedSpecialties));
      
      // if (profileImage) {
      //   const filename = profileImage.split('/').pop();
      //   const match = /\.(\w+)$/.exec(filename || '');
      //   const type = match ? `image/${match[1]}` : 'image';
      //   formData.append('profileImage', { uri: profileImage, name: filename, type } as any);
      // }

      // const response = await fetch('https://fixmijnbike.nl/api/users/fixer-profile', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      // Mock successful response
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het opslaan van je profiel.');
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View 
            key={step} 
            style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
              currentStep > step && styles.completedStepDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Profielfoto</Text>
            <Text style={styles.stepDescription}>
              Upload een duidelijke profielfoto zodat klanten je kunnen herkennen.
            </Text>
            
            <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={40} color={Colors.gray[400]} />
                  <Text style={styles.imagePlaceholderText}>Tik om een foto te uploaden</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={styles.imageHint}>
              Tip: Gebruik een foto waar je gezicht duidelijk zichtbaar is voor een professionele uitstraling.
            </Text>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Over jou</Text>
            <Text style={styles.stepDescription}>
              Vertel potentiële klanten iets over jezelf en je ervaring met fietsreparaties.
            </Text>
            
            <TextInput
              style={styles.bioInput}
              placeholder="Bijv. Ik repareer al 5 jaar fietsen en ben gespecialiseerd in het repareren van lekke banden en het afstellen van versnellingen..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />
            
            <Text style={styles.bioCounter}>{bio.length}/300 tekens</Text>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Uurtarief</Text>
            <Text style={styles.stepDescription}>
              Stel je uurtarief in voor fietsreparaties. Je kunt dit later altijd aanpassen.
            </Text>
            
            <View style={styles.rateInputContainer}>
              <Text style={styles.currencySymbol}>€</Text>
              <TextInput
                style={styles.rateInput}
                placeholder="25"
                keyboardType="numeric"
                value={hourlyRate}
                onChangeText={setHourlyRate}
              />
              <Text style={styles.perHour}>/uur</Text>
            </View>
            
            <Text style={styles.rateHint}>
              Tip: Het gemiddelde uurtarief voor fietsreparaties ligt tussen €20 en €35.
            </Text>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Specialiteiten</Text>
            <Text style={styles.stepDescription}>
              Selecteer de reparaties waarin je gespecialiseerd bent.
            </Text>
            
            <View style={styles.specialtiesContainer}>
              {specialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty.id}
                  style={[
                    styles.specialtyChip,
                    selectedSpecialties.includes(specialty.id) && styles.specialtyChipSelected,
                  ]}
                  onPress={() => toggleSpecialty(specialty.id)}
                >
                  <Text
                    style={[
                      styles.specialtyChipText,
                      selectedSpecialties.includes(specialty.id) && styles.specialtyChipTextSelected,
                    ]}
                  >
                    {specialty.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Word een Fixer</Text>
          <Text style={styles.subtitle}>
            Vul je profiel in om te beginnen met het aanbieden van fietsreparaties
          </Text>
          {renderStepIndicator()}
        </View>
        
        {renderStepContent()}
        
        <View style={styles.buttonContainer}>
          <Button
            title={currentStep === 4 ? "Voltooien" : "Volgende"}
            onPress={handleNext}
            isLoading={isLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
  },
  completedStepDot: { backgroundColor: Colors.success,
  },
  stepContent: {
    marginTop: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  imageHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    height: 150,
    marginBottom: 8,
  },
  bioCounter: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    textAlign: 'right',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginRight: 8,
  },
  rateInput: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    width: 100,
    textAlign: 'center',
  },
  perHour: {
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  rateHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    textAlign: 'center',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specialtyChip: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyChipSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  specialtyChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  specialtyChipTextSelected: {
    color: Colors.primary,
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    width: '100%',
  },
});