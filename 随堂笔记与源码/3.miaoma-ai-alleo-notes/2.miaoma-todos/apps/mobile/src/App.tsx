import { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { Task } from '@miaoma/shared-types';

export default function App() {
  const tasks = useMemo<Task[]>(() => [
    {
      id: 'mobile-task-1',
      title: '欢迎使用 Miaoma Todo 移动端',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ], []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.kicker}>MIAOMA TODO</Text>
        <Text style={styles.title}>今天</Text>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.checkbox} />
            <Text style={styles.taskTitle}>{task.title}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flex: 1, padding: 24 },
  kicker: { color: '#64748b', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#18212f', fontSize: 38, fontWeight: '700', marginBottom: 24 },
  taskCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', padding: 16 },
  checkbox: { borderColor: '#94a3b8', borderRadius: 8, borderWidth: 1.5, height: 20, marginRight: 12, width: 20 },
  taskTitle: { color: '#18212f', flex: 1, fontSize: 16 },
});
