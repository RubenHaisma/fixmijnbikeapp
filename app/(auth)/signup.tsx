import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(data.email, data.password, data.name);
    } catch (err) {
      setError('Registreren mislukt. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://fixmijnbike.nl/logo.png' }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Account aanmaken</Text>
            <Text style={styles.subtitle}>
              Maak een account aan om je fiets te laten repareren of om reparaties uit te voeren
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              rules={{
                required: 'Naam is verplicht',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Naam"
                  placeholder="Jouw naam"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
              name="name"
            />

            <Controller
              control={control}
              rules={{
                required: 'E-mail is verplicht',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ongeldig e-mailadres',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  placeholder="jouw@email.nl"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                required: 'Wachtwoord is verplicht',
                minLength: {
                  value: 6,
                  message: 'Wachtwoord moet minimaal 6 tekens bevatten',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Wachtwoord"
                  placeholder="Kies een wachtwoord"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
              name="password"
            />

            <Controller
              control={control}
              rules={{
                required: 'Bevestig je wachtwoord',
                validate: value => value === password || 'Wachtwoorden komen niet overeen',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bevestig wachtwoord"
                  placeholder="Bevestig je wachtwoord"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
              name="confirmPassword"
            />

            <Button
              title="Registreren"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Heb je al een account?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Inloggen</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
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
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginLeft: 5,
  },
  errorContainer: {
    backgroundColor: Colors.error + '20', // 20% opacity
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});