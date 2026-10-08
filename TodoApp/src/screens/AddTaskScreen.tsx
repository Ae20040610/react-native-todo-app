import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store';
import { addTask } from '../store/tasksSlice';
import { Chip, ErrorText, Input, PrimaryButton } from '../components/UI';
import DateTimeField from '../components/DateTimeField';
import { colors } from '../theme';
import { Priority } from '../types';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES = ['Work', 'Personal', 'Study', 'Health', 'Other'];

export default function AddTaskScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AddTask'>) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Personal');
  const [dateTime, setDateTime] = useState(new Date());
  // Default deadline: one day after the task time
  const [deadline, setDeadline] = useState(new Date(Date.now() + 24 * 3600 * 1000));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!title.trim()) return setError('Title is required');
    if (deadline < dateTime) return setError('Deadline cannot be before the task date-time');
    setError('');
    setSaving(true);
    const res = await dispatch(
      addTask({
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
        category,
      }),
    );
    setSaving(false);
    if (addTask.fulfilled.match(res)) navigation.goBack();
    else setError((res.payload as string) ?? 'Could not save task');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={s.top}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={s.back}>← Back</Text>
          </Pressable>
          <Text style={s.heading}>New task</Text>
        </View>

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Finish assignment" />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Optional details" multiline style={{ minHeight: 80, textAlignVertical: 'top' }} />

        <DateTimeField label="Task date & time" value={dateTime} onPick={setDateTime} />
        <DateTimeField label="Deadline" value={deadline} onPick={setDeadline} minimumDate={dateTime} />

        <Text style={s.label}>Priority</Text>
        <View style={s.row}>
          {PRIORITIES.map((p) => (
            <Chip key={p} label={p[0].toUpperCase() + p.slice(1)} active={priority === p} color={colors[p]} onPress={() => setPriority(p)} />
          ))}
        </View>

        <Text style={s.label}>Category</Text>
        <View style={s.row}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} color={colors.accent} onPress={() => setCategory(c)} />
          ))}
        </View>

        <ErrorText>{error}</ErrorText>
        <PrimaryButton title="Save task" onPress={save} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: { marginBottom: 20 },
  back: { color: colors.accent, fontWeight: '700', marginBottom: 8 },
  heading: { color: colors.text, fontSize: 30, fontWeight: '900' },
  label: { color: colors.muted, fontSize: 13, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
});
