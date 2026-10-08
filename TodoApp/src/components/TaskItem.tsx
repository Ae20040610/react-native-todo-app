import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { colors, radius } from '../theme';
import { fmtDate, timeLeft } from '../utils/format';

interface Props {
  task: Task;
  onToggle: (t: Task) => void;
  onDelete: (id: string) => void;
}

// One task card: checkbox, title, tags, deadline countdown and delete button
export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const color = colors[task.priority];
  const overdue = !task.completed && new Date(task.deadline) < new Date();

  const confirmDelete = () =>
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task._id) },
    ]);

  return (
    <View style={[s.card, { borderLeftColor: color }, task.completed && { opacity: 0.55 }]}>
      <Pressable onPress={() => onToggle(task)} hitSlop={10} style={[s.check, task.completed && s.checkOn]}>
        {task.completed && <Text style={s.tick}>✓</Text>}
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={[s.title, task.completed && s.strike]} numberOfLines={1}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={s.desc} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <View style={s.tags}>
          <Text style={[s.tag, { color, borderColor: color }]}>{task.priority.toUpperCase()}</Text>
          <Text style={[s.tag, { color: colors.accent, borderColor: colors.accent }]}>{task.category}</Text>
        </View>
        <Text style={s.meta}>🕒 {fmtDate(task.dateTime)}</Text>
        <Text style={[s.meta, overdue && { color: colors.danger }]}>
          ⏳ Due {fmtDate(task.deadline)} · {task.completed ? 'Completed' : timeLeft(task.deadline)}
        </Text>
      </View>

      <Pressable onPress={confirmDelete} hitSlop={10}>
        <Text style={s.trash}>🗑</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderLeftWidth: 5,
    padding: 14,
    marginBottom: 12,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.muted,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: '#0B1020', fontWeight: '900' },
  title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  strike: { textDecorationLine: 'line-through' },
  desc: { color: colors.muted, marginTop: 3, fontSize: 14 },
  tags: { flexDirection: 'row', marginTop: 8, marginBottom: 6 },
  tag: { fontSize: 10, fontWeight: '800', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  trash: { fontSize: 20, marginLeft: 8 },
});
