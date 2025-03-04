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
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(data.email, data.password);
    } catch (err) {
      setError('Inloggen mislukt. Controleer je e-mail en wachtwoord.');
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
            <Text style={styles.title}>Inloggen</Text>
            <Text style={styles.subtitle}>
              Log in om je fiets te laten repareren of om reparaties uit te voeren
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
                  placeholder="Jouw wachtwoord"
                  isPassword
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
              name="password"
            />

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Wachtwoord vergeten?</Text>
              </TouchableOpacity>
            </Link>

            <Button
              title="Inloggen"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              style={styles.button}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Nog geen account?</Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Registreren</Text>
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
    marginTop: 60,
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
  forgotPassword: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  signupLink: {
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