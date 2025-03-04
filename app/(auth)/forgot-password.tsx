import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

type FormData = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://fixmijnbike.nl/logo.png' }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Wachtwoord vergeten</Text>
            <Text style={styles.subtitle}>
              Voer je e-mailadres in om een link te ontvangen waarmee je je wachtwoord kunt resetten
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isSubmitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>E-mail verzonden!</Text>
              <Text style={styles.successText}>
                We hebben een e-mail gestuurd naar het opgegeven adres met instructies om je wachtwoord te resetten.
              </Text>
              <Button
                title="Terug naar inloggen"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.button}
              />
            </View>
          ) : (
            <View style={styles.form}>
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

              <Button
                title="Verstuur reset link"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                style={styles.button}
              />

              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.loginLink}>
                  <Text style={styles.loginText}>Terug naar inloggen</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
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
  loginLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
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
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.success,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
});