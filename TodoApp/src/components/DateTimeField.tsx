import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, radius } from '../theme';
import { fmtDate } from '../utils/format';

// Android shows date and time pickers separately, so we chain them: date -> time.
export default function DateTimeField({
  label,
  value,
  onPick,
  minimumDate,
}: {
  label: string;
  value: Date;
  onPick: (d: Date) => void;
  minimumDate?: Date;
}) {
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  const [draft, setDraft] = useState(value);

  const handle = (e: DateTimePickerEvent, d?: Date) => {
    if (e.type === 'dismissed' || !d) {
      setMode(null);
      return;
    }
    if (mode === 'date') {
      setDraft(d); // keep chosen date, now ask for time
      setMode('time');
    } else {
      const merged = new Date(draft);
      merged.setHours(d.getHours(), d.getMinutes(), 0, 0);
      setMode(null);
      onPick(merged);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        style={s.field}
        onPress={() => {
          setDraft(value);
          setMode('date');
        }}>
        <Text style={s.value}>📅  {fmtDate(value)}</Text>
      </Pressable>
      {mode && <DateTimePicker value={draft} mode={mode} minimumDate={mode === 'date' ? minimumDate : undefined} onChange={handle} />}
    </View>
  );
}

const s = StyleSheet.create({
  label: { color: colors.muted, fontSize: 13, marginBottom: 6, fontWeight: '600' },
  field: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  value: { color: colors.text, fontSize: 16 },
});
