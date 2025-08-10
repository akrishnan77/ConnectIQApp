import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';
import { Toolbar } from '../../ui/Toolbar';
import { getTodoTasks } from '../../graph';

export default function Dashboard({ token, onViewTasks, showToolbar = true }: { token: string; onViewTasks: () => void; showToolbar?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try { setTasks(await getTodoTasks(token)); } finally { setLoading(false); }
    })();
  }, [token]);
  const first = tasks[0];
  return (
    <View style={{ flex: 1 }}>
      {showToolbar && <Toolbar title="Dashboard" />}
      <View style={{ padding: 16 }}>
        {/* Shift card placeholder to mirror layout */}
        <Card>
          <View style={[styles.headerRow]}>
            <Image source={require('../../../assets/images/home/icon_shift.png')} style={styles.iconSmall} />
            <Text style={styles.headerTitle}>Shift</Text>
          </View>
          <Text style={[styles.title, { paddingHorizontal: 16 }]}>2 Clocked In</Text>
          <Text style={[styles.subTitle, { paddingHorizontal: 16, marginBottom: 8 }]}>First shift - 8:00 AM - 5:00 PM</Text>
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]}>
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </Card>

        {/* Tasks */}
        <Card>
          <View style={styles.headerRow}>
            <Image source={require('../../../assets/images/home/icon_task_list.png')} style={styles.iconSmall} />
            <Text style={styles.headerTitle}>Tasks</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.headerCount]}>{tasks.length > 0 ? `1/${tasks.length} Task` : '0 Task'}</Text>
          </View>
          {loading ? (
            <View style={{ padding: 16, alignItems: 'center' }}><ActivityIndicator /></View>
          ) : tasks.length > 0 ? (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>{first?.title}</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.statusText}>{statusText(first?.status)}</Text>
            </View>
          ) : (
            <View style={{ padding: 16 }}><Text style={styles.title}>No tasks found.</Text></View>
          )}
          <TouchableOpacity style={[styles.button, { marginLeft: 16, marginBottom: 16 }]} onPress={onViewTasks}>
            <Text style={styles.buttonText}>View All</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
}

function statusText(status?: string) {
  switch (status) {
    case 'inProgress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return 'Not Started';
  }
}

const styles = StyleSheet.create({
  headerRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: { width: 24, height: 24, marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#424242' },
  headerCount: { fontSize: 14, color: '#424242' },
  title: { fontSize: 16, fontWeight: '500', color: '#242424' },
  subTitle: { fontSize: 14, color: '#616161' },
  statusText: { fontSize: 14, color: '#616161' },
  button: { borderWidth: 1, borderColor: '#5B57C7', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#5B57C7', fontSize: 14, fontWeight: '500' },
});
