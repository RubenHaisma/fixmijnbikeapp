import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin, X } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

type FormData = {
  title: string;
  description: string;
  location: string;
};

const repairTypes = [
  { id: 'flat_tire', name: 'Lekke band', icon: '🛞' },
  { id: 'brakes', name: 'Remmen', icon: '🛑' },
  { id: 'gears', name: 'Versnellingen', icon: '⚙️' },
  { id: 'chain', name: 'Ketting', icon: '⛓️' },
  { id: 'lights', name: 'Verlichting', icon: '💡' },
  { id: 'other', name: 'Anders', icon: '🔧' },
];

export default function CreateRepairScreen() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
    }
  });

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Maximum bereikt', 'Je kunt maximaal 3 foto\'s toevoegen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedType) {
      Alert.alert('Fout', 'Selecteer een type reparatie');
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would upload the data to your API
      // const formData = new FormData();
      // formData.append('title', data.title);
      // formData.append('description', data.description);
      // formData.append('location', data.location);
      // formData.append('type', selectedType);
      
      // images.forEach((image, index) => {
      //   const filename = image.split('/').pop();
      //   const match = /\.(\w+)$/.exec(filename || '');
      //   const type = match ? `image/${match[1]}` : 'image';
      //   formData.append('images', { uri: image, name: filename, type } as any);
      // });

      // const response = await fetch('https://fixmijnbike.nl/api/repairs', {
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
        Alert.alert(
          'Reparatie aangevraagd',
          'Je reparatie is succesvol aangevraagd. Fixers in de buurt zullen contact met je opnemen.',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/(tabs)') 
            }
          ]
        );
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het aanvragen van de reparatie.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Reparatie aanvragen</Text>
          <Text style={styles.subtitle}>
            Beschrijf je probleem en vind een fixer in jouw buurt
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Type reparatie</Text>
          <View style={styles.repairTypesContainer}>
            {repairTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.repairTypeButton,
                  selectedType === type.id && styles.selectedRepairType,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={styles.repairTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.repairTypeName,
                  selectedType === type.id && styles.selectedRepairTypeName,
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Controller
            control={control}
            rules={{ required: 'Titel is verplicht' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Titel"
                placeholder="Bijv. Lekke band vervangen"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            rules={{ required: 'Beschrijving is verplicht' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Beschrijving"
                placeholder="Beschrijf het probleem zo duidelijk mogelijk"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ height: 100 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.description?.message}
              />
            )}
            name="description"
          />

          <Controller
            control={control}
            rules={{ required: 'Locatie is verplicht' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Locatie"
                placeholder="Jouw adres of locatie"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.location?.message}
                leftIcon={<MapPin size={20} color={Colors.gray[500]} />}
              />
            )}
            name="location"
          />

          <Text style={styles.sectionTitle}>Foto's toevoegen (optioneel)</Text>
          <Text style={styles.sectionSubtitle}>
            Voeg foto's toe van je fiets om het probleem duidelijker te maken
          </Text>

          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 3 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Camera size={24} color={Colors.primary} />
                <Text style={styles.addImageText}>Foto toevoegen</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            title="Reparatie aanvragen"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
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
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  repairTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  repairTypeButton: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: '3.5%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  selectedRepairType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  repairTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  repairTypeName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  selectedRepairTypeName: {
    color: Colors.primary,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  addImageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});