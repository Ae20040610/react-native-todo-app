import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import { fetchTasks, removeTask, setFilter, setSort, toggleTask } from '../store/tasksSlice';
import { sortTasks } from '../utils/sortTasks';
import TaskItem from '../components/TaskItem';
import { Chip, ErrorText } from '../components/UI';
import { colors } from '../theme';
import { Filter, SortMode } from '../types';

const FILTERS: Filter[] = ['all', 'active', 'done'];
const SORTS: { key: SortMode; label: string }[] = [
  { key: 'smart', label: '✨ Smart' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'priority', label: 'Priority' },
];

export default function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items, loading, error, filter, sort } = useAppSelector((s) => s.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Apply filter then sort. Recomputed only when inputs change.
  const visible = useMemo(() => {
    const filtered = items.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed));
    return sortTasks(filtered, sort);
  }, [items, filter, sort]);

  const done = items.filter((t) => t.completed).length;
  const progress = items.length ? done / items.length : 0;

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.hello}>Hi, {user?.email.split('@')[0]} 👋</Text>
          <Text style={s.count}>
            {done}/{items.length} tasks completed
          </Text>
        </View>
        <Pressable onPress={() => dispatch(logout())} style={s.logout}>
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* progress bar */}
      <View style={s.barBg}>
        <View style={[s.barFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={s.chips}>
        {FILTERS.map((f) => (
          <Chip key={f} label={f[0].toUpperCase() + f.slice(1)} active={filter === f} onPress={() => dispatch(setFilter(f))} />
        ))}
      </View>
      <View style={s.chips}>
        <Text style={s.sortLabel}>Sort:</Text>
        {SORTS.map((o) => (
          <Chip key={o.key} label={o.label} active={sort === o.key} color={colors.accent} onPress={() => dispatch(setSort(o.key))} />
        ))}
      </View>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={visible}
        keyExtractor={(t) => t._id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={(t) => dispatch(toggleTask(t))} onDelete={(id) => dispatch(removeTask(id))} />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchTasks())} tintColor={colors.primary} />}
        ListEmptyComponent={
          !loading ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 48 }}>🌙</Text>
              <Text style={s.emptyText}>{items.length ? 'Nothing in this view' : 'No tasks yet. Tap + to add one!'}</Text>
            </View>
          ) : null
        }
      />

      <Pressable style={s.fab} onPress={() => navigation.navigate('AddTask')}>
        <Text style={s.fabText}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 14 },
  hello: { color: colors.text, fontSize: 24, fontWeight: '800' },
  count: { color: colors.muted, marginTop: 2 },
  logout: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  logoutText: { color: colors.muted, fontWeight: '600' },
  barBg: { height: 8, backgroundColor: colors.cardAlt, borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.success, borderRadius: 4 },
  chips: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  sortLabel: { color: colors.muted, marginRight: 8, marginBottom: 8, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 70 },
  emptyText: { color: colors.muted, marginTop: 10, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});
