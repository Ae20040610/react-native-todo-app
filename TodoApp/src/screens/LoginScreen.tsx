import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { clearError, login } from '../store/authSlice';
import { ErrorText, Input, PrimaryButton } from '../components/UI';
import { colors } from '../theme';

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState('');

  const submit = () => {
    if (!email.trim() || !password) return setLocalErr('Enter your email and password');
    setLocalErr('');
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>✦ Tasklight</Text>
        <Text style={s.sub}>Welcome back. Let's get things done.</Text>

        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        <ErrorText>{localErr || error}</ErrorText>
        <PrimaryButton title="Log in" onPress={submit} loading={loading} />

        <View style={s.row}>
          <Text style={s.muted}>New here? </Text>
          <Text
            style={s.link}
            onPress={() => {
              dispatch(clearError());
              navigation.navigate('Register');
            }}>
            Create an account
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { color: colors.text, fontSize: 36, fontWeight: '900' },
  sub: { color: colors.muted, fontSize: 16, marginBottom: 32, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  muted: { color: colors.muted },
  link: { color: colors.accent, fontWeight: '700' },
});
