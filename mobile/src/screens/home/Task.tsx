import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FloatingButtonAdd } from '../../ui/FloatingButton';
import { getTodoTasks } from '../../graph';

export default function TaskScreen({ token, onOpenTask }: { token: string; onOpenTask: (id: string, title?: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setItems(await getTodoTasks(token));
      } catch (e: any) {
        setError(e?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const isOverdue = (dueDateTime?: { dateTime?: string }) => {
    if (!dueDateTime?.dateTime) return false;
    const dueDate = new Date(dueDateTime.dateTime);
    dueDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'notStarted':
      default:
        return 'Not Started';
    }
  };

  const getPriorityText = (importance?: string) => {
    switch (importance) {
      case 'high':
        return 'High';
      case 'low':
        return 'Low';
      case 'normal':
      default:
        return 'Normal';
    }
  };

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'inProgress':
        return '#FFC107';
      default:
        return '#616161';
    }
  };

  const getPriorityTextColor = (importance?: string) => {
    return importance === 'high' ? '#D32F2F' : '#616161';
  };

  const formatDueDate = (dueDateTime?: { dateTime?: string }) => {
    if (!dueDateTime?.dateTime) return 'No due date';
    try {
      return new Date(dueDateTime.dateTime).toLocaleDateString();
    } catch {
      return 'No due date';
    }
  };

  const { assignedTasks, overdueTasks } = useMemo(() => {
    const overdue = items.filter((t) => t.status !== 'completed' && isOverdue(t.dueDateTime));
    const assigned = items.filter((t) => !overdue.some((o) => o.id === t.id));
    return { assignedTasks: assigned, overdueTasks: overdue };
  }, [items]);

  const renderItem = ({ item }: { item: any }) => {
    const statusText = getStatusText(item.status);
    const statusColor = getStatusTextColor(item.status);
    const priorityColor = getPriorityTextColor(item.importance);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => onOpenTask(item.id, item.title)} style={styles.rowContainer}>
          <View style={{ flex: 1, flexDirection: 'column', gap: 5 }}>
            <View style={styles.rowContainer}>
              <Text style={[styles.titleSmallStatus, { flex: 1 }]}>Due: {formatDueDate(item.dueDateTime)}</Text>
              <View style={[styles.itemContainerWithBg, { marginEnd: 8 }]}>
                <Text style={[styles.titleSmallStatus, { color: priorityColor }]}>{getPriorityText(item.importance)}</Text>
              </View>
            </View>
            <Text style={[styles.title, { marginTop: 5 }]}>{item.title}</Text>
            <Text style={[styles.titleSmallStatus, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Image source={require('../../../assets/images/home/icon_arrow.png')} style={styles.iconSmallest} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <Text style={{ color: 'red', margin: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
        <Text style={[styles.title500, { flex: 1 }]}>Assigned Task</Text>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/home/icon_filter.png')} style={styles.iconSmallest} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={assignedTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
  ListEmptyComponent={<Text style={styles.emptyListText}>No assigned tasks.</Text>}
      />

      <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}>
        <Text style={styles.title500}>Overdue Task</Text>
      </View>
      <FlatList
        data={overdueTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>No overdue tasks.</Text>}
      />
  <FloatingButtonAdd onPress={() => onOpenTask('create')} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  itemContainerWithBg: {
    backgroundColor: '#FDF3F4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  title500: {
    fontSize: 16,
    fontWeight: '500',
    color: '#242424',
  },
  titleSmallStatus: {
    color: '#616161',
    fontSize: 14,
    fontWeight: '400',
  },
  iconSmallest: {
    width: 24,
    height: 24,
  },
  emptyListText: {
    padding: 16,
    textAlign: 'center',
    color: '#616161',
  },
});
