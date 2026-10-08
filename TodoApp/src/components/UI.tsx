import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '../theme';

// Labeled text input used on every form
export const Input = ({ label, ...props }: TextInputProps & { label: string }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput placeholderTextColor={colors.muted} style={s.input} {...props} />
  </View>
);

// Main call-to-action button with loading state
export const PrimaryButton = ({
  title,
  onPress,
  loading,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{title}</Text>}
  </Pressable>
);

// Selectable pill used for filters, sort modes, priority and category
export const Chip = ({
  label,
  active,
  onPress,
  color = colors.primary,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) => (
  <Pressable
    onPress={onPress}
    style={[s.chip, active && { backgroundColor: color + '33', borderColor: color }]}>
    <Text style={[s.chipText, active && { color }]}>{label}</Text>
  </Pressable>
);

export const ErrorText = ({ children }: { children?: string | null }) =>
  children ? <Text style={s.error}>{children}</Text> : null;

const s = StyleSheet.create({
  label: { color: colors.muted, fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: colors.muted, fontWeight: '600', fontSize: 13 },
  error: { color: colors.danger, marginBottom: 12, fontSize: 14 },
});
