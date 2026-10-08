import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { clearError, register } from '../store/authSlice';
import { ErrorText, Input, PrimaryButton } from '../components/UI';
import { colors } from '../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localErr, setLocalErr] = useState('');

  // Client-side validation before hitting the API
  const submit = () => {
    if (!EMAIL_RE.test(email.trim())) return setLocalErr('Enter a valid email address');
    if (password.length < 6) return setLocalErr('Password must be at least 6 characters');
    if (password !== confirm) return setLocalErr('Passwords do not match');
    setLocalErr('');
    dispatch(register({ email: email.trim(), password }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>Create account</Text>
        <Text style={s.sub}>Start organizing your day in seconds.</Text>

        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
        <Input label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" />
        <ErrorText>{localErr || error}</ErrorText>
        <PrimaryButton title="Sign up" onPress={submit} loading={loading} />

        <View style={s.row}>
          <Text style={s.muted}>Already registered? </Text>
          <Text
            style={s.link}
            onPress={() => {
              dispatch(clearError());
              navigation.goBack();
            }}>
            Log in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { color: colors.text, fontSize: 32, fontWeight: '900' },
  sub: { color: colors.muted, fontSize: 16, marginBottom: 32, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  muted: { color: colors.muted },
  link: { color: colors.accent, fontWeight: '700' },
});
