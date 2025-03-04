import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon, Filter, MapPin, Star } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';

// Mock data for fixers
const fixers = [
  {
    id: '1',
    name: 'Jan Bakker',
    rating: 4.8,
    reviews: 56,
    distance: '1.2 km',
    specialties: ['Banden', 'Remmen', 'Versnellingen'],
    hourlyRate: '€25',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Lisa Jansen',
    rating: 4.9,
    reviews: 124,
    distance: '2.5 km',
    specialties: ['Elektrische fietsen', 'Banden', 'Kettingen'],
    hourlyRate: '€30',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '3',
    name: 'Pieter de Vries',
    rating: 4.7,
    reviews: 42,
    distance: '3.1 km',
    specialties: ['Remmen', 'Verlichting', 'Algemene reparaties'],
    hourlyRate: '€22',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '4',
    name: 'Emma Visser',
    rating: 4.6,
    reviews: 38,
    distance: '3.8 km',
    specialties: ['Banden', 'Kettingen', 'Zadels'],
    hourlyRate: '€20',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '5',
    name: 'Thomas Smit',
    rating: 4.9,
    reviews: 87,
    distance: '4.2 km',
    specialties: ['Elektrische fietsen', 'Versnellingen', 'Diagnose'],
    hourlyRate: '€35',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  },
];

// Filter options
const filterOptions = {
  specialties: ['Banden', 'Remmen', 'Versnellingen', 'Kettingen', 'Verlichting', 'Elektrische fietsen'],
  distance: ['< 1 km', '< 3 km', '< 5 km', '< 10 km', 'Alle afstanden'],
  rating: ['4.5+', '4.0+', '3.5+', 'Alle ratings'],
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    specialties: [] as string[],
    distance: '< 5 km',
    rating: '4.0+',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const toggleFilter = (category: 'specialties' | 'distance' | 'rating', value: string) => {
    if (category === 'specialties') {
      if (selectedFilters.specialties.includes(value)) {
        setSelectedFilters({
          ...selectedFilters,
          specialties: selectedFilters.specialties.filter(item => item !== value),
        });
      } else {
        setSelectedFilters({
          ...selectedFilters,
          specialties: [...selectedFilters.specialties, value],
        });
      }
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [category]: value,
      });
    }
  };

  const filteredFixers = fixers.filter(fixer => {
    // Filter by search query
    if (searchQuery && !fixer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !fixer.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by specialties
    if (selectedFilters.specialties.length > 0 && 
        !selectedFilters.specialties.some(s => fixer.specialties.includes(s))) {
      return false;
    }
    
    // Filter by rating
    if (selectedFilters.rating !== 'Alle ratings') {
      const minRating = parseFloat(selectedFilters.rating.replace('+', ''));
      if (fixer.rating < minRating) {
        return false;
      }
    }
    
    // Filter by distance
    if (selectedFilters.distance !== 'Alle afstanden') {
      const maxDistance = parseFloat(selectedFilters.distance.replace('< ', '').replace(' km', ''));
      const fixerDistance = parseFloat(fixer.distance.replace(' km', ''));
      if (fixerDistance > maxDistance) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zoeken</Text>
        
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={Colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Zoek op naam of specialiteit"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? Colors.primary : Colors.gray[500]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'list' && styles.viewToggleButtonActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <Text
              style={[
                styles.viewToggleText,
                viewMode === 'list' && styles.viewToggleTextActive,
              ]}
            >
              Lijst
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'map' && styles.viewToggleButtonActive,
            ]}
            onPress={() => setViewMode('map')}
          >
            <Text
              style={[
                styles.viewToggleText,
                viewMode === 'map' && styles.viewToggleTextActive,
              ]}
            >
              Kaart
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Specialiteiten</Text>
          <View style={styles.filterOptionsRow}>
            {filterOptions.specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.filterChip,
                  selectedFilters.specialties.includes(specialty) && styles.filterChipSelected,
                ]}
                onPress={() => toggleFilter('specialties', specialty)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilters.specialties.includes(specialty) && styles.filterChipTextSelected,
                  ]}
                >
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.filterTitle}>Afstand</Text>
          <View style={styles.filterOptionsRow}>
            {filterOptions.distance.map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.filterChip,
                  selectedFilters.distance === distance && styles.filterChipSelected,
                ]}
                onPress={() => toggleFilter('distance', distance)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilters.distance === distance && styles.filterChipTextSelected,
                  ]}
                >
                  {distance}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.filterTitle}>Beoordeling</Text>
          <View style={styles.filterOptionsRow}>
            {filterOptions.rating.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.filterChip,
                  selectedFilters.rating === rating && styles.filterChipSelected,
                ]}
                onPress={() => toggleFilter('rating', rating)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilters.rating === rating && styles.filterChipTextSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {viewMode === 'list' ? (
        <FlatList
          data={filteredFixers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.fixersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Geen fixers gevonden die aan je criteria voldoen.
              </Text>
              <Button
                title="Filters wissen"
                variant="outline"
                onPress={() => {
                  setSelectedFilters({
                    specialties: [],
                    distance: '< 5 km',
                    rating: '4.0+',
                  });
                  setSearchQuery('');
                }}
                style={{ marginTop: 16 }}
              />
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.fixerCard}
              onPress={() => router.push(`/fixer/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.fixerImage} />
              <View style={styles.fixerInfo}>
                <Text style={styles.fixerName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.reviews}>({item.reviews})</Text>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={Colors.gray[500]} />
                  <Text style={styles.distance}>{item.distance}</Text>
                </View>
                <View style={styles.specialtiesContainer}>
                  {item.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyBadge}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.hourlyRate}>{item.hourlyRate}/uur</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.mapContainer}>
          {/* Here you would integrate react-native-maps */}
          <Text style={styles.mapPlaceholder}>
            Kaartweergave is momenteel niet beschikbaar in de webversie.
          </Text>
        </View>
      )}
    </View>
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
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
  },
  filterButton: {
    padding: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  viewToggleTextActive: {
    color: Colors.white,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 8,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
   },
  filterChipTextSelected: {
    color: Colors.primary,
  },
  fixersList: {
    padding: 20,
    paddingBottom: 40,
  },
  fixerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  fixerImage: {
    width: 100,
    height: 'auto',
    aspectRatio: 3/4,
  },
  fixerInfo: {
    flex: 1,
    padding: 12,
  },
  fixerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
  distance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
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
  hourlyRate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
  },
  mapPlaceholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});