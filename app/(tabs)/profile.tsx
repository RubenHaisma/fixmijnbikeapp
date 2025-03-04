import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  CreditCard, 
  Bell, 
  HelpCircle,
  Star,
  Bike,
  Tool
} from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isFixerMode, setIsFixerMode] = useState(user?.role === 'fixer');
  
  const handleSignOut = () => {
    Alert.alert(
      'Uitloggen',
      'Weet je zeker dat je wilt uitloggen?',
      [
        {
          text: 'Annuleren',
          style: 'cancel',
        },
        {
          text: 'Uitloggen',
          onPress: () => signOut(),
          style: 'destructive',
        },
      ]
    );
  };

  const toggleFixerMode = () => {
    if (user?.role === 'fixer') {
      setIsFixerMode(!isFixerMode);
    } else {
      Alert.alert(
        'Word een Fixer',
        'Je moet eerst een Fixer worden om deze functie te gebruiken.',
        [
          {
            text: 'Annuleren',
            style: 'cancel',
          },
          {
            text: 'Word Fixer',
            onPress: () => router.push('/onboarding/role'),
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profiel</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ 
            uri: user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' 
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || 'Gebruiker'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'gebruiker@email.nl'}</Text>
        
        {user?.role === 'fixer' && (
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
            <Text style={styles.ratingText}>4.8 (56 beoordelingen)</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editProfileText}>Profiel bewerken</Text>
        </TouchableOpacity>
      </View>

      {user?.role === 'fixer' && (
        <View style={styles.switchModeSection}>
          <View style={styles.switchModeContent}>
            <View>
              <Text style={styles.switchModeTitle}>
                {isFixerMode ? 'Fixer modus actief' : 'Fixer modus inactief'}
              </Text>
              <Text style={styles.switchModeDescription}>
                {isFixerMode 
                  ? 'Je bent zichtbaar voor reparatieaanvragen' 
                  : 'Je bent niet zichtbaar voor reparatieaanvragen'}
              </Text>
            </View>
            <Switch
              value={isFixerMode}
              onValueChange={toggleFixerMode}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '70' }}
              thumbColor={isFixerMode ? Colors.primary : Colors.gray[100]}
              ios_backgroundColor={Colors.gray[300]}
            />
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Bike size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Reparaties</Text>
        </View>
        
        {user?.role === 'fixer' && (
          <View style={styles.statCard}>
            <Tool size={24} color={Colors.secondary} />
            <Text style={styles.statNumber}>€285</Text>
            <Text style={styles.statLabel}>Verdiend</Text>
          </View>
        )}
        
        <View style={styles.statCard}>
          <Star size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Beoordelingen</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/edit')}
        >
          <User size={20} color={Colors.primary} />
          <Text style={styles.menuItemText}>Persoonlijke gegevens</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/payments')}
        >
          <CreditCard size={20} color={Colors.primary} />
          <Text style={styles.menuItemText}>Betalingen</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/notifications/preferences')}
        >
          <Bell size={20} color={Colors.primary} />
          <Text style={styles.menuItemText}>Notificaties</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color={Colors.primary} />
          <Text style={styles.menuItemText}>Instellingen</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Ondersteuning</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/help')}
        >
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.menuItemText}>Hulp & ondersteuning</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/terms')}
        >
          <Text style={[styles.menuItemIcon, { fontSize: 16 }]}>📄</Text>
          <Text style={styles.menuItemText}>Algemene voorwaarden</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/privacy')}
        >
          <Text style={[styles.menuItemIcon, { fontSize: 16 }]}>🔒</Text>
          <Text style={styles.menuItemText}>Privacybeleid</Text>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.signOutText}>Uitloggen</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Versie 1.0.0</Text>
    </ScrollView>
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
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  switchModeSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  switchModeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchModeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  switchModeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemIcon: {
    width: 20,
    textAlign: 'center',
    color: Colors.primary,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    textAlign: 'center',
    marginBottom: 40,
  },
});