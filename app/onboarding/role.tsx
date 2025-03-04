import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { router } from 'expo-router';
import { Bike, Tool, ChevronRight } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function RoleSelectionScreen() {
  const { updateUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'rider' | 'fixer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      await updateUserRole(selectedRole);
      // Navigation is handled in the updateUserRole function
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://fixmijnbike.nl/logo.png' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Hoe wil je FixMijnBike gebruiken?</Text>
        <Text style={styles.subtitle}>
          Kies hoe je onze app wilt gebruiken. Je kunt dit later altijd wijzigen.
        </Text>
      </View>

      <View style={styles.roleCards}>
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'rider' && styles.selectedRoleCard,
          ]}
          onPress={() => setSelectedRole('rider')}
        >
          <View style={styles.roleIconContainer}>
            <Bike size={32} color={Colors.primary} />
          </View>
          <Text style={styles.roleTitle}>Ik heb een fietsreparatie nodig</Text>
          <Text style={styles.roleDescription}>
            Vind lokale fixers die je fiets kunnen repareren, waar en wanneer het jou uitkomt.
          </Text>
          <View style={styles.roleBenefits}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Vind fixers in je buurt</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Vergelijk prijzen en beoordelingen</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Snelle en betrouwbare service</Text>
            </View>
          </View>
          <ChevronRight 
            size={24} 
            color={selectedRole === 'rider' ? Colors.primary : Colors.gray[400]} 
            style={styles.roleArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'fixer' && styles.selectedRoleCard,
          ]}
          onPress={() => setSelectedRole('fixer')}
        >
          <View style={styles.roleIconContainer}>
            <Tool size={32} color={Colors.secondary} />
          </View>
          <Text style={styles.roleTitle}>Ik wil fietsen repareren</Text>
          <Text style={styles.roleDescription}>
            Verdien geld door je fietsreparatievaardigheden aan te bieden aan mensen in je buurt.
          </Text>
          <View style={styles.roleBenefits}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Verdien extra inkomen</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Werk wanneer het jou uitkomt</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Bouw een klantenbestand op</Text>
            </View>
          </View>
          <ChevronRight 
            size={24} 
            color={selectedRole === 'fixer' ? Colors.secondary : Colors.gray[400]} 
            style={styles.roleArrow}
          />
        </TouchableOpacity>
      </View>

      <Button
        title="Doorgaan"
        onPress={handleContinue}
        isLoading={isLoading}
        disabled={!selectedRole}
        style={styles.continueButton}
      />
    </ScrollView>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 20,
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
    textAlign: 'center',
  },
  roleCards: {
    marginBottom: 30,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedRoleCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05', // 5% opacity
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  roleBenefits: {
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.success,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  roleArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  continueButton: {
    marginBottom: 40,
  },
});