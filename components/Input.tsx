import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  isPassword = false,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        props.editable === false ? styles.inputDisabled : null
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.gray[400]}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
            {secureTextEntry ? (
              <Eye size={20} color={Colors.gray[500]} />
            ) : (
              <EyeOff size={20} color={Colors.gray[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputDisabled: {
    backgroundColor: Colors.gray[100],
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  eyeIcon: {
    padding: 10,
  },
});

export default Input;